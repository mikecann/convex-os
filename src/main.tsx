import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App.tsx";
import { OperatingSystem } from "./os/OperatingSystem.tsx";
import ErrorsProvider from "./common/errors/ErrorsProvider.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ErrorsProvider>
        <OperatingSystem>
          <App />
        </OperatingSystem>
      </ErrorsProvider>
    </ConvexAuthProvider>
  </StrictMode>,
);
