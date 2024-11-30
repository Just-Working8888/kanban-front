import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider theme={{
      token: {
        colorText: 'white'
      }
    }}>
      <App />
    </ConfigProvider>

  </React.StrictMode>,
)
