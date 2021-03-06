import React from 'react'

function switchHours(hours: number) {
    switch (hours)
    {
        case 13:
            return 1;
        case 14:
            return 2;
        case 15:
            return 3;
        case 16:
            return 4;
        case 17:
            return 5;
        case 18:
            return 6;
        case 19:
            return 7;
        case 20:
            return 8;
        case 21:
            return 9;
        case 22:
            return 10;
        case 23:
            return 11;
        case 24:
            return 12;

        default:
            return hours;
    }
}
export type FormatDateType = '12' | '24'
/**
 * Formats a Date object into a time string "hh:mm:ss" 
 * @param currentTime Date Object
 * @param format '12' | '24'
 */
export function formatDate(currentTime: Date, format: FormatDateType = "12") {
    let secondsTotal = currentTime.getSeconds();
    if (secondsTotal <= 0)
    {
        return "00:00";
    }
    let duration = new Date(currentTime.getTime());
    let hours = duration.getHours();
    let minutes = duration.getMinutes();
    let seconds = duration.getSeconds();
    let stringTimer = "";
    const isPM = hours > 12;
    if (format === "12")
    {
        hours = switchHours(hours);
    }
    const amPm = isPM ? "PM" : "AM";
    let endString = format === "12" ? " " + amPm : "";
    stringTimer += hours ? "" + hours + ":" : "00";
    stringTimer += minutes ? (minutes < 10 ? "0" : "") + minutes + ":" : "00:";
    stringTimer += seconds < 10 ? "0" + seconds : seconds;
    stringTimer += endString;

    return stringTimer;
}


/**
 *  Returns the current Date every second. 
 * @note You may use in combination with formatDate function.
 * @param initialTime Date object [Defaults to new Date()]
 * @param useTick Ticks to a new Date every second. if you want to have control pass false.
 * @example
 * import {useDate, formatDate} from 'react-use-light'
 * 
 * export function Test() {
 *     const [date] = useDate()
 *     return <h1>{formatDate(date)}</h1>
 * }
 * 
 */
function useDate(initialTime?: Date, useTick = true) {
    const [time, setTime] = React.useState(initialTime || new Date());

    if (useTick)
    {

        setTimeout(() => {
            tick();
        }, 1000);
    }

    function tick() {
        setTime(new Date());
    }
    return [time, setTime] as const;;
}




export default useDate
