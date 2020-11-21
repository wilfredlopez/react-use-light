import { EffectCallback, useEffect } from 'react';

const useEffectOnce = (effect: EffectCallback) => {
  /*eslint-disable*/
  useEffect(effect, 
    []);
};

export default useEffectOnce;
