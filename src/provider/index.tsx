import React from 'react';
import { useReducer, useMemo } from "react";
import { createContext, useContext } from "react";

const INIT_STATE: InitStateObject = {
  loading: false
}

// create context
const GlobalContext = createContext<any>({});
const reducer = (state: InitStateObject, { type, payload }: ReducerObject) => (
  { ...state, [type]: payload }
)

// use contexts
function useGlobalContext() {
  return useContext(GlobalContext);
}

const GlobalProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  return (
    <GlobalContext.Provider
      value={useMemo(() => [
        state, {
          dispatch,
        }
      ], [state])}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalProvider, useGlobalContext }