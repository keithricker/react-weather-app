import React from 'react'
import { useState, useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
}

let defaultSizes: { [key:string]:number } = {
  screenXSmall: 600,
  screenSmall: 768,
  screenMed: 992,
  screenLarge: 1200
}

export default function responsive(Component:Function,sizes=defaultSizes):Function {
  return function Responsive(props:Props):JSX.Element {

    let currentScreenWidth = window.innerWidth
    let breakpoints = Object.values(sizes)
    let sizeNames = Object.keys(sizes)

    // let columns = (props && props.columns) ? props.columns : 3 
    let maxBreakpoint = breakpoints[breakpoints.length-1]
    let maxBreakpointName = Object.keys(sizes)[breakpoints.length-1]

    function findNextBreakpoint(width:number): {value:number,name:string} {
      let val = breakpoints.find(point =>  width < point) || window.innerWidth
      return {
        value: val,
        name: sizeNames[breakpoints.indexOf(val)]
      }
    }
    let [ nextBreakpoint, setNextBreakpoint ] = useState(findNextBreakpoint(currentScreenWidth))

    useEffect(() => {

      function resizeHandler(event:Event) {

        let newScreenWidth = window.innerWidth
    
        // return if no change in current breakpoint region
        if (newScreenWidth === currentScreenWidth) return
        
        if ((newScreenWidth > maxBreakpoint) && (currentScreenWidth > maxBreakpoint)) {
          currentScreenWidth = newScreenWidth
        }
        currentScreenWidth = newScreenWidth
    
        // only do something if we have a new breakpoint
        let newBreakpoint = findNextBreakpoint(newScreenWidth)
        if (newBreakpoint.value !== nextBreakpoint.value) {
          setNextBreakpoint(newBreakpoint)
        }
      }

      window.addEventListener('resize', resizeHandler);
      return () => window.removeEventListener('resize', resizeHandler)
      
    })

    let sizeStart, sizeEnd, sizeName
    if (nextBreakpoint.value > maxBreakpoint) {
      sizeStart = maxBreakpoint
      sizeEnd = '*',
      sizeName = '*'
    } else {
      sizeStart = breakpoints[breakpoints.indexOf(nextBreakpoint.value) - 1] || 0
      sizeEnd = nextBreakpoint.value
      sizeName = nextBreakpoint.name || '*'
    }
    sizeName = sizeName || maxBreakpointName

    let breakpoint = {name:sizeName,min:sizeStart,max:sizeEnd}

    return (
      <Component currentSize={breakpoint} {...props} />
    )
  }
}