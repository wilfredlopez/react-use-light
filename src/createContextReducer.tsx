import React, { createContext, useReducer, Reducer, useContext, PropsWithChildren, useRef } from 'react'

export interface Action<T extends string = string, P extends any = any> {
    type: T
    payload?: P
}

export interface AppContextProviderProps<AppState, Actions> {
    reducer: Reducer<AppState, Actions>
    initialState: AppState
}

export default function createContextReducer<AppState, Actions>() {
    type AppContextType = [AppState, React.Dispatch<Actions>]
    const AppContext = createContext<AppContextType>([] as any)
    const AppContextProvider = ({ reducer, initialState, children }: PropsWithChildren<AppContextProviderProps<AppState, Actions>>) => {
        const [state, dispatch] = useReducer(reducer, initialState)
        const d = useRef(dispatch)
        return (
            <AppContext.Provider value={[state, d.current]}>
                {children}
            </AppContext.Provider>
        )
    }
    const useAppContext = () => useContext(AppContext)
    return [AppContextProvider, useAppContext, AppContext] as const
}