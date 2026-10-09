import { useEffect, useState } from "react";

/**
 * @description Store global del modal "Join Epicare" (mismo patrón que `loginModalStore`): se abre desde
 * cualquier sitio con `joinModalStore.open()` — opcionalmente directo en una rama (`open("agent")`).
 * Además, cualquier enlace a `#join` (o `#join-agent` / `#join-agency`) lo abre: útil para CTAs de
 * contenido y enlaces de marketing.
 */

export type JoinBranch = "agent" | "agency";
export interface JoinModalState {
  isOpen: boolean;
  /** Rama inicial (capa 2) o null para empezar en la capa 1. */
  branch: JoinBranch | null;
}

type Listener = (state: JoinModalState) => void;

let state: JoinModalState = { isOpen: false, branch: null };
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l(state));

export const joinModalStore = {
  open: (branch: JoinBranch | null = null) => {
    state = { isOpen: true, branch };
    emit();
  },
  close: () => {
    state = { isOpen: false, branch: null };
    emit();
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    listener(state);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => state,
};

/** `#join` → capa 1 · `#join-agent` / `#join-agency` → directo a esa rama. */
export const branchFromHash = (hash: string): JoinBranch | null | undefined => {
  if (hash === "#join") return null;
  if (hash === "#join-agent") return "agent";
  if (hash === "#join-agency") return "agency";
  return undefined;
};

export function useJoinModal() {
  const [modal, setModal] = useState<JoinModalState>(joinModalStore.get());
  useEffect(() => joinModalStore.subscribe(setModal), []);
  return { ...modal, open: joinModalStore.open, close: joinModalStore.close };
}
