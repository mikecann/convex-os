import { Window, WindowProps } from "../common/components/window/Window";

export function LocalWindow({ children, ...rest }: {} & WindowProps) {
  return <Window {...rest}>{children}</Window>;
}
