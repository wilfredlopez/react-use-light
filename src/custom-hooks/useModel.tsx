import { useState, useEffect, useMemo, createRef } from 'react'

export interface UseModelProps {
    /**
     * name and default value
     */
    [key: string]: string
}

type ValueType = {
    value: string
    defaultValue: string
}


interface EventTargetWithValue extends EventTarget {
    value: string
}

interface EventWithTargetValue extends Event {
    target: EventTargetWithValue
}



interface RefsTypeRequied {
    value: string
    onchange: (<ET extends EventWithTargetValue>(e: ET) => any) | null
}


export type RefsTypeMap = (HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement) & RefsTypeRequied


/**
 * Creates a 2 way bind with the returned state and the React.Ref(s) that are returned
 * @param { UseModelProps } props key value pairs where the key is the key of the Ref that will be returned and the the value is the default value of the input state.
 * @returns Tupple with the first element being the state and the second are the refs to add to input elements.
 * @example
 * 
 * const list =  {
 *     email: '',
 *     lastName: '',
 *     car: '',
 *     area: 'The cat was playing in the garden.',
 *     list: ''
 * }
 * //you can add more types to support for the refs by adding with & (this is not required)
 * type AddedTypes = RefsTypeMap & HTMLAudioElement
 * 
 * const TestApp = () => {
 *     const [state, refs] = useRefModel<typeof list, AddedTypes>(list)
 * 
 *     function onSubmit(e:React.FormEvent<HTMLFormElement> ){
 *         e.preventDefault()
 *         console.log({
 *             ...state
 *         })
 *     }
 * 
 *     return (<div>
 *         <form onSubmit={onSubmit}>
 *         <div>
 *             <label htmlFor="nameinput">Email:</label>
 *             <input  type='text' ref={refs.email} defaultValue={state.email.defaultValue} id="nameinput"></input>
 *         </div>
 *         <div>
 *             <input ref={refs.lastName} defaultValue={state.lastName.defaultValue}  id="lastnameinput"></input>
 *         </div>
 *         <div>
 *             <label htmlFor="cars">Choose a car:</label>
 *             <select ref={refs.car} id="cars" name="cars">
 *                 <option defaultValue="volvo">Volvo</option>
 *                 <option defaultValue="saab">Saab</option>
 *                 <option defaultValue="fiat">Fiat</option>
 *                 <option defaultValue="audi">Audi</option>
 *             </select>
 *         </div>
 *         <div>
 *             <textarea 
 *             ref={refs.area}
 *             defaultValue={state.area.defaultValue}
 *             name="message">
 *            
 *             </textarea>
 *         </div>
 *             <button>Submit</button>
 *         </form>
 *         <br/>
 *         <div>
 *             <input  ref={refs.list} list="browsers" />
 *             <datalist id="browsers">
 *                 <option value="Internet Explorer"></option>
 *                 <option value="Firefox"></option>
 *                 <option value="Chrome"></option>
 *                 <option value="Opera"></option>
 *                 <option value="Safari"></option>
 *             </datalist>
 *         </div>
 *         <div>
 *             {JSON.stringify(state, null, 4)}
 *         </div>
 *     </div>)
 * }
 */
export function useRefModel<T extends UseModelProps, RefsType extends HTMLElement = RefsTypeMap>(props: T) {
    const mapState = useMemo(() => Object.keys(props).map((key) => {
        return {
            [key]: {
                value: props[key],
                defaultValue: props[key]
            }
        }
    }).reduce((prev, current) => {
        return { ...prev, ...current }
    }, {}), [props])

    const refMap = useMemo(() => Object.keys(props).map((key) => {
        return { [key]: createRef<RefsType>(), }
    }).reduce((prev, current) => {
        return { ...prev, ...current }
    }, {}), [props])

    const [state, setState] = useState(mapState)

    function setStateValue(name: string, value: string) {
        setState((current) => {
            return {
                ...current,
                [name]: {
                    ...current[name],
                    value: value,
                }
            }
        })
    }


    useEffect(() => {
        function getChangeListener(key: string) {
            return function changeListener(e: any) {
                const evt: EventWithTargetValue = e
                setStateValue(key, evt.target.value)
            }
        }

        for (const refKey in refMap) {
            const input = refMap[refKey]
            if (input.current) {
                input.current.onchange = getChangeListener(refKey)
            }
        }
        return () => {
            for (const refKey in refMap) {
                const input = refMap[refKey]
                if (input.current) {
                    input.current.onchange = null
                }
            }
        }
    }, [refMap])



    return [state as Record<keyof T, ValueType>, refMap as Record<keyof T, React.Ref<RefsType>>] as const
}






