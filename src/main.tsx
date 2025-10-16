import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { FluentProvider } from "@fluentui/react-components";
import { createStudioTheme, setColors } from "./theme/studioTheme";
import App from "./App";

const studioTheme = createStudioTheme();

setColors();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <FluentProvider theme={studioTheme}>
        <App />
      </FluentProvider>
    </StrictMode>
  );
}
