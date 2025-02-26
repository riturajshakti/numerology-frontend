import definitions from './definitions'

const {} = definitions

interface MainData {
  start: Date
  end: Date
  value: number
  current?: true
}

interface PratyantarDashaData {
  start: Date
  end: Date
  pd: number
  pdValue: number
  current?: true
}

/**
 *
 * @param {Date} dob
 * @param {Date} date
 * @returns {{
 *   basic: number;
 *   destiny: number;
 *   currentMahaDasha: {start: Date, end: Date, value: number; current: true};
 *   mahaDasha: {start: Date, end: Date, value: number}[];
 *   antarDasha: {start: Date, end: Date, value: number};
 *   pratyantarDasha: {start: Date, end: Date, pd: number}[];
 *   grid: Record<'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9', string>
 * }}
 */
function getNumerologyChart(dob: Date, date: Date) {
	// ! basic
	let basic = dob.getDate().digit

	// ! destiny
	// birth day + birth month + birth year
	let destiny = dob.getDate().sum + (dob.getMonth() + 1).sum + dob.getFullYear().sum
	destiny = destiny.digit

	// ! antar dasha
	// birth day + birth month + current year (last 2 digits) + day lord
	// let dayLord = [1, 2, 9, 5, 3, 6, 8]
	let dayLord = [7, 1, 2, 3, 4, 5, 6]
	/**
	 * @type {{start: Date; end: Date; value: number} | undefined}
	 */
	let antarDasha: MainData | undefined
	// dob.getDate() + (dob.getMonth() + 1) + date.getFullYear() % 100 + dayLord[dob.getDay()]
	// antarDasha = antarDasha.digit
	let startDate = new Date(dob)
	while (startDate.getFullYear() < dob.getFullYear() + 100) {
		let endDate = new Date(startDate)
		endDate.setFullYear(endDate.getFullYear() + 1)
		endDate.setDate(endDate.getDate() - 1)
		if (date >= startDate && date <= endDate) {
			let value = dob.getDate() + (dob.getMonth() + 1) + (startDate.getFullYear() % 100) + dayLord[startDate.getDay()]
			value = value.digit
			antarDasha = {
				start: startDate,
				end: endDate,
				value
			}
		}
		startDate = endDate
	}

	// ! maha dasha
	// count = basic
	// first = birth year + basic
	// second = first + count++
	// third = second + count++
	// fourth = third + count++
	// if count is 9, then set count back to 1
	/**
	 * @type {{start: Date; end: Date; value: number; current?: true}[]}
	 */
	let mahaDasha: MainData[] = []
	/**
	 * @type {{start: Date; end: Date; value: number; current: true} | undefined}
	 */
	let currentMahaDasha: MainData | undefined
	let count = basic
	let start = dob.getFullYear()
	while (dob.getFullYear() + 100 >= start) {
		let end = start + count
		let startDate = new Date(start, dob.getMonth(), dob.getDate())
		let endDate = new Date(end, dob.getMonth(), dob.getDate())
		endDate.setDate(endDate.getDate() - 1)
		let data: MainData = {
			start: startDate,
			end: endDate,
			value: count
		}
		if (date >= startDate && date <= endDate) {
			data.current = true
			currentMahaDasha = data
		}
		mahaDasha.push(data)
		if (count === 9) {
			count = 1
		} else {
			count++
		}
		start = end
	}

	// ! Pratyantar dasha
  /**
   * @type {{start: Date; end: Date; value: number; current: true}}
   */
  let currentPd: PratyantarDashaData | undefined
	const pdValue = (n: number) => Math.round(n * 8.11)
	let pdDate = new Date(antarDasha!.start)
	let nextBirthday = new Date(pdDate)
	nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
	let pratyantarDasha = []
	let pd = antarDasha!.value
	while (pdDate <= nextBirthday) {
		let backup = new Date(pdDate)
		pdDate.setDate(pdDate.getDate() + pdValue(pd))
		if (pdDate <= nextBirthday) {
      let start = backup
      let end = new Date(pdDate)
      let data: PratyantarDashaData = {
				start,
				end,
				pd: pd,
				pdValue: pdValue(pd),
			}
      if(date >= start && date <= end) {
        data.current = true
        currentPd = data
      }
      pratyantarDasha.push(data)
		}
		if (pd === 9) {
			pd = 1
		} else {
			pd++
		}
	}

	// ! Grid
	const position: Record<number, number> = { 3: 1, 1: 2, 9: 3, 6: 4, 7: 5, 5: 6, 2: 7, 8: 8, 4: 9 } as const
	const grid: Record<number, string> = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' }
	let gridUpdate = (digit: number) => {
		if (digit > 0) {
			grid[position[digit]] += digit
		}
	}
	let day = dob.getDate()
	gridUpdate(Math.floor(day / 10))
	gridUpdate(day % 10)
	let month = dob.getMonth() + 1
	gridUpdate(Math.floor(month / 10))
	gridUpdate(month % 10)
	let year = dob.getFullYear()
	gridUpdate(Math.floor(year % 100 / 10))
	gridUpdate(year % 10)
	if (day > 10 && day % 10 !== 0) {
		gridUpdate(basic)
	}
	gridUpdate(destiny)
	if (currentMahaDasha) {
		gridUpdate(currentMahaDasha.value)
	}
	if (antarDasha) {
		gridUpdate(antarDasha.value)
	}
  if(currentPd) {
    gridUpdate(currentPd.pd)
  }

	return { basic, destiny, currentMahaDasha, mahaDasha, antarDasha, currentPd, pratyantarDasha, grid }
}

export default getNumerologyChart;

// console.log(getNumerologyChart(new Date(1996, 0, 10), 2025)) // 10/01/1996, 2025
// console.log(getNumerologyChart(new Date(2002, 9, 24), 2025)) // 24/10/2002, 2025
// console.log(getNumerologyChart(new Date(1945, 11, 23), 2025)) // 23/12/1945, 2025