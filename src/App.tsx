import { Authenticated, Unauthenticated } from "convex/react";
import SignInWindow from "./auth/SignInWindow";
import { Desktop } from "./desktop/Desktop";

export default function App() {
  return (
    <>
      {/* <Authenticated>
        <Desktop />
      </Authenticated> */}
      <Unauthenticated>
        <SignInWindow />
      </Unauthenticated>
    </>
  );
}
