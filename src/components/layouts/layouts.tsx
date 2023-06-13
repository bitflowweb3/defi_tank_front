import React from "react";

import './layouts.scss'
import { Header } from "./header";
import { Footer } from "./footer";

export const Layouts = ({ children }: ComPropsObject) => {
  return (
    <div className="w-screen flex flex-col items-center">
      <div className="h-screen w-full max-w-1000 flex flex-col gap-10 px-20 overflow-x-hidden overflow-y-auto">
        <Header />

        {children}

        <Footer />
      </div>
    </div>
  )
}