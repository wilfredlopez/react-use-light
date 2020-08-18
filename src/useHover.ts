import * as React from "react";

const { useState } = React;

const noop = () => {};

export type Element =
  | ((state: boolean) => React.ReactElement<any>)
  | React.ReactElement<any>;

/**
 * 
 * @param element 
 * @example
 * const Demo = () => {
  const element = (hovered) =>
    <div>
      Hover me! {hovered && 'Thanks!'}
    </div>;
  const [hoverable, hovered] = useHover(element);

  return (
    <div>
      {hoverable}
      <div>{hovered ? 'HOVERED' : ''}</div>
    </div>
  );
};
 */
const useHover = (element: Element): [React.ReactElement<any>, boolean] => {
  const [state, setState] = useState(false);

  const onMouseEnter = (originalOnMouseEnter?: any) =>
    (event: any) => {
      (originalOnMouseEnter || noop)(event);
      setState(true);
    };
  const onMouseLeave = (originalOnMouseLeave?: any) =>
    (event: any) => {
      (originalOnMouseLeave || noop)(event);
      setState(false);
    };

  if (typeof element === "function") {
    element = element(state);
  }

  const el = React.cloneElement(element, {
    onMouseEnter: onMouseEnter(element.props.onMouseEnter),
    onMouseLeave: onMouseLeave(element.props.onMouseLeave),
  });

  return [el, state];
};

export default useHover;
