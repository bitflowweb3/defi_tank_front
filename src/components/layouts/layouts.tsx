import React from "react";
import { styled } from "@mui/material/styles";

import './layouts.scss'
import { Header } from "./header";
import { Footer } from "./footer";
import { imgConfig } from "assets/img.config";

export const Layouts = ({ children }: ComPropsObject) => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <BackgroundTag>
        <BackgroundImageTag src={imgConfig.BGIMG} alt="" />
        <BackgroundColorTag />
      </BackgroundTag>
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