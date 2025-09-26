import { Authenticated, Unauthenticated } from "convex/react";
import { Wallpaper } from "./common/components/Wallpaper";
import SignInWindow from "./auth/SignInWindow";
import ErrorsProvider from "./common/errors/ErrorsProvider";
import { Desktop } from "./desktop/Desktop";
import { TasksProvider } from "./common/tasks/TasksContext";

export default function App() {
  return (
    <ErrorsProvider>
      <Wallpaper fullScreen>
        <Authenticated>
          <TasksProvider>
            <Desktop />
          </TasksProvider>
        </Authenticated>
        <Unauthenticated>
          <SignInWindow />
        </Unauthenticated>
      </Wallpaper>
    </ErrorsProvider>
  );
}
