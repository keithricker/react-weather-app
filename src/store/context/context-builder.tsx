import React, { createContext, useState, PropsWithChildren, ReactComponentElement, FunctionComponent } from 'react'

const store:GenericObject = {}
export const getContext = (name:string) => store[name]

export function Contextify(name:string,defaultValue:any) {

  const Context:GenericObject= createContext({
    get() {},
    set() {}
  })

  function Provider(props:PropsWithChildren):JSX.Element {

    const [data, setData] = useState(defaultValue)

    const passedState = {
      get() { return data },
      set(val:any) { setData(val) }
    }

    return (
      <Context.Provider value={passedState}>
        {props.children}
      </Context.Provider>
    )
  }

  store[name] = Context
  return (Component:FunctionComponent) => <Provider><Component /></Provider>

}