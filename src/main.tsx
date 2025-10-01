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
import { Wallpaper } from "./common/components/Wallpaper.tsx";
import UnauthenticatedContent from "./auth/UnauthenticatedContent.tsx";
import { AuthenticatedContent } from "./AuthenticatedContent.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
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
