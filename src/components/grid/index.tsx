import React from 'react'
import responsive from '../responsive/responsive'

function Grid(props:GenericObject):JSX.Element {

  let columns = props.columns || 3
  let { currentSize, breakpoints, properties={},className='', style='' } = props

  if (breakpoints && currentSize 
    && typeof currentSize.max === 'number') {

    let newColumnCount
    Object.keys(breakpoints).some((point) => {
      if (currentSize.min < +point && columns > breakpoints[point]) {
        newColumnCount = breakpoints[point]
        return true
      }
    })
    if (newColumnCount) {
      return Grid({...props,columns:newColumnCount})
    }
  }

  const children = [...props.children]
  const gridChunks = [children]
  const totalItems = children.length

  if (totalItems === 0) {
    return <div className="grid" {...properties}>{props.children}</div>
  }
  if (totalItems < columns) {
    return Grid({...props,columns:totalItems})
  }

  let lastRow, secondToLastRow
  let rows = Math.trunc(totalItems/columns)
  let remaining = totalItems % columns

  if (remaining) {
    rows++
    lastRow = children.splice(totalItems - remaining, remaining)

    secondToLastRow = children.splice(-columns)
    while (lastRow.length < secondToLastRow.length) {
      lastRow.unshift(secondToLastRow.pop())
    }

    gridChunks.push(secondToLastRow)
    gridChunks.push(lastRow)
  }

  const styles = (cols:number) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`
  })

  const attributes = {...properties}
  attributes.className = ("grid "+className).trim()

  return (
    <div {...attributes}>
      {gridChunks.map((chunk,key) => {
        let cols = chunk.length < columns ? chunk.length : columns
        return (
          <div key={'chunk-'+key} className={"grid-items grid-"+cols} style={styles(cols)}>
            {chunk}
          </div>
        )
      })}
    </div>
  )
}

export default responsive(Grid)