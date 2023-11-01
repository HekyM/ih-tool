import _ from 'lodash';


export interface EvData {
    d: number;
    m: number;
}

const CNY = {
2023: {d:22, m:0},
2024: {d:10, m:1},
2025: {d:29, m:0},
2026: {d:17, m:1},
2027: {d:6, m:1},
2028: {d:26, m:0},
2029: {d:13, m:1},
2030: {d:3, m:1},
2031: {d:23, m:0},
2032: {d:11, m:1},
2033: {d:31, m:0},
}
const LantersFestival = {
2023: {d:5, m:1},
2024: {d:24, m:1},
2025: {d:14, m:1},
2026: {d:3, m:1},
2027: {d:23, m:1},
2028: {d:11, m:1},
2029: {d:1, m:2},
2030: {d:19, m:1},
2031: {d:8, m:1},
2032: {d:27, m:1},
2033: {d:16, m:1},
}
const Easter = {
2023: {d:9, m:3},
2024: {d:31, m:2},
2025: {d:20, m:3},
2026: {d:5, m:3},
2027: {d:28, m:2},
2028: {d:16, m:3},
2029: {d:1, m:3},
2030: {d:21, m:3},
2031: {d:13, m:3},
2032: {d:28, m:2},
2033: {d:17, m:3},
}
const Boat = {
2023: {d:22, m:5},
2024: {d:10, m:5},
2025: {d:31, m:4},
2026: {d:19, m:5},
2027: {d:9, m:5},
2028: {d:28, m:4},
2029: {d:16, m:5},
2030: {d:6, m:5},
2031: {d:26, m:4},
2032: {d:14, m:5},
2033: {d:3, m:5},
}
const Qixi = {
2023: {d:22, m:7},
2024: {d:10, m:7},
2025: {d:29, m:7},
2026: {d:19, m:7},
2027: {d:7, m:7},
2028: {d:26, m:7},
2029: {d:15, m:7},
2030: {d:4, m:7},
2031: {d:23, m:7},
2032: {d:11, m:7},
2033: {d:31, m:7},
}
const Autumn = {
2023: {d:29, m:8},
2024: {d:17, m:8},
2025: {d:6, m:9},
2026: {d:25, m:8},
2027: {d:15, m:8},
2028: {d:4, m:9},
2029: {d:23, m:8},
2030: {d:12, m:8},
2031: {d:1, m:9},
2032: {d:20, m:8},
2033: {d:9, m:8},
}
const Thanksgiving = {
2023: {d:23, m:10},
2024: {d:28, m:10},
2025: {d:27, m:10},
2026: {d:26, m:10},
2027: {d:25, m:10},
2028: {d:23, m:10},
2029: {d:22, m:10},
2030: {d:28, m:10},
2031: {d:27, m:10},
2032: {d:25, m:10},
2033: {d:24, m:10},
}
const BlackFriday = {
2023: {d:24, m:10}, 
2024: {d:29, m:10}, 
2025: {d:28, m:10}, 
2026: {d:27, m:10}, 
2027: {d:26, m:10}, 
2028: {d:24, m:10}, 
2029: {d:23, m:10}, 
2030: {d:29, m:10}, 
2031: {d:28, m:10}, 
2032: {d:26, m:10}, 
2033: {d:25, m:10}, 
}

const today: Date = new Date();

function countDaysTo(today: Date, date: number, month: number): number {
    let target: Date = new Date(today.getFullYear(), month, date);
    if (target < today) {
      target.setFullYear(target.getFullYear() + 1);
    }
    let diff: number = target.getTime() - today.getTime();
    let days: number = Math.floor(diff / 86400000);
    return days;
  }

function countDays(today: Date, date: number, month: number): number {
    let target: Date = new Date(today.getFullYear(), month, date);
    let diff: number = target.getTime() - today.getTime();
    let days: number = Math.floor(diff / 86400000);
    return days;
}

function calcData(thisYear: EvData, nextYear: EvData, utcYear: number, dsc: string) {
    if (thisYear === undefined) {
        return {days: undefined, day: undefined, month: undefined, year: undefined, dsc: dsc}
    }

    let thisDays = countDays(today, thisYear.d, thisYear.m)
    if (thisDays >= 0) {
        return {days: thisDays, day: thisYear.d, month: thisYear.m, year: utcYear, dsc: dsc}
    }

    if (nextYear === undefined) {
        return {days: undefined, day: undefined, month: undefined, year: undefined, dsc: dsc}
    }

    let nextDays = countDaysTo(today, nextYear.d, nextYear.m)
    return {days: nextDays, day: nextYear.d, month: nextYear.m, year: utcYear+1, dsc: dsc}
}

function getData(obj: object, utcYear: number, dsc: string) {
    let thisYear = _.get(obj, utcYear, undefined)
    let nextYear = _.get(obj, utcYear+1, undefined)

    return calcData(thisYear, nextYear, utcYear, dsc)
}
function getConstData(thisYear: EvData, utcYear: number, dsc: string) {
    return calcData(thisYear, thisYear, utcYear, dsc)
}

function getSpecialEvents(utcYear: number) {
    return {
        "New Year": getConstData({d:1, m:0}, utcYear, '1 Jan'), // - Usually week after Christmas
        "Chinese New Year": getData(CNY, utcYear, '21 Jan - 20 Feb'),
        "Lantern Festival": getData(LantersFestival, utcYear, '~ 16 Feb'), // - 15th day of the first lunar month (end of the CNY)
        "Valentine's Day": getConstData({d:14, m:1}, utcYear, '14 Feb'), // - February 14th
        "Easter": getData(Easter, utcYear, '~ 25 Apr'),
        "Dragon Boat Festival": getData(Boat, utcYear, '~ 1 Jun'), // - 5th day of the fifth lunar month (around June 1st)
        "Anniversary": getConstData({d:15, m:5}, utcYear, '~ 15 Jun'), // - Mid-June (specific date varies based on individual celebration)
        //"The undersea adventure event": '', // - a few weeks after the anniversary (Not sure if it is annual)
        "Qixi Event": getData(Qixi, utcYear, '~ 14 Aug'), // - Seventh day of the seventh lunar month (around August 14th)
        "Mid-Autumn": getData(Autumn, utcYear, '~ 21 Sep'), // Festival - 15th day of the eighth lunar month (around September 21st)
        "Halloween": getConstData({d:31, m:9}, utcYear, '31 Oct'), // - October 31st
        "Thanksgiving": getData(Thanksgiving, utcYear, '~ 25 Nov'), // - Fourth Thursday of November (late November)
        "Black Friday": getData(BlackFriday, utcYear, '~ 27 Nov'), // - Friday following Thanksgiving (late November)
        "Christmas": getConstData({d:25, m:11}, utcYear, '25 Dec'), // - December 25th
   }
}

export const SpecialEvents = getSpecialEvents(today.getFullYear())
