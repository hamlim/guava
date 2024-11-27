import { getStore } from "guava/store";

export default function Index() {
  let store = getStore();
  console.log(store.request.url.toString());
  return (
    <html lang="en">
      <head>
        <title>Hello!</title>
      </head>
      <body>
        <h1>Index</h1>
      </body>
    </html>
  );
}
