import React from 'react';
import { ethers } from "ethers";
import { NotificationManager } from 'react-notifications';

export const copyObject = (json: any) => {
  return JSON.parse(JSON.stringify(json))
}

export const Now = () => {
  return Math.round(new Date().getTime() / 1000);
}

export const convertHMS = (value: any) => {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours: any = Math.floor(sec / 3600); // get hours
  let minutes: any = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  let seconds: any = sec - (hours * 3600) - (minutes * 60); //  get seconds

  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }

  return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
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

  tips("success", "Copied: " + tempText);
}

export const getSubString = (text: string) => {
  let tempText = text

  if (text.length > 10) {
    tempText = text.slice(0, 5) + '...' + text.slice(-5)
  }

  return tempText
}

export const ellipsis = (address: string, start: number = 6) => {
  let tempText = address

  if (address.length > (start + 7)) {
    tempText = `${address.slice(0, start)}...${address.slice(-4)}`
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

export const getSeed = (address: string) => {
  const accountNum = Number(address) || 0
  const zeroNumber = Number("0xffffffffffffffffffffffffffffffffffffffffff")
  return Math.round(accountNum / zeroNumber * 10000000)
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