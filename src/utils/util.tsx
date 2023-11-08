import { ethers } from "ethers";
import { NotificationManager } from 'react-notifications';

const toBigNum = (value: string | number, d: number | undefined = 18) => {
  return ethers.utils.parseUnits(Number(value).toFixed(d), d);
}

const fromBigNum = (value: any, d: number | undefined = 18) => {
  return parseFloat(ethers.utils.formatUnits(value, d));
}

const byte32code = (code: string): boolean => {
  try {
    if (code.length !== 66 || !code.startsWith("0x")) {
      return false
    }

    // const str = ethers.utils.parseBytes32String(code)
    return true
  } catch (err: any) {
    console.log(err)
    return false
  }
}

const getSeed = (address: string) => {
  const accountNum = Number(address) || 0
  const zeroNumber = Number("0xffffffffffffffffffffffffffffffffffffffffff")
  return Math.round(accountNum / zeroNumber * 10000000)
}

const tips = (type: string, html: string) => {
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

const textCopy = (text: string) => {
  let textField = document.createElement('textarea')
  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()

  let tempText = text
  if (text.length > 12) {
    tempText = `${text.substring(0, 7)} ... `
    tempText += text.substring(text.length, text.length - 5)
  }

  tips("success", "Copied: " + tempText);
}

const convertHMS = (value: number) => {
  const sec = Math.floor(value);
  let hours: number | string = Math.floor(sec / 3600); // get hours
  let minutes: number | string = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  let seconds: number | string = sec - (hours * 3600) - (minutes * 60); //  get seconds

  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) { hours = `0${hours}`; }
  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }

  return `${hours}:${minutes}:${seconds}`; // Return is HH : MM : SS
}

const textEllipsis = (text: string, start: number = 5, end: number = 5) => {
  if (text.length > (start + end)) {
    return `${text.slice(0, start)}...${text.slice(-1 * end)}`
  }

  return text;
}

const toLanguageFormat = (number: number): string => {
  return number?.toLocaleString('en-US', { maximumFractionDigits: 2 });
  // return number.toLocaleString('fi-FI', { maximumFractionDigits: 2 });
}

export {
  toBigNum,
  fromBigNum,

  getSeed,
  byte32code,

  tips,
  textCopy,
  convertHMS,
  textEllipsis,
  toLanguageFormat,
}