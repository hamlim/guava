export default function ErrorHandler(
  _req: Request,
  { error }: { error: Error },
) {
  return new Response("Error (not implemented yet)", { status: 500 });
}
