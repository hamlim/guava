import { writeFile } from "node:fs/promises";
import { basename, extname, join as pathJoin } from "node:path";
import fastGlob from "fast-glob";
import type { Route } from "./router";

function getRouteType(filePath: string): "api" | "page" {
  return basename(filePath).replace(extname(filePath), "").endsWith(".route")
    ? "api"
    : "page";
}

type PartialRoute = Omit<Route, "mod">;

export function collectRoutes(
  routeFiles: Array<string>,
): Map<string, PartialRoute> {
  let routeManifest = new Map<string, PartialRoute>();

  for (let file of routeFiles) {
    let relativeFilePath = file.replace("src/app", "");
    // strip src/ prefix and file extension to get route path
    let routePath = relativeFilePath
      .replace(/\.(route|page)\.(ts|tsx|js|jsx)$/, "")
      .replace(/\/index$/, "/");

    let routeFileName = basename(file);

    // check if path contains dynamic segments
    if (routePath.includes("[")) {
      let params = [];
      let pathParts = routePath.split("/");

      for (let part of pathParts) {
        if (part.startsWith("[...")) {
          // catch-all segment
          params.push(part.slice(4, -1));
          routeManifest.set(routePath, {
            routeType: "catch-all",
            rawPath: routePath,
            filePath: relativeFilePath,
            params,
            type: getRouteType(relativeFilePath),
            $type: "custom",
          });
          break;
        }
        if (part.startsWith("[")) {
          // dynamic segment
          params.push(part.slice(1, -1));
        }
      }

      if (!routeManifest.has(routePath)) {
        routeManifest.set(routePath, {
          routeType: "dynamic",
          rawPath: routePath,
          filePath: relativeFilePath,
          params,
          type: getRouteType(relativeFilePath),
          $type: "custom",
        });
      }
    } else {
      switch (routeFileName.split(".")[0]) {
        case "@not-found": {
          routeManifest.set(routePath, {
            $type: "not-found",
            routeType: "static",
            rawPath: routePath.replace("/@not-found", ""),
            filePath: relativeFilePath,
            type: getRouteType(relativeFilePath),
            params: [],
          });
          break;
        }
        case "@error": {
          routeManifest.set(routePath, {
            $type: "error",
            routeType: "static",
            rawPath: routePath.replace("/@error", ""),
            filePath: relativeFilePath,
            type: getRouteType(relativeFilePath),
            params: [],
          });
          break;
        }
        default: {
          routeManifest.set(routePath, {
            routeType: "static",
            rawPath: routePath,
            filePath: relativeFilePath,
            type: getRouteType(relativeFilePath),
            params: [],
            $type: "custom",
          });
        }
      }
    }
  }

  return routeManifest;
}

export async function generate(options: {
  rootDir: string;
}): Promise<void> {
  let destinationDir = pathJoin("./src", "routes.gen.ts");

  let routeFiles = await fastGlob(
    pathJoin(options.rootDir, "**/*.{route,page}.{ts,tsx,js,jsx}"),
  );

  let routeManifest = collectRoutes(routeFiles);
  console.log("Collected routes, writing manifest...");

  let contents = [];
  contents.push(`/** Automatically Generated! */`);
  contents.push(`import type { Route } from "guava/router";`);
  contents.push(``);
  contents.push(`export let routes: Array<[string, Route]> = [`);
  for (let [path, route] of routeManifest.entries()) {
    contents.push(
      `  [
    ${JSON.stringify(path)},
    {
      ${Object.entries(route)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(",\n      ")},
      mod: () => import("./app${route.filePath.replace(extname(route.filePath), "")}")
    }
  ],`,
    );
  }
  contents.push(`];`);

  await writeFile(destinationDir, contents.join("\n"));

  console.log("Wrote routes.gen.ts");
}
