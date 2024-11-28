export default function Api(
  _request: Request,
  context: { params: Array<string> },
) {
  console.log(context.params);
  return new Response("Hello, world!");
}
