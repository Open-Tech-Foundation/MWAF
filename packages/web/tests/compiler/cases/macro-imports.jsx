import { $state, $derived, $effect, $signal, $ref, $expose, other } from "@opentf/web";

export function MacroTest() {
  const count = $state(0);
  return <div>{count}</div>;
}
