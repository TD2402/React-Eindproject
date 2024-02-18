import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { EventPage } from './pages/EventPage';
import { EventsPage } from './pages/EventsPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import { Theme } from "./components/Theme";
import { loader } from './pages/EventsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <EventsPage />,
        // loader: postListLoader,
      },
      {
        path: '/event/:eventId',
        element: <EventPage />,
        loader: loader,
        // action: addComment,
      },
    ],
  },
]);
// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={Theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
);
