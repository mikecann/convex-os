import { useContext } from "react";
import { ErrorsContext } from "./ErrorsContext";

export function useErrorHandler() {
  const context = useContext(ErrorsContext);

  if (!context) {
    throw new Error("useErrorHandler must be used within an ErrorsProvider");
  }

  return {
    handleError: (error: unknown) => {
      if (!error) {
        context.showError("An unknown error occurred.");
        return;
      }

      if (error instanceof Error) {
        context.showError(error.message || "An unexpected error occurred.");
        return;
      }

      if (typeof error === "string") {
        context.showError(error);
        return;
      }

      if (typeof error === "object") {
        try {
          const stringified = JSON.stringify(error);
          if (stringified && stringified !== "{}") {
            context.showError(stringified);
            return;
          }
        } catch (stringifyError) {
          context.showError(
            stringifyError instanceof Error
              ? stringifyError.message
              : "An unexpected error occurred.",
          );
          return;
        }
      }

      context.showError("An unexpected error occurred.");
    },
    dismissError: context.dismissError,
  };
}
