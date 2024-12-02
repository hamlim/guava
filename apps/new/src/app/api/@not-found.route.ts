export default function NotFoundHandler(_req: Request) {
  return new Response("Not Found", { status: 404 });
}
