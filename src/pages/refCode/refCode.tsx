
import React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import { byte32code } from "utils/util";

export const Refcode = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (byte32code(code || "")) {
      window.localStorage.setItem("tank.refcode", code || "0");
      navigate('/create')
    }
  }, [code])


  return <></>
}