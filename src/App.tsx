import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { Wallpaper } from "react-windows-xp";
import SignInForm from "./components/SignInForm";

export default function App() {
  return (
    <Wallpaper
      fullScreen
      className="app-wallpaper"
      style={{
        backgroundImage: 'url("/bliss.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="app-shell">
        <header className="app-header">
          <span className="app-header-title">Convex + React + Convex Auth</span>
          <SignOutButton />
        </header>
        <main className="app-main">
          <h1 className="app-title">Convex + React + Convex Auth</h1>
          <Authenticated>
            <Content />
          </Authenticated>
          <Unauthenticated>
            <div className="unauthenticated-container">
              <SignInForm />
            </div>
          </Unauthenticated>
        </main>
      </div>
    </Wallpaper>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button className="sign-out-button" onClick={() => void signOut()}>
      Sign out
    </button>
  );
}

function Content() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <div className="loading-card">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div className="content-card">
      <p>Welcome {viewer ?? "Anonymous"}!</p>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>
      <p>
        <button
          className="primary-button"
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
      <p>
        Edit <code className="file-chip">convex/myFunctions.ts</code> to change
        your backend
      </p>
      <p>
        Edit <code className="file-chip">src/App.tsx</code> to change your
        frontend
      </p>
      <div className="resources">
        <p className="resources-title">Useful resources:</p>
        <div className="resources-grid">
          <div className="resources-column">
            <ResourceCard
              title="Convex docs"
              description="Read comprehensive documentation for all Convex features."
              href="https://docs.convex.dev/home"
            />
            <ResourceCard
              title="Stack articles"
              description="Learn about best practices, use cases, and more from a growing collection of articles, videos, and walkthroughs."
              href="https://www.typescriptlang.org/docs/handbook/2/basic-types.html"
            />
          </div>
          <div className="resources-column">
            <ResourceCard
              title="Templates"
              description="Browse our collection of templates to get started quickly."
              href="https://www.convex.dev/templates"
            />
            <ResourceCard
              title="Discord"
              description="Join our developer community to ask questions, trade tips & tricks, and show off your projects."
              href="https://www.convex.dev/community"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="resource-card">
      <a href={href} className="resource-link">
        {title}
      </a>
      <p className="resource-description">{description}</p>
    </div>
  );
}
