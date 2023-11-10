import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Typography } from "@mui/material";

import { tips, toLanguageFormat } from "utils/util";
import { useGlobalContext } from "provider";
import { ScrollWrapper } from "components/scrollbar";
import { ActionLoadingButton1 } from "components/buttons";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import baseGuild from "assets/image/banner1.webp";

const CreateGuild = () => {
  const navigate = useNavigate();
  const [state, { dispatch, mintGuild }] = useGlobalContext()
  const [loading, setLoading] = useState<boolean>(false)

  const createGuild = async () => {
    try {
      setLoading(true);
      dispatch({ type: "loading", payload: true });

      let tx = await mintGuild();
      await tx.wait();

      navigate('/');
      setLoading(false);
      tips("success", tx.hash);
      dispatch({ type: "loading", payload: false });

    } catch (err) {
      setLoading(false);
      dispatch({ type: "loading", payload: false });

      if (err.code === "ACTION_REJECTED") {
        tips("error", "User Denied ACTION");
      } else if (err.code === "UNPREDICTABLE_GAS_LIMIT") {
        tips("error", "Please check DFTL Balance");
      } else {
        tips("error", "Create guild failed!");
      }
    }
  }

  return (
    // <ScrollWrapper>
      <div>
        <div className="guild-image-panel">
          <img src= {baseGuild} alt="back" />
          <h1>DFTL GUILDS</h1>
          <h2>Play together, earn together!</h2>
          <div className="beta my-30">
            <ErrorIcon className="text-20" />
            BETA
          </div>
          <div className="step-bar">
            <div className="step">
              <CheckIcon className="text-30" />
            </div>
            <div className="line"></div>
            <div className="step">
              <CheckIcon className="text-30" />
            </div>
            <div className="line"></div>
            <div className="step">
              <CheckIcon className="text-30" />
            </div>
          </div>
          <div className="step-bar" style={{maxWidth: '660px'}}>
            <div>Create Guilds</div>
            <div>Join Battles</div>
            <div>Share rewards</div>
          </div>
        </div>
        <Stack flex={1} direction="column" className="max-w-1500 justify-center text-center my-10 m-auto rounded-12" style={{background: 'rgba(36, 36, 36, 1)'}}>
          <Stack gap={5} direction={{ xs: "column-reverse", xl: "row" }}
            className="p-25 md:p-40 lg:p-60 xl:px-80"
          >
            <div className="flex-1 flex flex-col gap-10">
              <span className="text-30 font-semibold">Create your own guild!</span>

              <div className="flex flex-col md:flex-row gap-20 justify-center " >
                <div className="flex flex-row items-end gap-10 px-10 py-10 rounded-5" style={{border: '1px solid rgba(255, 255, 255, 0.35)'}}>
                  <span className="text-20 font-semibold">Price</span>
                  <span className="text-18">{toLanguageFormat(state.guildRules.price)} DFTL</span>
                </div>
              </div>


              <Stack direction="column" className="mt-15 mx-auto text-center" style={{maxWidth: '700px'}}>
                <Typography variant="body1" style={{color: 'rgba(250, 105, 0, 0.85)'}}>
                  Welcome to the heart of our game - Guilds!
                </Typography>

                <Typography variant="body1" className="text-justify" style={{color: 'rgba(250, 105, 0, 0.85)'}}>
                  Forge unbreakable bonds with fellow players and embark on epic adventures together.
                  Together, you and your guildmates will not only conquer challenges but also earn Energy Potions as your guild's experience grows.
                  These potions can be freely exchanged, ensuring your entire guild stays battle-ready.
                </Typography>

                <Typography variant="body1" className="text-justify" style={{color: 'rgba(250, 105, 0, 0.85)'}}>
                  There's a secret to boosting your guild's strength even further - staking resources. By investing in your guild, you'll speed up the creation of Energy Potions, ensuring your battles are powered by the best. As your guild levels up, your staking potential increases, allowing you to make an even bigger impact. Guilds are your gateway to triumph - unite, empower, and define the legacy of DefitankLand!
                </Typography>
              </Stack>
              <div className="flex flex-row py-10 justify-center">
                {state.walletStatus === 2 && (
                    <ActionLoadingButton1 className="py-10" loading={loading} onClick={createGuild}>
                      Create Guild
                    </ActionLoadingButton1>
                  )}
              </div>
            </div>
          </Stack>
        </Stack>
      </div>
    // </ScrollWrapper >
  )
}

export { CreateGuild }