# react-use-light
React use without external dependencies.
> from: https://github.com/streamich/react-use

### Extra Hooks

##### useAudioContext

Just like useAudio returns the audio element,a ref to the element and the controls. this also returns the time played "00:01" and the timeleft "02:10" in minutes.

```tsx
    import {useAudioControls} from 'react-use-light'

    export function App(track){
        const [{ audio, controls, state, currentAudioTimeRef, currentAudioTimeLeftRef, ref }] = useAudioControls({
        src: track.audioUrl,
        autoPlay: false,
        loop: false,
        "aria-label": track.name,
    });

    return <div>
        <h1>{track.name}</h1>
            {audio}
    </div>
    }
```
##### useDate
```tsx
import React from 'react'    
import {useDate, formatDate} from 'react-use-light'

export function Test() {
    const [date] = useDate()
    return <h1>{formatDate(date)}</h1>
}
```