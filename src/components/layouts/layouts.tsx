import React from "react";
import { styled } from "@mui/material/styles";

import './layouts.scss'
import { Header } from "./header";
import { imgConfig } from "assets/img.config";
import { Sidebar } from "./sidebar/sidebar";

export const Layouts = ({ children }: ComPropsObject) => {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <BackgroundTag>
        <BackgroundImageTag src={imgConfig.bgImg} alt="" />
        <BackgroundColorTag />
      </BackgroundTag>

      <div className="flex-1 flex flex-row overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          <div className="relative flex-1 flex flex-col overflow-hidden">
            <div className="absolute w-full h-full overflow-x-hidden overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BackgroundTag = styled("div")(({ theme }) => ({
  backgroundColor: "#6e120066",
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  zIndex: -1,
}))

const BackgroundImageTag = styled("img")(({ theme }) => ({
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: "0.9",
}))

const BackgroundColorTag = styled("div")(({ theme }) => ({
  backgroundColor: "#6e120066",
  position: "fixed",
  left: 0,
  top: 0,
  opacity: "0.7",
  width: "100%",
  height: "100%",
}))