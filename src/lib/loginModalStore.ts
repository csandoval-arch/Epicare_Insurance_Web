import { useEffect, useState } from 'react';

type Listener = (isOpen: boolean) => void;

let isOpen = false;
const listeners = new Set<Listener>();

export const loginModalStore = {
  open: () => {
    isOpen = true;
    listeners.forEach((l) => l(true));
  },
  close: () => {
    isOpen = false;
    listeners.forEach((l) => l(false));
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    listener(isOpen);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => isOpen,
};

export function useLoginModal() {
  const [modalOpen, setModalOpen] = useState(loginModalStore.get());

  useEffect(() => {
    return loginModalStore.subscribe(setModalOpen);
  }, []);

  return {
    isOpen: modalOpen,
    open: loginModalStore.open,
    close: loginModalStore.close,
  };
}
