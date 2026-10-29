import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/products/$slug")({ beforeLoad: () => { throw redirect({ to: "/packers-movers", statusCode: 301 }); } });
