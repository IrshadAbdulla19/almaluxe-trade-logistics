import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/products/")({ beforeLoad: () => { throw redirect({ to: "/packers-movers", statusCode: 301 }); } });
