import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import {
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import "./index.css";
import { OperatingSystem } from "./os/OperatingSystem.tsx";
import ErrorsProvider from "./common/errors/ErrorsProvider.tsx";
import UnauthenticatedContent from "./unauthenticated/UnauthenticatedContent.tsx";
import { AuthenticatedContent } from "./authenticated/AuthenticatedContent.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ErrorsProvider>
        <OperatingSystem>
          <Authenticated>
            <AuthenticatedContent />
          </Authenticated>
          <Unauthenticated>
            <UnauthenticatedContent />
          </Unauthenticated>
        </OperatingSystem>
      </ErrorsProvider>
    </ConvexAuthProvider>
  </StrictMode>,
);
