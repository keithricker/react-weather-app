import React from 'react'
import { useState, useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
}

interface Sizes { [key:string]:number }

let defaultSizes:Sizes = {
  screenXSmall: 600,
  screenSmall: 768,
  screenMed: 992,
  screenLarge: 1200
}

let defaultOptions:{sizes?:Sizes,addClasses:boolean} = { sizes:defaultSizes, addClasses:false }

export default function responsive(Component:Function,options=defaultOptions):Function {

  let { sizes=defaultSizes, addClasses=false } = options
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
          return
        }
        currentScreenWidth = newScreenWidth
    
        // only do something if we have a new breakpoint
        let newBreakpoint = findNextBreakpoint(newScreenWidth)
        if (newBreakpoint.value !== nextBreakpoint.value) {
          console.error('setting state!')
          console.log({old:nextBreakpoint.value,new:newBreakpoint.value})
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
      <div className={addClasses ? "responsive "+sizeName : ''}>
        <Component currentSize={breakpoint} {...props} />
      </div>
    )
  }
}