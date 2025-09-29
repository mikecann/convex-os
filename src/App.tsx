import { Authenticated, Unauthenticated } from "convex/react";
import UnauthenticatedContent from "./auth/UnauthenticatedContent";
import { Desktop } from "./desktop/Desktop";

export default function App() {
  return (
    <>
      {/* <Authenticated>
        <Desktop />
      </Authenticated> */}
      <Unauthenticated>
        <UnauthenticatedContent />
      </Unauthenticated>
    </>
  );
}
