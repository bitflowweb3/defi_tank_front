import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { Unity, useUnityContext } from "react-unity-webgl";
import { Box, Stack, Typography, LinearProgress, linearProgressClasses } from "@mui/material";

import "./playGame.scss";
import { ActionButton2 } from "components/buttons";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";

const PlayGame = () => {
  const { unityProvider, requestFullscreen, unload, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "build/WebGL.loader.js",
    dataUrl: "build/WebGL.data.unityweb",
    frameworkUrl: "build/WebGL.framework.js.unityweb",
    codeUrl: "build/WebGL.wasm.unityweb",
  })

  const loadingPercentage = Math.round(loadingProgression * 100);

  function handleClickEnterFullscreen() {
    requestFullscreen(true);
  }

  useEffect(() => {
    return () => { if (isLoaded) unload() }
  }, [isLoaded, unload])

  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768;

  return (
    <Layouts>
      <GlobalSpacing className="flex-1 flex flex-col">
        {/* <Stack spacing={3}
          direction={{ xs: "column", md: "row" }}
          className="w-full sm:items-end md:items-center md:justify-end mt-20"
        >
          <Typography variant={"h4"} className="hidden lg:flex font-600">
            Available Platforms
          </Typography>

          <Stack direction="row" gap={2} className="justify-center">
            <a target={"_blank"} href="">
              <DownloadButton className="m-0">
                <img src={windows} className="max-w-100vw" />
              </DownloadButton>
            </a>

            <DownloadButton className="m-0"
              onClick={() => { tips("info", "Coming soon") }}
            >
              <img src={android} className="max-w-100vw" />
            </DownloadButton>
          </Stack>
        </Stack> */}

        <Box marginTop={3} className="w-full flex-1 flex flex-col">
          {!isMobile && (
            <Stack direction="column" spacing={2} className="flex-1 items-center">
              <Box className="playGame-container max-w-1500 rounded-12 border-white">
                {isLoaded === false && (
                  <Box className="loading-overlay" >
                    <Stack className="w-full">
                      <Typography fontSize={24} >Loading</Typography>

                      <BorderLinearProgress
                        variant="determinate"
                        value={loadingPercentage}
                      />
                    </Stack>
                  </Box>
                )}

                <Unity unityProvider={unityProvider}
                  className="w-full h-full rounded-12"
                // devicePixelRatio={window.devicePixelRatio}
                />
              </Box>

              <ActionButton2 className="rounded-50" onClick={handleClickEnterFullscreen}>
                Enter Fullscreen
              </ActionButton2>
            </Stack>
          )}

          {!!isMobile && (
            <Stack direction="row" className="mt-10vh">
              <Typography variant="h5" textAlign="center">
                The platform does not support mobile play yet.
              </Typography>
            </Stack>
          )}
        </Box>
      </GlobalSpacing>
    </Layouts >
  )
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: "80%",
  height: 20,
  margin: "auto",
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.secondary.main,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.light
  }
}))

export { PlayGame };