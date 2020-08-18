import React, { AudioHTMLAttributes } from "react";

export interface HTMLMediaProps
    extends React.AudioHTMLAttributes<any>, React.VideoHTMLAttributes<any> {
    src: string;
}

export interface HTMLMediaState {
    buffered: any[];
    duration: number;
    paused: boolean;
    muted: boolean;
    time: number;
    percentPlayed: number;
    volume: number;
}

interface Props extends React.AudioHTMLAttributes<any> {
    src: string;
}
interface TimeRangeType {
    start: number; end: number
}
const parseTimeRanges = (ranges: TimeRanges) => {
    const result: TimeRangeType[] = [];

    for (let i = 0; i < ranges.length; i++)
    {
        result.push({
            start: ranges.start(i),
            end: ranges.end(i),
        });
    }

    return result;
};


export type useAudioContentProps =
    & Props
    & (AudioHTMLAttributes<HTMLAudioElement> | null);

function turnSecondsToMinutes(s: number) {
    return (s - (s %= 60)) / 60 + (9 < Math.round(s) ? ":" : ":0") + Math.round(s)
}

function turnSecondsToMinutesReverse(s: number, totalDuration: number) {
    return turnSecondsToMinutes(totalDuration - s)
}


const useAudioControls = (props: useAudioContentProps) => {
    const audioRef = React.createRef<HTMLAudioElement>();
    const audioEl = <MyAudio {...props} ref={audioRef} />;
    const currentAudioTimeRef = React.useRef("0");
    const currentAudioTimeLeftRef = React.useRef("0");
    let lockPlay: boolean = false;

    const controls = {
        play: () => {
            const eleme = audioRef.current
            if (!eleme)
            {
                return
            }
            if (!lockPlay)
            {
                const promise = eleme.play();
                const isPromise = typeof promise === "object";

                if (isPromise)
                {
                    lockPlay = true;
                    const resetLock = () => {
                        lockPlay = false;
                    };
                    promise.then(resetLock, resetLock);
                }

                return promise;
            }
            return undefined;

        },
        mute: () => {
            if (audioRef.current)
            {
                audioRef.current.muted = true;
            }
        },
        pause: () => {
            const el = audioRef.current;
            if (el && !lockPlay)
            {
                return el.pause();
            }
        },
        seek: (time: number) => {
            function audioSeak(value: number) {
                var seekto = durationState * (value / 100);
                audioRef.current!.currentTime = seekto;
            }

            audioSeak(time);
        },
        unmute: () => {
            if (audioRef.current)
            {
                audioRef.current.muted = false;
            }
        },
        volume: (volume: number) => {
            const el = audioRef.current;
            if (!el)
            {
                return;
            }
            volume = Math.min(1, Math.max(0, volume));
            el.volume = volume;
            setVolumeState(volume)
        },
    };

    const [
        bufferedState,
        setBufferedState
    ] = React.useState<TimeRangeType[]>([]);


    const [timeState, setTimeState] = React.useState(0);
    const [durationState, setDurationState] = React.useState(0);
    const [percentPlayed, setPercentPlayed] = React.useState(0);
    const [volumeState, setVolumeState] = React.useState(1);
    const [muteState, setMuteState] = React.useState(false);
    const [pausedState, setPausedState] = React.useState(true);

    React.useEffect(() => {
        const audioFile = audioRef.current;

        if (audioFile && audioFile.duration)
        {
            setDurationState(audioFile.duration);
        }
    }, [audioRef]);


    const getPercentPlayed = React.useCallback(
        function getPercentPlayed(secs: number) {
            return secs * (100 / durationState);
        },
        [durationState],
    );


    React.useLayoutEffect(() => {
        if (currentAudioTimeRef)
        {

            let totalPercent = turnSecondsToMinutes(timeState);
            currentAudioTimeRef.current = totalPercent;
        }
        if (currentAudioTimeLeftRef)
        {

            let totalLeft = turnSecondsToMinutesReverse(timeState, durationState);
            currentAudioTimeLeftRef.current = totalLeft;
        }
        //eslint-disable-next-line
    }, [timeState]);

    const wrapEvent = <T extends any = any>(userEvent?: (event: T) => void, proxyEvent?: (event: T) => void) => {
        return (event: T) => {
            try
            {
                proxyEvent && proxyEvent(event);
            } finally
            {
                userEvent && userEvent(event);
            }
        };
    };


    const onPlay = () => setPausedState(false);
    const onPause = () => setPausedState(true);
    const onVolumeChange = () => {
        const el = audioRef.current;
        if (!el)
        {
            return;
        }
        setMuteState(el.muted)
        setVolumeState(el.volume)
    };
    const onDurationChange = () => {
        const el = audioRef.current;
        if (!el)
        {
            return;
        }
        const { duration, buffered } = el;
        setDurationState(duration)
        setBufferedState(parseTimeRanges(buffered))
    };
    const onTimeUpdate = () => {
        const el = audioRef.current;
        if (!el)
        {
            return;
        }
        setTimeState(el.currentTime)
        setPercentPlayed(getPercentPlayed(el.currentTime));
    };
    const onProgress = () => {
        const el = audioRef.current;
        if (!el)
        {
            return;
        }
        setBufferedState(parseTimeRanges(el.buffered))
    };

    const Listeners = {
        onPlay: wrapEvent(props.onPlay, onPlay),
        onPause: wrapEvent(props.onPause, onPause),
        onVolumeChange: wrapEvent(props.onVolumeChange, onVolumeChange),
        onDurationChange: wrapEvent(props.onDurationChange, onDurationChange),
        onTimeUpdate: wrapEvent(props.onTimeUpdate, onTimeUpdate),
        onProgress: wrapEvent(props.onProgress, onProgress),
    }

    //Initialize states
    React.useEffect(() => {
        const el = audioRef.current!;
        if (!el)
        {
            if (process.env.NODE_ENV !== "production")
            {
                console.error(
                    "useAudio() ref to <audio> element is empty at mount. " +
                    "It seem you have not rendered the audio element, which it " +
                    "returns as the first argument const [audio] = useAudio(...).",
                );
            }
            return;
        }


        setVolumeState(el.volume)
        setMuteState(el.muted)
        setPausedState(el.paused)
        // Start media, if autoPlay requested.
        if (props.autoPlay && el.paused)
        {
            controls.play();
        }
    }, [props.src, props.autoPlay, audioRef, controls]);

    //Append listeners
    React.useEffect(() => {
        const currentAudio = audioRef.current;
        if (currentAudio)
        {
            currentAudio.addEventListener('play', (e) => Listeners.onPlay(e as any))
            currentAudio.addEventListener('pause', (e) => Listeners.onPause(e as any))
            currentAudio.addEventListener('durationchange', e => Listeners.onDurationChange(e as any))
            currentAudio.addEventListener('progress', (e) => Listeners.onProgress(e as any))
            currentAudio.addEventListener('timeupdate', e => Listeners.onTimeUpdate(e as any)
            )
            currentAudio.addEventListener('volumechange', (e) => Listeners.onVolumeChange(e as any))
        }
        return () => {
            if (currentAudio)
            {
                currentAudio.removeEventListener('play', (e) => Listeners.onPlay(e as any))
                currentAudio.removeEventListener('pause', (e) => Listeners.onPause(e as any))
                currentAudio.removeEventListener('durationchange', (e) => Listeners.onDurationChange(e as any))
                currentAudio.removeEventListener('progress', (e) => Listeners.onProgress(e as any))
                currentAudio.removeEventListener('timeupdate', (e) => Listeners.onTimeUpdate(e as any))
                currentAudio.removeEventListener('volumechange', (e) => Listeners.onVolumeChange(e as any))
            }
        };

    }, [audioRef, getPercentPlayed, Listeners]);


    const state: HTMLMediaState = {
        buffered: bufferedState,
        time: timeState,
        percentPlayed: percentPlayed,
        duration: durationState,
        muted: muteState,
        paused: pausedState,
        volume: volumeState,
    };

    // const [state, setState] = React.useState();

    return [{ audio: audioEl, state, controls, ref: audioRef, currentAudioTimeRef, currentAudioTimeLeftRef }];
};

const MyAudio = React.forwardRef<HTMLAudioElement>((props, ref) => (
    <audio {...props} ref={ref}></audio>
));

export default useAudioControls;
