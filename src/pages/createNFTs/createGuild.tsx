import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Typography } from "@mui/material";

import { tips, toLanguageFormat } from "utils/util";
import { useGlobalContext } from "provider";
import { ScrollWrapper } from "components/scrollbar";
import { ActionLoadingButton1 } from "components/buttons";

import baseGuild from "assets/image/banner5.webp";

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
    <ScrollWrapper>
      <Stack flex={1} direction="column" className="max-w-1500 justify-center m-auto rounded-12 bg-boxBg">
        <Stack gap={5} direction={{ xs: "column-reverse", xl: "row" }}
          className="p-25 md:p-40 lg:p-60 xl:px-80"
        >
          <div className="flex-1 flex flex-col gap-10">
            <span className="text-30 font-semibold">Create New Guild</span>

            <div className="flex flex-col md:flex-row gap-20 justify-between">
              <div className="flex flex-row items-end gap-10">
                <span className="text-20 font-semibold">Price</span>
                <span className="text-18">{toLanguageFormat(state.guildRules.price)} DFTL</span>
              </div>

              {state.walletStatus === 2 && (
                <ActionLoadingButton1 className="py-10" loading={loading} onClick={createGuild}>
                  Create Guild
                </ActionLoadingButton1>
              )}
            </div>


            <Stack direction="column" className="mt-15">
              <Typography variant="body1">
                Welcome to the heart of our game - Guilds!
              </Typography>

              <Typography variant="body1" className="text-justify">
                Forge unbreakable bonds with fellow players and embark on epic adventures together.
                Together, you and your guildmates will not only conquer challenges but also earn Energy Potions as your guild's experience grows.
                These potions can be freely exchanged, ensuring your entire guild stays battle-ready.
              </Typography>

              <Typography variant="body1" className="text-justify">
                There's a secret to boosting your guild's strength even further - staking resources. By investing in your guild, you'll speed up the creation of Energy Potions, ensuring your battles are powered by the best. As your guild levels up, your staking potential increases, allowing you to make an even bigger impact. Guilds are your gateway to triumph - unite, empower, and define the legacy of DefitankLand!
              </Typography>
            </Stack>
          </div>

          <Stack flex={1} direction="column" className="items-center">
            <img alt=""
              src={baseGuild}
              className="max-w-400 xl:max-w-600 w-full rounded-20"
            />
          </Stack>
        </Stack>
      </Stack>
    </ScrollWrapper >
  )
}

export { CreateGuild }