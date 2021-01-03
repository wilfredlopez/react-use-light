# react-use-light

react-use without external dependencies. Collection of essential React Hooks.

Fork from [streamich/react-use](https://github.com/streamich/react-use)

## Install

```bash
npm i react-use-light
```

**or**

```bash
yarn add react-use-light
```

## Extra Hooks

#### `useAudioControls`

Just like useAudio returns the audio element,a ref to the element and the controls. this also returns the time played "00:01" and the timeleft "02:10" in minutes.

```tsx
import { useAudioControls } from 'react-use-light';

export function App(track) {
  const [{ audio, controls, state, currentAudioTimeRef, currentAudioTimeLeftRef, ref }] = useAudioControls({
    src: track.audioUrl,
    autoPlay: false,
    loop: false,
    'aria-label': track.name,
  });

  return (
    <div>
      <h1>{track.name}</h1>
      {audio}
    </div>
  );
}
```

#### `useDate`

```tsx
import React from 'react';
import { useDate, formatDate } from 'react-use-light';

export function Test() {
  const [date] = useDate();
  return <h1>{formatDate(date)}</h1>;
}
```

#### `createContextHook`

```tsx
import { createContext } from 'react';
import { createContextHook } from 'react-use-light';
import { API_URL } from '../constants';
import { AppContextState } from './reducer';

const initialState: AppContextState = {
  auth: {
    user: undefined,
    errorMessage: undefined,
    loading: false,
  },
  surveys: {
    openSurveys: [],
  },
};

export const AppContext = createContext(initialState);

let fetched = false;

export const useAppContext = createContextHook(AppContext, (context) => {
  async function fetchSurveys() {
    if (!fetched) {
      const res = await fetch(API_URL + '/surveys');
      const data = await res.json();
      fetched = true;
      return data.surveys;
    } else {
      console.log('returning from cache');
      return context.surveys.openSurveys;
    }
  }
  return { ...context, fetchSurveys };
});
```

### CreateContextReducer

<p>Creates a React Reducer and a React Context and returns useContext hook, Context and Context Provider. Make sure to provide the state type and actions type if you are using typescript.
</p>

```ts
const [ContextProvider, useContext, Context] = createContextReducer<AppState, Actions>();
```

<p>The Context Provider accepts the initial state and the reducer function.</p>
<p>The context hook returns and array with the state and the dispatch function [state, dispatch]</p>

```tsx
import { createContextReducer, Action } from 'react-use-light';
import { useState } from 'react';

// CREATE STATE TYPE
interface AppState {
  notes: string[];
  user: User | undefined;
}

//CREATE ACTIONS TYPE (Should extend Action interface >> {type:string, payload?:any})
type Actions = SetUserAction | SetNotesAction;

interface SetUserAction extends Action {
  type: 'SET_USER';
  payload: User | undefined;
}

interface SetNotesAction extends Action {
  type: 'SET_NOTES';
  payload: string[];
}
interface User {
  name: string;
  email: string;
}

//Pass the State Type and Actions Type to the create function in order to get a properly typed context.
// @returns >>> [ContextProvider, ContextHook, and Context]
const [AppContextProvider, useAppContext, AppContext] = createContextReducer<AppState, Actions>();

//create state reducer for the defined types
const reducer = (state: AppState, action: Actions): AppState => {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return { ...state };
  }
};

// initial state
const initialState: AppState = {
  notes: [],
  user: undefined,
};

// USE ContextProvider by passing initial state and the reducer function.
export function App() {
  return (
    <AppContextProvider initialState={initialState} reducer={reducer}>
      <PageOne />
    </AppContextProvider>
  );
}

// Use in ContextProvider Children
function PageOne() {
  const [{ notes }, dispatch] = useAppContext();
  const [note, setNote] = useState('');
  function addNote() {
    if (note && note.trim() !== '') {
      dispatch({
        type: 'SET_NOTES',
        payload: [...notes, note],
      });
      setNote('');
    }
  }
  return (
    <div>
      <h1>Inside Context</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNote();
        }}
      >
        <div>
          <input placeholder="add note" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </form>
      <div>
        {notes.map((n) => (
          <p key={n}>{n}</p>
        ))}
      </div>
    </div>
  );
}
```

### **Others**

- [`combineReducers`] - combines React.Reducer objects into 1.
- [`RoutePathGetter`] - Class to orginize the router paths of an application.
- [`SkeletonElement`] - React Skeleton Component.
- [`createGlobalStyle`] - Creates global styles (appends to head). you can pass a string or an object with CSSProperties. eg. {body: {backgroundColor: 'red'}}
- [`removeGlobalStyle`] - Removes global styles by id. (id returned by createGlobalStyle)
- [`useThemeStyles`] - toggles between theme styles. 'dark'|'light'. see example

```ts
const [theme, setTheme, toggleTheme] = useThemeStyles(
  'light', // default theme
  `:root{--app-color: black;}` // dark styles,
  `:root{--app-color: white;}` // light styles
);
```

### React-Use Library Documentation

- [**Sensors**](https://github.com/streamich/react-use/blob/master/docs/Sensors.md)

  - [`useBattery`](https://github.com/streamich/react-use/blob/master/docs/useBattery.md) &mdash; tracks device battery state. [![][img-demo]](https://codesandbox.io/s/qlvn662zww)
  - [`useGeolocation`](https://github.com/streamich/react-use/blob/master/docs/useGeolocation.md) &mdash; tracks geo location state of user's device. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/sensors-usegeolocation--demo)
  - [`useHover` and `useHoverDirty`](https://github.com/streamich/react-use/blob/master/docs/useHover.md) &mdash; tracks mouse hover state of some element. [![][img-demo]](https://codesandbox.io/s/zpn583rvx)
  - [`useHash`](https://github.com/streamich/react-use/blob/master/docs/useHash.md) &mdash; tracks location hash value. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/sensors-usehash--demo)
  - [`useIdle`](https://github.com/streamich/react-use/blob/master/docs/useIdle.md) &mdash; tracks whether user is being inactive.
  - [`useKey`](https://github.com/streamich/react-use/blob/master/docs/useKey.md), [`useKeyPress`](https://github.com/streamich/react-use/blob/master/docs/useKeyPress.md), and [`useKeyPressEvent`](https://github.com/streamich/react-use/blob/master/docs/useKeyPressEvent.md) &mdash; track keys. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/sensors-usekeypressevent--demo)
  - [`useLocation`](https://github.com/streamich/react-use/blob/master/docs/useLocation.md) and [`useSearchParam`](https://github.com/streamich/react-use/blob/master/docs/useSearchParam.md) &mdash; tracks page navigation bar location state.
  - [`useLongPress`](https://github.com/streamich/react-use/blob/master/docs/useLongPress.md) &mdash; tracks long press gesture of some element.
  - [`useMedia`](https://github.com/streamich/react-use/blob/master/docs/useMedia.md) &mdash; tracks state of a CSS media query. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/sensors-usemedia--demo)
  - [`useMediaDevices`](https://github.com/streamich/react-use/blob/master/docs/useMediaDevices.md) &mdash; tracks state of connected hardware devices.
  - [`useMotion`](https://github.com/streamich/react-use/blob/master/docs/useMotion.md) &mdash; tracks state of device's motion sensor.
  - [`useMouse` and `useMouseHovered`](https://github.com/streamich/react-use/blob/master/docs/useMouse.md) &mdash; tracks state of mouse position. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/sensors-usemouse--docs)
  - [`useMouseWheel`](https://github.com/streamich/react-use/blob/master/docs/useMouse.md) &mdash; tracks deltaY of scrolled mouse wheel. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/sensors-usemousewheel--docs)
  - [`useNetwork`](https://github.com/streamich/react-use/blob/master/docs/useNetwork.md) &mdash; tracks state of user's internet connection.
  - [`useOrientation`](https://github.com/streamich/react-use/blob/master/docs/useOrientation.md) &mdash; tracks state of device's screen orientation.
  - [`usePageLeave`](https://github.com/streamich/react-use/blob/master/docs/usePageLeave.md) &mdash; triggers when mouse leaves page boundaries.
  - [`useScratch`](https://github.com/streamich/react-use/blob/master/docs/useScratch.md) &mdash; tracks mouse click-and-scrub state.
  - [`useScroll`](https://github.com/streamich/react-use/blob/master/docs/useScroll.md) &mdash; tracks an HTML element's scroll position. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/sensors-usescroll--docs)
  - [`useScrolling`](https://github.com/streamich/react-use/blob/master/docs/useScrolling.md) &mdash; tracks whether HTML element is scrolling.
  - [`useStartTyping`](https://github.com/streamich/react-use/blob/master/docs/useStartTyping.md) &mdash; detects when user starts typing.
  - [`useWindowScroll`](https://github.com/streamich/react-use/blob/master/docs/useWindowScroll.md) &mdash; tracks `Window` scroll position. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/sensors-usewindowscroll--docs)
  - [`useWindowSize`](https://github.com/streamich/react-use/blob/master/docs/useWindowSize.md) &mdash; tracks `Window` dimensions. [![][img-demo]](https://codesandbox.io/s/m7ln22668)
  - [`useMeasure`](https://github.com/streamich/react-use/blob/master/docs/useMeasure.md) and [`useSize`](https://github.com/streamich/react-use/blob/master/docs/useSize.md) &mdash; tracks an HTML element's dimensions. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/sensors-usemeasure--demo)

    <br/>
    <br/>

- [**UI**](https://github.com/streamich/react-use/blob/master/docs/UI.md)
  - [`useAudio`](https://github.com/streamich/react-use/blob/master/docs/useAudio.md) &mdash; plays audio and exposes its controls. [![][img-demo]](https://codesandbox.io/s/2o4lo6rqy)
  - [`useClickAway`](https://github.com/streamich/react-use/blob/master/docs/useClickAway.md) &mdash; triggers callback when user clicks outside target area.
  - [`useCss`](https://github.com/streamich/react-use/blob/master/docs/useCss.md) &mdash; dynamically adjusts CSS.
  - [`useDrop` and `useDropArea`](https://github.com/streamich/react-use/blob/master/docs/useDrop.md) &mdash; tracks file, link and copy-paste drops.
  - [`useSlider`](https://github.com/streamich/react-use/blob/master/docs/useSlider.md) &mdash; provides slide behavior over any HTML element. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/ui-useslider--demo)
  - [`useSpeech`](https://github.com/streamich/react-use/blob/master/docs/useSpeech.md) &mdash; synthesizes speech from a text string. [![][img-demo]](https://codesandbox.io/s/n090mqz69m)
  - [`useVibrate`](https://github.com/streamich/react-use/blob/master/docs/useVibrate.md) &mdash; provide physical feedback using the [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API). [![][img-demo]](https://streamich.github.io/react-use/?path=/story/ui-usevibrate--demo)
  - [`useVideo`](https://github.com/streamich/react-use/blob/master/docs/useVideo.md) &mdash; plays video, tracks its state, and exposes playback controls. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/ui-usevideo--demo)
    <br/>
    <br/>
- [**Animations**](https://github.com/streamich/react-use/blob/master/docs/Animations.md)
  - [`useRaf`](https://github.com/streamich/react-use/blob/master/docs/useRaf.md) &mdash; re-renders component on each `requestAnimationFrame`.
  - [`useInterval`](https://github.com/streamich/react-use/blob/master/docs/useInterval.md) and [`useHarmonicIntervalFn`](https://github.com/streamich/react-use/blob/master/docs/useHarmonicIntervalFn.md) &mdash; re-renders component on a set interval using `setInterval`.
  - [`useTimeout`](https://github.com/streamich/react-use/blob/master/docs/useTimeout.md) &mdash; re-renders component after a timeout.
  - [`useTimeoutFn`](https://github.com/streamich/react-use/blob/master/docs/useTimeoutFn.md) &mdash; calls given function after a timeout. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/animation-usetimeoutfn--demo)
  - [`useUpdate`](https://github.com/streamich/react-use/blob/master/docs/useUpdate.md) &mdash; returns a callback, which re-renders component when called.
    <br/>
    <br/>
- [**Side-effects**](https://github.com/streamich/react-use/blob/master/docs/Side-effects.md)

  - [`useAsync`](https://github.com/streamich/react-use/blob/master/docs/useAsync.md), [`useAsyncFn`](https://github.com/streamich/react-use/blob/master/docs/useAsyncFn.md), and [`useAsyncRetry`](https://github.com/streamich/react-use/blob/master/docs/useAsyncRetry.md) &mdash; resolves an `async` function.

  - [`useCopyToClipboard`](https://github.com/streamich/react-use/blob/master/docs/useCopyToClipboard.md) &mdash; copies text to clipboard.
  - [`useDebounce`](https://github.com/streamich/react-use/blob/master/docs/useDebounce.md) &mdash; debounces a function. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/side-effects-usedebounce--demo)
  - [`useLocalStorage`](https://github.com/streamich/react-use/blob/master/docs/useLocalStorage.md) &mdash; manages a value in `localStorage`.
  - [`useLockBodyScroll`](https://github.com/streamich/react-use/blob/master/docs/useLockBodyScroll.md) &mdash; lock scrolling of the body element.
  - [`useRafLoop`](https://github.com/streamich/react-use/blob/master/docs/useRafLoop.md) &mdash; calls given function inside the RAF loop.
  - [`useSessionStorage`](https://github.com/streamich/react-use/blob/master/docs/useSessionStorage.md) &mdash; manages a value in `sessionStorage`.
  - [`useThrottle` and `useThrottleFn`](https://github.com/streamich/react-use/blob/master/docs/useThrottle.md) &mdash; throttles a function. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/side-effects-usethrottle--demo)
  - [`useTitle`](https://github.com/streamich/react-use/blob/master/docs/useTitle.md) &mdash; sets title of the page.
  - [`usePermission`](https://github.com/streamich/react-use/blob/master/docs/usePermission.md) &mdash; query permission status for browser APIs.
    <br/>
    <br/>

- [**Lifecycles**](https://github.com/streamich/react-use/blob/master/docs/Lifecycles.md)

  - [`useEffectOnce`](https://github.com/streamich/react-use/blob/master/docs/useEffectOnce.md) &mdash; a modified [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hook that only runs once.
  - [`useEvent`](https://github.com/streamich/react-use/blob/master/docs/useEvent.md) &mdash; subscribe to events.
  - [`useLifecycles`](https://github.com/streamich/react-use/blob/master/docs/useLifecycles.md) &mdash; calls `mount` and `unmount` callbacks.
  - [`useMountedState`](https://github.com/streamich/react-use/blob/master/docs/useMountedState.md) and [`useUnmountPromise`](https://github.com/streamich/react-use/blob/master/docs/useUnmountPromise.md) &mdash; track if component is mounted.
  - [`usePromise`](https://github.com/streamich/react-use/blob/master/docs/usePromise.md) &mdash; resolves promise only while component is mounted.
  - [`useLogger`](https://github.com/streamich/react-use/blob/master/docs/useLogger.md) &mdash; logs in console as component goes through life-cycles.
  - [`useMount`](https://github.com/streamich/react-use/blob/master/docs/useMount.md) &mdash; calls `mount` callbacks.
  - [`useUnmount`](https://github.com/streamich/react-use/blob/master/docs/useUnmount.md) &mdash; calls `unmount` callbacks.
  - [`useUpdateEffect`](https://github.com/streamich/react-use/blob/master/docs/useUpdateEffect.md) &mdash; run an `effect` only on updates.
  - [`useIsomorphicLayoutEffect`](https://github.com/streamich/react-use/blob/master/docs/useIsomorphicLayoutEffect.md) &mdash; `useLayoutEffect` that does not show warning when server-side rendering.

- [**State**](https://github.com/streamich/react-use/blob/master/docs/State.md)
  - [`createMemo`](https://github.com/streamich/react-use/blob/master/docs/createMemo.md) &mdash; factory of memoized hooks.
  - [`createReducer`](https://github.com/streamich/react-use/blob/master/docs/createReducer.md) &mdash; factory of reducer hooks with custom middleware.
  - [`createReducerContext`](https://github.com/streamich/react-use/blob/master/docs/createReducerContext.md) and [`createStateContext`](https://github.com/streamich/react-use/blob/master/docs/createStateContext.md) &mdash; factory of hooks for a sharing state between components.
  - [`useDefault`](https://github.com/streamich/react-use/blob/master/docs/useDefault.md) &mdash; returns the default value when state is `null` or `undefined`.
  - [`useGetSet`](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) &mdash; returns state getter `get()` instead of raw state.
  - [`useLatest`](https://github.com/streamich/react-use/blob/master/docs/useLatest.md) &mdash; returns the latest state or props
  - [`usePrevious`](https://github.com/streamich/react-use/blob/master/docs/usePrevious.md) &mdash; returns the previous state or props. [![][img-demo]](https://codesandbox.io/s/fervent-galileo-krgx6)
  - [`usePreviousDistinct`](https://github.com/streamich/react-use/blob/master/docs/usePreviousDistinct.md) &mdash; like `usePrevious` but with a predicate to determine if `previous` should update.
  - [`useObservable`](https://github.com/streamich/react-use/blob/master/docs/useObservable.md) &mdash; tracks latest value of an `Observable`.
  - [`useRafState`](https://github.com/streamich/react-use/blob/master/docs/useRafState.md) &mdash; creates `setState` method which only updates after `requestAnimationFrame`. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/state-userafstate--demo)
  - [`useSetState`](https://github.com/streamich/react-use/blob/master/docs/useSetState.md) &mdash; creates `setState` method which works like `this.setState`. [![][img-demo]](https://codesandbox.io/s/n75zqn1xp0)
  - [`useStateList`](https://github.com/streamich/react-use/blob/master/docs/useStateList.md) &mdash; circularly iterates over an array. [![][img-demo]](https://codesandbox.io/s/bold-dewdney-pjzkd)
  - [`useToggle` and `useBoolean`](https://github.com/streamich/react-use/blob/master/docs/useToggle.md) &mdash; tracks state of a boolean. [![][img-demo]](https://codesandbox.io/s/focused-sammet-brw2d)
  - [`useCounter`](https://github.com/streamich/react-use/blob/master/docs/useCounter.md) &mdash; tracks state of a number. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/state-usecounter--demo)
  - [`useList`](https://github.com/streamich/react-use/blob/master/docs/useList.md) ~and [`useUpsert`](https://github.com/streamich/react-use/blob/master/docs/useUpsert.md)~ &mdash; tracks state of an array. [![][img-demo]](https://codesandbox.io/s/wonderful-mahavira-1sm0w)
  - [`useMap`](https://github.com/streamich/react-use/blob/master/docs/useMap.md) &mdash; tracks state of an object. [![][img-demo]](https://codesandbox.io/s/quirky-dewdney-gi161)
  - [`useSet`](https://github.com/streamich/react-use/blob/master/docs/useSet.md) &mdash; tracks state of a Set. [![][img-demo]](https://codesandbox.io/s/bold-shtern-6jlgw)
  - [`useQueue`](https://github.com/streamich/react-use/blob/master/docs/useQueue.md) &mdash; implements simple queue.
  - [`useStateWithHistory`](https://github.com/streamich/react-use/blob/master/docs/useStateWithHistory.md) &mdash; stores previous state values and provides handles to travel through them. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/state-usestatewithhistory--demo)
  - [`useMediatedState`](https://github.com/streamich/react-use/blob/master/docs/useMediatedState.md) &mdash; like the regular `useState` but with mediation by custom function. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/state-usemediatedstate--demo)
  - [`useFirstMountState`](https://github.com/streamich/react-use/blob/master/docs/useFirstMountState.md) &mdash; check if current render is first. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/state-usefirstmountstate--demo)
  - [`useRendersCount`](https://github.com/streamich/react-use/blob/master/docs/useRendersCount.md) &mdash; count component renders. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/state-userenderscount--demo)
  - [`createGlobalState`](https://github.com/streamich/react-use/blob/master/docs/createGlobalState.md) &mdash; cross component shared state.[![][img-demo]](https://streamich.github.io/react-use/?path=/story/state-createglobalstate--demo)
  - [`useMethods`](https://github.com/streamich/react-use/blob/master/docs/useMethods.md) &mdash; neat alternative to `useReducer`. [![][img-demo]](https://streamich.github.io/react-use/?path=/story/state-usemethods--demo)
    <br/>
    <br/>

```

```
