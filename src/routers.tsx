import React from 'react';
import { NotificationContainer } from 'react-notifications';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';

import { MintPage } from 'pages/mint/mint';
import { useGlobalContext } from 'provider';
import { Loading } from 'components/Loading';
import { PoolsPage } from 'pages/pools/pools';
import { GuildList } from 'pages/guild/guild';
import { Refcode } from 'pages/refCode/refCode';
import { RewardsPage } from 'pages/rewards/rewards';
import { UserPage } from 'pages/userPage/userPage';
import { LendingPage } from 'pages/lending/lending';
import { NotFoundPage } from 'pages/404page/404page';
import { TankDetail } from 'pages/itemDetail/itemDetail';
import { ItemClassDetail, TankClassDetail } from 'pages/classDetail/classDetail';
import { ReferralPage } from 'pages/referral/referral';
import { GuildDetail } from 'pages/guild/guildDetail';

export const Routers = () => {
  const [state] = useGlobalContext()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserPage />} />
        {/* <Route path="/play" element={<GamePage />} /> */}
        <Route path="/profile" element={<UserPage />} />
        <Route path="/user/:address" element={<UserPage />} />
        <Route path="/lending" element={<LendingPage />} />

        <Route path="/create" element={<MintPage />} />
        <Route path="/create-guild" element={<GuildList />} />
        <Route path="/tank-detail/:id" element={<TankDetail />} />
        <Route path="/guild-detail/:id" element={<GuildDetail />} />
        {/* <Route path="/item-detail/:id" element={<TankDetail />} /> */}
        <Route path="/tanknft-detail/:id" element={<TankClassDetail />} />
        <Route path="/itemnft-detail/:id" element={<ItemClassDetail />} />

        <Route path="/pools" element={<PoolsPage />} />
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