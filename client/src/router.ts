// app/src/router.ts
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFoundPage } from "@/shared/components/errors/not-found";

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.VITE_BASE?.replace(/\/$/, '') || '/',
  defaultNotFoundComponent: NotFoundPage,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
