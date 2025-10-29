import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useOS } from "../../os/OperatingSystem";
import { useErrorHandler } from "../../common/errors/useErrorHandler";
import { FunctionArgs } from "convex/server";

type ProcessParams = FunctionArgs<typeof api.my.processes.start>["process"];

export function useStartCenteredApp() {
  const startApp = useMutation(api.my.processes.start);
  const centerOnScreen = useMutation(api.my.processes.centerOnScreen);
  const { desktopRect } = useOS();
  const onError = useErrorHandler();

  return (process: ProcessParams) => {
    if (!desktopRect) {
      onError(new Error("Desktop dimensions not available"));
      return Promise.reject(new Error("Desktop dimensions not available"));
    }

    return startApp({ process })
      .then((processId) =>
        centerOnScreen({
          processId,
          desktopWidth: desktopRect.width,
          desktopHeight: desktopRect.height,
        }),
      )
      .catch((error) => {
        onError(error);
        throw error;
      });
  };
}

