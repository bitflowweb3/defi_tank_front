import React from 'react';
import { ethers } from "ethers";
import { NotificationManager } from 'react-notifications';

export const copyObject = (json: any) => {
  return JSON.parse(JSON.stringify(json))
}

export const Now = () => {
  return Math.round(new Date().getTime() / 1000);
}

export const tips = (type: string, html: string) => {
  switch (type) {
    case 'info': {
      NotificationManager.info(html, "Info");
      break;
    }
    case 'success': {
      NotificationManager.success(html, "Success");
      break;
    }
    case 'warning': {
      NotificationManager.warning(html, "Warning", 3000);
      break;
    }
    case 'error': {
      NotificationManager.error(html, "Error", 5000, () => { });
      break;
    }
  }
}

export const textCopy = (text: string) => {
  let textField = document.createElement('textarea')
  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()

  let tempText = text
  if (text.length > 10) {
    tempText = `${text.substring(0, 5)} ... `
    tempText += text.substring(text.length, text.length - 5)
  }

  tips("success", "Copied: " + text);
}

export const getSubString = (text: string) => {
  let tempText = text

  if (text.length > 10) {
    tempText = text.slice(0, 5) + '...' + text.slice(-5)
  }

  return tempText
}

export const byte32code = (code: string): boolean => {
  try {
    if (code.length !== 66 || !code.startsWith("0x")) {
      return false
    }

    const str = ethers.utils.parseBytes32String(code)
    return true
  } catch (err: any) {
    console.log(err)
    return false
  }
}


/**
 * change data type from number to BigNum
 * @param {number} value - data that need to be change
 * @param {number} d - decimals
 */
export const toBigNum = (value: string | number, d: number | undefined = 18) => {
  return ethers.utils.parseUnits(Number(value).toFixed(d), d);
}

/**
* change data type from BigNum to number
* @param {ethers.BigNum} value - data that need to be change
* @param {number} d - decimals
*/
export const fromBigNum = (value: any, d: number | undefined = 18) => {
  return parseFloat(ethers.utils.formatUnits(value, d));
}