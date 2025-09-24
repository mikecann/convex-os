import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./common/components/Button";
import { Wallpaper } from "./common/components/Wallpaper";
import SignInForm from "./auth/SignInForm";
import ErrorsProvider from "./errors/ErrorsProvider";

export default function App() {
  return (
    <ErrorsProvider>
      <Wallpaper fullScreen>
        <div className="app-shell">
          <header>
            <SignOutButton />
          </header>
          <main>
            <Authenticated>
              <Content />
            </Authenticated>
            <Unauthenticated>
              <div>
                <SignInForm />
              </div>
            </Unauthenticated>
          </main>
        </div>
      </Wallpaper>
    </ErrorsProvider>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return <Button onClick={() => void signOut()}>Sign out</Button>;
}

function Content() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <div>
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome {viewer ?? "Anonymous"}!</p>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>
      <p>
        <button
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 10) });
          }}
        >
          Add a random number
        </button>
      </p>
      <p>
        Numbers:
        {numbers?.length === 0
          ? " Click the button!"
          : ` ${numbers?.join(", ") ?? "..."}`}
      </p>
    </div>
  );
}
