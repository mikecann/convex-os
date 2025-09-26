import { useEffect } from "react";

type UseKeydownOptions = {
  handler: (event: KeyboardEvent) => void;
  keys?: Array<string>;
  enabled?: boolean;
  target?: Window | Document | HTMLElement | null;
};

export function useKeydown({
  handler,
  keys,
  enabled = true,
  target,
}: UseKeydownOptions) {
  const normalizedKeys = keys ? [...keys].sort() : null;
  const subscriptionKey = normalizedKeys?.join("|") ?? "__ANY__";

  useEffect(() => {
    if (!enabled) return;

    const eventTarget =
      target ?? (typeof window === "undefined" ? null : window);
    if (!eventTarget) return;

    const keySet = normalizedKeys ? new Set(normalizedKeys) : null;

    const handleKeydown = (event: KeyboardEvent) => {
      if (keySet && !keySet.has(event.key)) return;
      handler(event);
    };

    eventTarget.addEventListener("keydown", handleKeydown);
    return () => {
      eventTarget.removeEventListener("keydown", handleKeydown);
    };
  }, [enabled, handler, subscriptionKey, target]);
}
