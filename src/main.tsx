import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { FluentProvider } from "@fluentui/react-components";
import { createStudioTheme, setColors } from "./theme/studioTheme";

import { routeTree } from "./routeTree.gen";
const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const studioTheme = createStudioTheme();

setColors();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <FluentProvider theme={studioTheme}>
        <RouterProvider router={router} />
      </FluentProvider>
    </StrictMode>
  );
}
