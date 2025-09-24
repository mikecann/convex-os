import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button, TextBox, Typography, Window } from "react-windows-xp";
import { Horizontal, Vertical } from "../common/components";

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
    <Window
      className="signin-window"
      title={windowTitleByFlow[flow]}
      style={{ width: "400px" }}
    >
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
        <Vertical gap={20}>
          <Vertical className="signin-fields">
            <TextBox
              id="email"
              type="email"
              label="Email"
              stacked
              value={email}
              onChange={setEmail}
              autoComplete="email"
              style={{ maxWidth: "200px" }}
            />
            <TextBox
              id="password"
              type="password"
              label="Password"
              stacked
              value={password}
              onChange={setPassword}
              autoComplete={
                flow === "signUp" ? "new-password" : "current-password"
              }
              style={{ maxWidth: "200px" }}
            />
          </Vertical>

          <Horizontal gap={10} justify="end">
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
          </Horizontal>
          {/* {error && (
          <div>
            <Typography variant="paragraph">{error}</Typography>
          </div>
        )} */}
        </Vertical>
      </form>
    </Window>
  );
}
