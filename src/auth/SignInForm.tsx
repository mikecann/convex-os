import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import {
  Button,
  TextBox,
  Window,
  Box,
  Horizontal,
  Vertical,
} from "../common/components";
import { useErrorHandler } from "../errors/useErrorHandler";

const windowTitleByFlow: Record<"signIn" | "signUp", string> = {
  signIn: "Sign in to Convex Desktop",
  signUp: "Create a Convex Desktop account",
};

export default function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError, dismissError } = useErrorHandler();

  return (
    <Window
      title={windowTitleByFlow[flow]}
      style={{ width: "400px" }}
      bodyStyle={{ margin: "0px 3px 0px 3px" }}
    >
      <Vertical gap={5}>
        <Vertical
          style={{
            overflow: "hidden",
          }}
        >
          <Horizontal
            align="center"
            justify="end"
            style={{
              padding: "12px",
              background: "linear-gradient(180deg, #2c6ed3 0%, #0f3e8c 100%)",
            }}
          >
            <img
              src="/convex.svg"
              alt="Convex"
              style={{ width: "96px", height: "auto" }}
            />
          </Horizontal>
          <Box
            style={{
              height: "8px",
              background: "linear-gradient(90deg, #ff9d3f 0%, #f25c05 100%)",
            }}
          />
        </Vertical>

        <form
          className="signin-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (isSubmitting) return;
            if (!email || !password) {
              handleError("Email and password are both required.");
              return;
            }
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);
            formData.append("flow", flow);
            setIsSubmitting(true);
            void signIn("password", formData)
              .then(() => {
                dismissError();
              })
              .catch((signInError: unknown) => {
                handleError({
                  message: "Password sign-in failed",
                  details: signInError,
                });
              })
              .finally(() => {
                setIsSubmitting(false);
              });
          }}
          style={{ padding: 10 }}
        >
          <Vertical gap={20}>
            <Vertical className="signin-fields">
              <TextBox
                id="email"
                type="email"
                label="Email:"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                labelStyle={{ width: "80px" }}
                style={{ width: "200px" }}
              />
              <TextBox
                id="password"
                type="password"
                label="Password:"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  flow === "signUp" ? "new-password" : "current-password"
                }
                labelStyle={{ width: "80px" }}
                style={{ width: "200px" }}
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
                  dismissError();
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
      </Vertical>
    </Window>
  );
}
