import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { Home } from './pages/index';
import { Loading } from './components/Loading'
import { useGlobalContext } from './provider'

export const Routers = () => {
  const [state] = useGlobalContext()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>

      <NotificationContainer />
      <Loading show={state.loading} opacity={0.7} />
    </BrowserRouter>
  )
}