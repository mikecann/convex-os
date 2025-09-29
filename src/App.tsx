import { Authenticated, Unauthenticated } from "convex/react";
import UnauthenticatedContent from "./auth/UnauthenticatedContent";
import { Desktop } from "./desktop/Desktop";
import { AuthenticatedContent } from "./AuthenticatedContent";

export default function App() {
  return (
    <>
      <Authenticated>
        <AuthenticatedContent />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedContent />
      </Unauthenticated>
    </>
  );
}
