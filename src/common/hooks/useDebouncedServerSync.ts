import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

/**
 * A hook that syncs local state with server state, with debouncing and smart conflict resolution.
 *
 * Features:
 * - Debounces local changes before saving to server
 * - Receives server updates without creating loops
 * - Never interrupts user while typing
 * - Skips saving on initial mount
 *
 * @param serverValue - The current value from the server
 * @param onSave - Callback to save the value to the server
 * @param debounceMs - Debounce delay in milliseconds (default: 500)
 * @returns [localValue, setLocalValue] - Local state and setter
 */
export function useDebouncedServerSync<T>(
  serverValue: T,
  onSave: (value: T) => void | Promise<void>,
  debounceMs: number = 500,
): [T, (value: T) => void] {
  const [localValue, setLocalValue] = useState(serverValue);
  const [debouncedValue] = useDebounce(localValue, debounceMs);
  const isFirstRender = useRef(true);
  const lastSavedValue = useRef(serverValue);
  const onSaveRef = useRef(onSave);

  // Keep onSave ref up to date
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Update from server when it changes, but only if user is not typing
  useEffect(() => {
    const isTyping = localValue !== debouncedValue;

    // Only sync from server if:
    // 1. User is not currently typing (no pending debounced changes)
    // 2. Server value is different from our current debounced value
    // 3. Server value is different from what we last saved (avoid loop)
    if (
      !isTyping &&
      serverValue !== debouncedValue &&
      serverValue !== lastSavedValue.current
    ) {
      lastSavedValue.current = serverValue;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalValue(serverValue);
    }
  }, [serverValue, debouncedValue, localValue]);

  // Save to server when debounced value changes
  useEffect(() => {
    // Skip on first render to avoid saving the initial value
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only save if the debounced value is different from what we last saved
    if (debouncedValue !== lastSavedValue.current) {
      lastSavedValue.current = debouncedValue;
      void onSaveRef.current(debouncedValue);
    }
  }, [debouncedValue]);

  return [localValue, setLocalValue];
}
