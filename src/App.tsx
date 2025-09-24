import { Authenticated, Unauthenticated } from "convex/react";
import { Wallpaper } from "./common/components/Wallpaper";
import SignInWindow from "./auth/SignInWindow";
import ErrorsProvider from "./common/errors/ErrorsProvider";
import { Desktop } from "./desktop/Desktop";

export default function App() {
  return (
    <ErrorsProvider>
      <Wallpaper fullScreen>
        <Authenticated>
          <Desktop />
        </Authenticated>
        <Unauthenticated>
          <SignInWindow />
        </Unauthenticated>
      </Wallpaper>
    </ErrorsProvider>
  );
}
