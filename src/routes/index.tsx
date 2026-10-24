import { createFileRoute, redirect } from "@tanstack/react-router";
import { getState } from "@/lib/store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { onboarded } = getState();
    if (!onboarded) {
      throw redirect({ to: "/welcome" });
    }
    throw redirect({ to: "/discover" });
  },
  component: () => null,
});
