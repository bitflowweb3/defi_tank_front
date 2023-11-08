import React from "react";

import './layouts.scss'
import { Header } from "./header";
import { Sidebar } from "./sidebar/sidebar";
import { imgConfig } from "assets/img.config";
import { ScrollWrapper } from "components/scrollbar";

const BgWrapper = () => {
  return (
    <div className="fixed top-0 left-0 -z-1 w-full h-full bg-mainBg">
      <img alt="" src={imgConfig.bgImg} className="fixed top-0 left-0 opacity-90 w-full h-full object-cover" />
      <div className="fixed top-0 left-0 opacity-70 w-full h-full bg-mainBg" />
    </div>
  )
}

const Layouts = ({ children }: ComPropsObject) => {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <BgWrapper />

      <div className="flex-1 flex flex-row overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          <ScrollWrapper id="fullscreen-container">
            {children}
          </ScrollWrapper>
        </div>
      </div>
    </div>
  )
}

const GlobalSpacing = ({ children, className, ...props }: any) => {
  return (
    <div className={`p-10 sm:px-30 sm:py-20 ${className}`} {...props}>
      {children}
    </div>
  )
}

export { Layouts, GlobalSpacing }