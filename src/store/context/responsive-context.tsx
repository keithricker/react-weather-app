import React, { createContext, useState, PropsWithChildren } from 'react'

export const BreakpointsContext:GenericObject= createContext({
 nextBreakpoint:{ value:'' }
})

export default function nextBreakpointProvider(props:PropsWithChildren):JSX.Element {

  const [ nextBreakpoint, _setNextBreakpoint ] = useState<{name:string,value:number}|GenericObject>({})

  function setNextBreakpoint(sizes:GenericObject,screenWidth:number,newScreenWidth:number) {

    let currentScreenWidth = screenWidth
    let breakpoints = Object.values(sizes)
    let sizeNames = Object.keys(sizes)

    // let columns = (props && props.columns) ? props.columns : 3 
    let maxBreakpoint = breakpoints[breakpoints.length-1]

    function findNextBreakpoint(width:number): {value:number,name:string} {
      let val = breakpoints.find(point =>  width < point) || window.innerWidth
      return {
        value: val,
        name: sizeNames[breakpoints.indexOf(val)]
      }
    }

    // return if no change in current breakpoint region
    if (newScreenWidth === currentScreenWidth) return
  
    if ((newScreenWidth > maxBreakpoint) && (currentScreenWidth > maxBreakpoint)) {
      currentScreenWidth = newScreenWidth
      return
    }
    currentScreenWidth = newScreenWidth

    // only do something if we have a new breakpoint
    let newBreakpoint = findNextBreakpoint(newScreenWidth)
    if (newBreakpoint.value !== nextBreakpoint.value) {
      _setNextBreakpoint(newBreakpoint)
    }  

  }

  const passedState = {
    nextBreakpoint,
    setNextBreakpoint
  }

  return (
    <BreakpointsContext.Provider value={passedState}>
      {props.children}
    </BreakpointsContext.Provider>
  )
}