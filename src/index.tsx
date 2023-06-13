import React from 'react';
import ReactDOM from 'react-dom';
import { UseWalletProvider } from 'use-wallet'

import './index.css'
import './tailwindcss.css'
import './assets/style/global.scss';

import { Routers } from './routers';
import { MuiProvider } from 'theme';
import { GlobalProvider } from './provider';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <UseWalletProvider
      // autoConnect={true}
      connectors={{ injected: { chainId: [351, 421613] } }}
    >
      <GlobalProvider>
        <MuiProvider>
          <Routers />
        </MuiProvider>
      </GlobalProvider>
    </UseWalletProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();