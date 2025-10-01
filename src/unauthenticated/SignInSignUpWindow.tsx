import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useErrorHandler } from "../common/errors/useErrorHandler";
import Vertical from "../common/components/Vertical";
import Horizontal from "../common/components/Horizontal";
import { TextBox } from "../common/components/TextBox";
import Box from "../common/components/Box";
import { Button } from "../common/components/Button";
import { LocalWindow } from "../os/windowing/LocalWindow";

const windowTitleByFlow: Record<"signIn" | "signUp", string> = {
  signIn: "Sign in to Convex Desktop",
  signUp: "Create a Convex Desktop account",
};

export function SignInSignUpWindow() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onError = useErrorHandler();

  return (
    <LocalWindow
      title={windowTitleByFlow[flow]}
      showCloseButton={false}
      showMaximizeButton={false}
      showMinimiseButton={false}
      bodyStyle={{ margin: "0px 3px 0px 3px" }}
      resizable={false}
      viewState={{ kind: "open", viewStackOrder: 0, isActive: true }}
      x={0}
      y={0}
      width={400}
      height={300}
    >
      <Vertical gap={5}>
        <Vertical
          style={{
            overflow: "hidden",
            userSelect: "none",
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
              onError("Email and password are both required.");
              return;
            }
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);
            formData.append("flow", flow);
            setIsSubmitting(true);
            void signIn("password", formData)
              .catch(onError)
              .finally(() => setIsSubmitting(false));
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
                }}
              >
                {flow === "signIn"
                  ? "Need an account? Sign up"
                  : "Already registered? Sign in"}
              </Button>
            </Horizontal>
          </Vertical>
        </form>
      </Vertical>
    </LocalWindow>
  );
}
