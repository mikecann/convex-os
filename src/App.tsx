import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
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

// function SignOutButton() {
//   const { isAuthenticated } = useConvexAuth();
//   const { signOut } = useAuthActions();

//   if (!isAuthenticated) {
//     return null;
//   }

//   return <Button onClick={() => void signOut()}>Sign out</Button>;
// }
