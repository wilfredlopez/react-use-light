import React, { createContext, useReducer, Reducer, useContext, PropsWithChildren, useRef } from 'react'

export interface Action<T extends string = string, P extends any = any> {
    type: T
    payload?: P
}

export interface AppContextProviderProps<AppState, Actions extends Action> {
    reducer: Reducer<AppState, Actions>
    initialState: AppState
}

export default function createContextReducer<AppState, Actions extends Action>() {
    type AppContextType = [AppState, React.Dispatch<Actions>, typeof useDispatchAction]
    type ActionKeys = Actions['type']

    type ActionsMap<U> = {
        [K in ActionKeys]: U extends { type: K, payload?: any } ? U['payload'] : never
    }

    type ActionsTypeMap = ActionsMap<Actions>
    function useDispatchAction<K extends keyof ActionsTypeMap>() {
        const [, dispatch] = useAppContext()
        return (type: K, payload: ActionsTypeMap[K]) => {
            const action = {
                type,
                payload
            } as any
            dispatch(action)
        }
    }
    const AppContext = createContext<AppContextType>([] as any)
    const AppContextProvider = ({ reducer, initialState, children }: PropsWithChildren<AppContextProviderProps<AppState, Actions>>) => {
        const [state, dispatch] = useReducer(reducer, initialState)
        const d = useRef(dispatch)
        const uda = useRef(useDispatchAction)
        return (
            <AppContext.Provider value={[state, d.current, uda.current]}>
                {children}
            </AppContext.Provider>
        )
    }
    const useAppContext = () => useContext(AppContext)
    return [AppContextProvider, useAppContext, AppContext, useDispatchAction] as const
}