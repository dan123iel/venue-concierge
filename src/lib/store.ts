import { useSyncExternalStore } from "react";
import type { Lang } from "./i18n";

/**
 * Device-local app state behind a tiny storage interface, so it can later
 * sync to the database after sign-in.
 */
export type Plan = { id: string; name: string; placeIds: string[] };
export type Collection = { id: string; name: string; placeIds: string[] };
export type Area = "discover" | "inspire" | "plan";
export type ResultsState = {
  query: string;
  mood: string | null;
  category: "all" | "food" | "culture" | "shopping";
  attrs: string[];
  vibes: string[];
  prices: number[];
};

export type AppState = {
  lang: Lang;
  langChosen: boolean;
  cityId: string;
  onboarded: boolean;
  plans: Plan[];
  activePlanId: string | null;
  collections: Collection[];
  reports: { placeId: string; text: string; at: string }[];
  lastArea: Area;
  results: ResultsState;
  toast: { id: number; text: string } | null;
};

export const emptyResults: ResultsState = {
  query: "",
  mood: null,
  category: "all",
  attrs: [],
  vibes: [],
  prices: [],
};

const DEFAULT: AppState = {
  lang: "en",
  langChosen: false,
  cityId: "berlin",
  onboarded: false,
  plans: [],
  activePlanId: null,
  collections: [{ id: "favorites", name: "", placeIds: [] }],
  reports: [],
  lastArea: "discover",
  results: emptyResults,
  toast: null,
};

const KEY = "rinco:v1";
export interface Storage {
  load(): Partial<AppState> | null;
  save(s: AppState): void;
}
const localStore: Storage = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  save(s) {
    try {
      const { toast: _t, ...rest } = s;
      localStorage.setItem(KEY, JSON.stringify(rest));
    } catch {
      /* ignore quota */
    }
  },
};

let state: AppState = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const saved = localStore.load();
  if (saved) state = { ...DEFAULT, ...saved, toast: null };
}

export function getState() {
  ensureLoaded();
  return state;
}

export function setState(fn: (s: AppState) => Partial<AppState>) {
  ensureLoaded();
  state = { ...state, ...fn(state) };
  localStore.save(state);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAppState<T>(sel: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => sel(getState()),
    () => sel(DEFAULT),
  );
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function showToast(text: string) {
  setState(() => ({ toast: { id: Date.now(), text } }));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => setState(() => ({ toast: null })), 1800);
}

const uid = () => Math.random().toString(36).slice(2, 9);

/** Adds a place to the active plan; creates a plan if none exists. Returns false if already present. */
export function addToPlan(placeId: string, defaultName: (n: number) => string): boolean {
  let added = false;
  setState((s) => {
    let plans = s.plans;
    let activeId = s.activePlanId;
    let active = plans.find((p) => p.id === activeId);
    if (!active) {
      active = { id: uid(), name: defaultName(plans.length + 1), placeIds: [] };
      plans = [...plans, active];
      activeId = active.id;
    }
    if (active.placeIds.includes(placeId)) return { plans, activePlanId: activeId };
    added = true;
    const updated = { ...active, placeIds: [...active.placeIds, placeId] };
    return { plans: plans.map((p) => (p.id === updated.id ? updated : p)), activePlanId: activeId };
  });
  return added;
}

export function updatePlan(id: string, fn: (p: Plan) => Plan) {
  setState((s) => ({ plans: s.plans.map((p) => (p.id === id ? fn(p) : p)) }));
}

export function newPlan(name: string) {
  const p = { id: uid(), name, placeIds: [] };
  setState((s) => ({ plans: [...s.plans, p], activePlanId: p.id }));
}

export function isSaved(s: AppState, placeId: string) {
  return s.collections.some((c) => c.placeIds.includes(placeId));
}

export function toggleSaved(placeId: string): boolean {
  const saved = isSaved(getState(), placeId);
  setState((s) => ({
    collections: saved
      ? s.collections.map((c) => ({ ...c, placeIds: c.placeIds.filter((x) => x !== placeId) }))
      : s.collections.map((c) => (c.id === "favorites" ? { ...c, placeIds: [...c.placeIds, placeId] } : c)),
  }));
  return !saved;
}

export function createCollection(name: string) {
  setState((s) => ({ collections: [...s.collections, { id: uid(), name, placeIds: [] }] }));
}

export function setResults(fn: (r: ResultsState) => Partial<ResultsState>) {
  setState((s) => ({ results: { ...s.results, ...fn(s.results) } }));
}
