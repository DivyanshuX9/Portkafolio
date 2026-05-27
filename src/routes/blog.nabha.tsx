import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/nabha")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog/$slug",
      params: { slug: "nabha-what-happens-when-technology-stops-assuming" },
      replace: true,
    });
  },
  component: () => null,
});
