### React use without external dependencies.

> from: https://github.com/streamich/react-use

### Extra Hooks

##### useAudioContext

Just like useAudio returns the audio element,a ref to the element and the controls. this also returns the time played "00:01" and the timeleft "02:10" in minutes.

```ts
    const [{ audio, controls, state, currentAudioTimeRef, currentAudioTimeLeftRef, ref }] = useAudioControls({
        src: track.audioUrl,
        autoPlay: false,
        loop: false,
        "aria-label": track.name,
    });
```