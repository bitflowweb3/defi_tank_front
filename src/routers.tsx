import React from 'react';
import { NotificationContainer } from 'react-notifications';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';

import { PlayGame } from 'pages/playGame';
import { useGlobalContext } from 'provider';
import { Loading } from 'components/Loading';
import { PoolsPage } from 'pages/pools/pools';
import { Refcode } from 'pages/refCode/refCode';
import { GuildsPage } from 'pages/guilds/guilds';
import { UserPage } from 'pages/userPage/userPage';
import { LendingPage } from 'pages/lending/lending';
import { RewardsPage } from 'pages/rewards/rewards';
import { NotFoundPage } from 'pages/404page/404page';
import { ReferralPage } from 'pages/referral/referral';
import { CreateNFTs } from 'pages/createNFTs/createNFTs';
import { TankDetail } from 'pages/tankDetail/tankDetail';
import { GuildDetail } from 'pages/guildDetail/guildDetail';
import { TankClassDetail } from 'pages/classDetail/classDetail';

const Routers = () => {
  const [state] = useGlobalContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/profile" element={<UserPage />} />
        <Route path="/user/:address" element={<UserPage />} />
        <Route path="/create-nfts" element={<CreateNFTs />} />
        <Route path="/tank-detail/:id" element={<TankDetail />} />
        <Route path="/guild-detail/:id" element={<GuildDetail />} />
        <Route path="/tanknft-detail/:id" element={<TankClassDetail />} />
        <Route path="/lending" element={<LendingPage />} />
        <Route path="/guilds" element={<GuildsPage />} />
        <Route path="/ranking" element={<RewardsPage />} />
        <Route path="/pools" element={<PoolsPage />} />
        <Route path="/referral" element={<ReferralPage />} />
        <Route path="/refcode/:code" element={<Refcode />} />
        <Route path="/play-game" element={<PlayGame />} />

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>

      <NotificationContainer />
      <Loading show={state.loading} opacity={0.7} />
    </BrowserRouter>
  )
}

export { Routers }