import { useEffect, useState } from "react";
import { keyboardJs } from "./util/keyboard";

const useKeyboardJs = (combination: string | string[]) => {
  const [state, set] = useState<[boolean, null | KeyboardEvent]>([false, null]);

  useEffect(() => {
    if (!keyboardJs) {
      return;
    }

    const down = (event) => set([true, event]);
    const up = (event) => set([false, event]);
    keyboardJs.bind(combination, down, up, true);

    return () => {
      keyboardJs.unbind(combination, down, up);
    };
  }, [combination, keyboardJs]);

  return state;
};

export default useKeyboardJs;
