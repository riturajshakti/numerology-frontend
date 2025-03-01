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
	let dayLord = [1, 2, 9, 5, 3, 6, 8]
	/**
	 * @type {{start: Date; end: Date; value: number} | undefined}
	 */
	let currentAntarDasha: MainData | undefined
	let antarDasha: MainData[] = []
	let startDate = new Date(dob)
	while (startDate.getFullYear() < dob.getFullYear() + 100) {
		let endDate = new Date(startDate)
		endDate.setFullYear(endDate.getFullYear() + 1)
		endDate.setDate(endDate.getDate() - 1)
		let value = dob.getDate() + (dob.getMonth() + 1) + (startDate.getFullYear() % 100) + dayLord[startDate.getDay()]
		value = value.digit
		let data: MainData = {
			start: startDate,
			end: endDate,
			value
		}
		antarDasha.push(data)
		if (date >= startDate && date <= endDate) {
			data.current = true
			currentAntarDasha = data
		}
		startDate = new Date(dob)
		startDate.setFullYear(endDate.getFullYear())
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
	let pdDate = new Date(currentAntarDasha!.start)
	let nextBirthday = new Date(pdDate)
	nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
	let pratyantarDasha = []
	let pd = currentAntarDasha!.value
	while (pdDate <= nextBirthday) {
		let backup = new Date(pdDate)
		pdDate.setDate(pdDate.getDate() + pdValue(pd))
		if (pdDate <= nextBirthday) {
      let start = backup
      let end = new Date(pdDate)
			end.setDate(end.getDate() - 1)
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
	const grid1: Record<number, string> = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' }
	const grid2: Record<number, string> = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' }
	let gridUpdate = (digit: number, grid: Record<number, string> = grid1, color?: string) => {
		if(color) {
			if (digit > 0) {
				grid[position[digit]] += `<span style="color: ${color};">${digit}</span>`
			}
			return
		}
		if (digit > 0) {
			grid[position[digit]] += digit
		}
	}
	// setting DOB, basic and destiny
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

	// setting other values
	if (currentMahaDasha) {
		gridUpdate(currentMahaDasha.value, grid2, '#5c038c')
	}
	if (currentAntarDasha) {
		gridUpdate(currentAntarDasha.value, grid2, '#f2670d')
	}
  if(currentPd) {
    gridUpdate(currentPd.pd, grid2, '#598da6')
  }

	return { basic, destiny, currentMahaDasha, mahaDasha, currentAntarDasha, antarDasha, currentPd, pratyantarDasha, grid1, grid2 }
}

export default getNumerologyChart;

// console.log(getNumerologyChart(new Date(1996, 0, 10), new Date(2025, 1, 28))) // 10/01/1996, 2025
// console.log(getNumerologyChart(new Date(2002, 9, 24), 2025)) // 24/10/2002, 2025
// console.log(getNumerologyChart(new Date(1945, 11, 23), 2025)) // 23/12/1945, 2025