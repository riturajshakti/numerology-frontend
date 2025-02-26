Object.defineProperty(Number.prototype, 'digit', {
	get: function (): number {
		let num: number = this
		while (num >= 10) {
			num = num
				.toString()
				.split('')
				.reduce((sum: number, digit: string) => sum + +digit, 0)
		}
		return num * 1
	}
})

Object.defineProperty(Number.prototype, 'sum', {
	get: function (): number {
		return `${this}`.split('').reduce((t, e) => t + +e, 0)
	}
})

export default {}