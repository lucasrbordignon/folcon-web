import { useEffect, useState } from "react";

interface Toast {
  id: string;
  duration?: number;
  dismiss: () => void;
  [key: string]: any; 
}

interface ToastState {
  toasts: Toast[];
}

interface ToastStore {
  state: ToastState;
  listeners: Array<(state: ToastState) => void>
  getState: () => ToastState;
  setState: (nextState: ToastState | ((state: ToastState) => ToastState)) => void;
  subscribe: (listener: (state: ToastState) => void) => () => void;
}

interface ToastProps {
  duration?: number;
  [key: string]: any; 
}

interface ToastReturn {
  id: string;
  dismiss: () => void;
  update: (props: ToastProps) => void;
}

const TOAST_LIMIT = 1;

let count = 0;
function generateId(): string {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastStore: ToastStore = {
  state: {
    toasts: [],
  },
  listeners: [],

  getState: (): ToastState => toastStore.state,

  setState: (nextState: ToastState | ((state: ToastState) => ToastState)): void => {
    if (typeof nextState === "function") {
      toastStore.state = nextState(toastStore.state);
    } else {
      toastStore.state = { ...toastStore.state, ...nextState };
    }

    toastStore.listeners.forEach((listener) => listener(toastStore.state));
  },

  subscribe: (listener: (state: ToastState) => void): (() => void) => {
    toastStore.listeners.push(listener);
    return () => {
      toastStore.listeners = toastStore.listeners.filter((l) => l !== listener);
    };
  },
};

export const toast = ({ ...props }: ToastProps): ToastReturn => {
  const id = generateId();

  const update = (props: ToastProps): void =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...props } : t
      ),
    }));

  const dismiss = (): void =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }));

  toastStore.setState((state) => ({
    ...state,
    toasts: [
      { ...props, id, dismiss },
      ...state.toasts,
    ].slice(0, TOAST_LIMIT),
  }));

  return {
    id,
    dismiss,
    update,
  };
};

export function useToast(): { toast: (props: ToastProps) => ToastReturn; toasts: Toast[] } {
  const [state, setState] = useState<ToastState>(toastStore.getState());

  useEffect(() => {
    const unsubscribe = toastStore.subscribe((state: ToastState) => {
      setState(state);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    state.toasts.forEach((toast) => {
      if (toast.duration === Infinity) {
        return;
      }

      const timeout = setTimeout(() => {
        toast.dismiss();
      }, toast.duration || 5000);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [state.toasts]);

  return {
    toast,
    toasts: state.toasts,
  };
}