Number.prototype.singleDigit = function () {
  let num = this
  while (num >= 10) {
    num = num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + +digit, 0)
  }
  return num * 1
}

/**
 * 
 * @param {Date} date 
 * @param {number} year 
 * @returns {{basic: number; destiny: number; antarDasha: number; mahaDasha: number, pryantyarDasha: {start: Date, end: Date, pd: number}[], grid: Record<1|2|3|4|5|6|7|8|9, number>}}
 */
function getNumerologyChart(date, year) {
  // ! basic
  let basic = date.getDate().singleDigit()

  // ! destiny
  // birth day + birth month + birth year
  let destiny = basic + (date.getMonth() + 1).singleDigit() + date.getFullYear().singleDigit()
  destiny = destiny.singleDigit()

  // ! antar dasha
  // birth day + birth month + current year (last 2 digits) + day lord (date.getDay() + 1)
  let antarDasha = date.getDate().singleDigit()
  antarDasha += (date.getMonth() + 1).singleDigit() 
  antarDasha += (year % 100).singleDigit()
  antarDasha += date.getDay() + 1
  antarDasha = antarDasha.singleDigit()

  // ! maha dasha
  // count = basic
  // first = birth year + basic
  // second = first + count++
  // third = second + count++
  // fourth = third + count++
  // if count is 9, then set count back to 1
  let mahaDasha = [date.getFullYear()]
  let count = basic
  while(mahaDasha.length < 100) {
    mahaDasha.push(mahaDasha.at(-1) + count)
    if(count === 9) {
      count = 1
    } else {
      count++
    }
  }

  // ! Pryantyar dasha
  const pdValue = (n) => Math.round(n * 8.11)
  let pdDate = new Date(date)
  let nextBirthday = new Date(pdDate)
  nextBirthday.setYear(nextBirthday.getFullYear() + 1)
  let pryantyarDasha = []
  let pd = antarDasha
  while(pdDate <= nextBirthday) {
    let backup = new Date(pdDate)
    pdDate.setDate(pdDate.getDate() + pdValue(pd))
    if(pdDate <= nextBirthday) {
      pryantyarDasha.push({start: backup, end: new Date(pdDate), pd: pd, pdValue: pdValue(pd)})
    }
    if(pd === 9) {
      pd = 1
    } else {
      pd++
    }
  }

  // ! Grid
  const position = {3: 1, 1: 2, 9: 3, 6: 4, 7: 5, 5: 6, 2: 7, 8: 8, 4: 9}
  let grid = {1: '', 2: '', 3: '', 4:'', 5:'', 6:'', 7:'', 8: '', 9: ''}
  let gridUpdate = (digit) => {
    if(digit > 0) {
      grid[position[digit]] += digit
    }
  }
  let day = date.getDate()
  gridUpdate(Math.floor(day / 10))
  gridUpdate(day % 10)
  let month = date.getMonth() + 1
  gridUpdate(Math.floor(month / 10))
  gridUpdate(month % 10)
  year = date.getFullYear()
  gridUpdate(Math.floor(year / 1000) % 10)
  gridUpdate(year % 10)
  gridUpdate(basic)
  gridUpdate(destiny)
  gridUpdate(antarDasha)

  return {basic, destiny, antarDasha, mahaDasha, pryantyarDasha, grid}
}

export default getNumerologyChart;

// console.log(getNumerologyChart(new Date(1996, 0, 10), 2025)) // 10/01/1996, 2025
// console.log(getNumerologyChart(new Date(2002, 9, 24), 2025)) // 24/10/2002, 2025
// console.log(getNumerologyChart(new Date(1945, 11, 23), 2025)) // 23/12/1945, 2025