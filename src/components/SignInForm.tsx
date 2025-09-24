import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button, TextBox, Typography, Window } from "react-windows-xp";

const windowTitleByFlow: Record<"signIn" | "signUp", string> = {
  signIn: "Sign in to Convex Desktop",
  signUp: "Create a Convex Desktop account",
};

export default function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Window className="signin-window" title={windowTitleByFlow[flow]}>
      <form
        className="signin-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (isSubmitting) return;
          if (!email || !password) {
            setError("Email and password are both required.");
            return;
          }
          const formData = new FormData();
          formData.append("email", email);
          formData.append("password", password);
          formData.append("flow", flow);
          setIsSubmitting(true);
          void signIn("password", formData)
            .then(() => {
              setError(null);
            })
            .catch((signInError: Error) => {
              setError(`Password sign-in failed: ${signInError.message}`);
            })
            .finally(() => {
              setIsSubmitting(false);
            });
        }}
      >
        <Typography variant="paragraph">
          Log in to see the numbers straight from the Convex cloud.
        </Typography>
        <TextBox
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <TextBox
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete={flow === "signUp" ? "new-password" : "current-password"}
        />
        <div className="signin-actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? flow === "signIn"
                ? "Signing in..."
                : "Creating account..."
              : flow === "signIn"
                ? "Sign in"
                : "Sign up"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              setFlow(flow === "signIn" ? "signUp" : "signIn");
              setError(null);
            }}
          >
            {flow === "signIn"
              ? "Need an account? Sign up"
              : "Already registered? Sign in"}
          </Button>
        </div>
        {error && (
          <div className="signin-error">
            <Typography variant="paragraph">{error}</Typography>
          </div>
        )}
      </form>
    </Window>
  );
}
