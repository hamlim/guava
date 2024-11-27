import type { ReactNode } from "react";

export default function Fallback({
  children,
}: { children: ReactNode }): ReactNode {
  return (
    <html lang="en">
      <head>
        <title>No Route Matched</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
