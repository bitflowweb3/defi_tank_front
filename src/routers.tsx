import React from 'react';
import { NotificationContainer } from 'react-notifications';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';

import { MintPage } from './pages/mint/mint';
import { useGlobalContext } from './provider';
import { PoolsPage } from 'pages/pools/pools';
import { Loading } from './components/Loading';
import { Refcode } from './pages/refCode/refCode';
import { UserPage } from './pages/userPage/userPage';
import { LendingPage } from './pages/lending/lending';
import { NotFoundPage } from './pages/404page/404page';
import { ItemDetail } from './pages/itemDetail/itemDetail';
import { ClassDetail } from 'pages/classDetail/classDetail';
import RewardsPage from 'pages/rewards/rewards';
import { ReferralPage } from 'pages/referral/referral';

export const Routers = () => {
  const [state] = useGlobalContext()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/create" element={<MintPage />} />
        <Route path="/my-tanks" element={<UserPage />} />
        <Route path="/user/:address" element={<UserPage />} />
        <Route path="/lending" element={<LendingPage />} />
        <Route path="/detail/:id" element={<ItemDetail />} />
        <Route path="/class-detail/:id" element={<ClassDetail />} />
        <Route path="/pools" element={<PoolsPage />} />
        {/* <Route path="/play" element={<GamePage />} /> */}
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/referrals" element={<ReferralPage />} />
        <Route path="/refcode/:code" element={<Refcode />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <NotificationContainer />
      <Loading show={state.loading} opacity={0.7} />
    </BrowserRouter>
  )
}