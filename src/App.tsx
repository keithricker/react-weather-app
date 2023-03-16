import React, { PropsWithChildren,useEffect, useRef } from 'react'
import reactlogo from './assets/react.svg'
import vitelogo from '../public/vite.svg'
import './App.css'
import CurrentConditions from './components/current-conditions/current-conditions'

function App(props:PropsWithChildren): JSX.Element {

  const styles = {
    imageContainer: {
      width: "100%"
    }
  }

  return (
    <div className="App">

      <div id="header" style={styles.imageContainer}>
        <a href="/" target="_blank">
          <img src="/weatherapplogolightblue.png" className="logo app-logo" alt="Vite logo" />
        </a>
      </div>

      <div id="main">
        <CurrentConditions />
      </div>

      <div id="footer" className="theme-dark">
        <h2>Powered By:</h2>
        <div className="columns two-columns">
          <a href="https://reactjs.org" className="column right-justify" target="_blank">
            <img src={reactlogo} className="logo react-logo" alt="React logo" />
          </a>
          <a href="https://vitejs.dev" className="column left-justify" target="_blank">
            <img src={vitelogo} className="logo vite-logo" alt="Vite logo" />
          </a>          
        </div>
        <h1 className="header">React Demo for Insight2Profit</h1>
      </div>

    </div>
  )
}

export default App
