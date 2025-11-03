import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { Doc } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { ConnectedWindow } from "../../../os/windowing/ConnectedWindow";
import { useErrorHandler } from "../../../common/errors/useErrorHandler";
import { MenuBar } from "./MenuBar";
import { StandardToolbar } from "./StandardToolbar";
import { BrowserContent } from "./BrowserContent";
import { StatusBar } from "./StatusBar";
import Horizontal from "../../../common/components/Horizontal";
import { AddressBar } from "./AddressBar";

const DEFAULT_URL = "https://www.mikecann.blog";

export function InternetExplorerWindow({
  process,
  window,
}: {
  process: Process<"internet_explorer">;
  window: Doc<"windows">;
}) {
  const updateProcessProps = useMutation(api.my.processes.updateProps);
  const updateWindowTitle = useMutation(api.my.windows.updateTitle);
  const onError = useErrorHandler();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentUrl = process.props.url || DEFAULT_URL;
  const history = process.props.history || [DEFAULT_URL];
  const historyIndex = process.props.historyIndex ?? history.length - 1;

  const [urlInput, setUrlInput] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUrlInput(currentUrl);
  }, [currentUrl]);

  const navigateToUrl = (url: string) => {
    let normalizedUrl = url.trim();
    if (!normalizedUrl) return;

    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    )
      normalizedUrl = "https://" + normalizedUrl;

    setIsLoading(true);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(normalizedUrl);

    updateProcessProps({
      processId: process._id,
      props: {
        url: normalizedUrl,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      },
    })
      .then(() =>
        updateWindowTitle({
          windowId: window._id,
          title: `${normalizedUrl} - Microsoft Internet Explorer`,
        }),
      )
      .catch(onError)
      .finally(() => setIsLoading(false));
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  return (
    <ConnectedWindow
      window={window}
      resizable
      titleBarStyle={{
        background: "linear-gradient(to bottom, #316ac5 0%, #1e3a8a 100%)",
        color: "#fff",
        fontWeight: "normal",
      }}
      statusBar={<StatusBar />}
      showCloseButton
      showMaximizeButton
      bodyStyle={{
        marginTop: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#fff",
        }}
      >
        <Horizontal style={{ backgroundColor: "#ece9d8" }}>
          <MenuBar />
          <AddressBar
            url={urlInput}
            isLoading={isLoading}
            onUrlChange={setUrlInput}
            onGo={() => navigateToUrl(urlInput)}
          />
        </Horizontal>
        <StandardToolbar
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onBack={() => {
            if (historyIndex <= 0) return;
            const newIndex = historyIndex - 1;
            const url = history[newIndex];
            setIsLoading(true);
            updateProcessProps({
              processId: process._id,
              props: {
                url,
                historyIndex: newIndex,
              },
            })
              .then(() =>
                updateWindowTitle({
                  windowId: window._id,
                  title: `${url} - Microsoft Internet Explorer`,
                }),
              )
              .catch(onError)
              .finally(() => setIsLoading(false));
          }}
          onForward={() => {
            if (historyIndex >= history.length - 1) return;
            const newIndex = historyIndex + 1;
            const url = history[newIndex];
            setIsLoading(true);
            updateProcessProps({
              processId: process._id,
              props: {
                url,
                historyIndex: newIndex,
              },
            })
              .then(() =>
                updateWindowTitle({
                  windowId: window._id,
                  title: `${url} - Microsoft Internet Explorer`,
                }),
              )
              .catch(onError)
              .finally(() => setIsLoading(false));
          }}
          onStop={() => {
            if (iframeRef.current) setIsLoading(false);
          }}
          onRefresh={() => {
            if (!iframeRef.current) return;
            setIsLoading(true);
            const currentSrc = iframeRef.current.src;
            iframeRef.current.src = "";
            setTimeout(() => {
              if (iframeRef.current) iframeRef.current.src = currentSrc;
              setIsLoading(false);
            }, 100);
          }}
          onHome={() => navigateToUrl(DEFAULT_URL)}
        />
        <BrowserContent
          iframeRef={iframeRef}
          url={currentUrl}
          isLoading={isLoading}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </ConnectedWindow>
  );
}
