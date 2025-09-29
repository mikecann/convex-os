import { Authenticated, Unauthenticated } from "convex/react";
import { Wallpaper } from "./common/components/Wallpaper";
import SignInWindow from "./auth/SignInWindow";
import ErrorsProvider from "./common/errors/ErrorsProvider";
import { Desktop } from "./desktop/Desktop";
import { TasksSystem } from "./common/tasks/TasksSystem";

export default function App() {
  return (
    <ErrorsProvider>
      <Wallpaper fullScreen>
        <Authenticated>
          <TasksSystem>
            <Desktop />
          </TasksSystem>
        </Authenticated>
        <Unauthenticated>
          <SignInWindow />
        </Unauthenticated>
      </Wallpaper>
    </ErrorsProvider>
  );
}
