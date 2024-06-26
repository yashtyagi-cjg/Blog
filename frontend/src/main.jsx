import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {MantineProvider} from "@mantine/core"
import routes from './routes/routes'


const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider >
        <RouterProvider router={router}/>
    </MantineProvider>
  </React.StrictMode>,
)
