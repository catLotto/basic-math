const find = (t, v, s = 0) => {
	const p = t.slice(s % t.length).search(v);
	if (p === -1) return -1;
	else return p + s % t.length;
};
const pop = (arr, sv, ev = 1) => {
	ev = (arr.length + ev % arr.length) % arr.length;
	return arr.splice(sv, ev);
};

class Solve {
	constructor(...equationStr) {
		// y = a * x + 3 | [ 'y' ], [ 'a * x', '+3' ]
		// y = 0, a = 6 
		// y - a * x - 3 = 0 [ 'y', '-a * x' ], [ '+3' ]
		// 0 - 6 * x - 3 = 0 [ '0', '-6 * x' ], [ '+3' ]
		// - 6 * x - 3 = 0 [ '-6 * x' ], [ '+3' ]
		// 6 * x + 3 = 0 [ '6 * x' ], [ '-3' ]
		// 6 * x = -3 [ '6 * x' ], [ '-3' ]
		// 6 * x = -3 [ 'x' ], [ '-3/6' ]
		
		// 0 = 
//		this.equations = equationStr.split(',').map(i => i.trim());
		this.equations = equationStr;
		this.equationsStructure = [];

		for (const equation of this.equations) {
			this.equationsStructure.push(this.parseEq(equation));
		}
	}
	
	asterWrap(str) {
		let n = '1';
		let r = '';
		str.replace(/\//g, '/{od}').split(/[*/]/g)
			.map(item => item.replace(/{od}/g, '/'))
			.forEach(item => {
				if (item.search(/\d/) === -1) {
					r += item.search('/') === -1 ? '*' + item : item;
				}	else {
					n += item.search('/') === -1 ? '*' + item : item;
				}
			});
		return eval(n) + r;
	}
	
	plusTainter(r) {
		for (const mode in r) {
			let n = 0;
			r[mode] = r[mode].map(item => {
				if (!item.match(/[a-zA-Z]/g)) {
					n += eval(item);
					return 0;
				}
				return item;
			});
			
			if (n) r[mode].push(String(n));
//			console.log('mode', mode, 'w', r[mode]);
			r[mode] = r[mode].filter(item => {
				if (item !== 0) return true;
			});
		}
	}
	
	
	
	parseEq(str) {
		const operator = '+-*/';
		const splitChar = '*/=';
		const r = { left: [], right: [] };
		let cursor = 0;
		let mode = 'left'
		
		const eq = str.replace(/ /g, '') + '+0'; // '-3=2a+6*2';
		if (eq.match(/[\w\d]{2,}/g)) throw Error('Variable name should be one length.');
		
		var n = 0;
		while (cursor < eq.length) {
			const c = eq[cursor]; // Defined current char
			if (c === '=') {
				mode = 'right';  // Set direct
			} else {
				let lastPos = find(eq, /[^\w\d*/.]/g, cursor + 1);
			
				while (lastPos !== -1 && eq[lastPos-1].search(/[*/]/) !== -1) {
					lastPos = find(eq, /[^\w\d*/.]/g, lastPos + 1);
				}
				
				const v = eq.substring(cursor, lastPos === -1 ? undefined : lastPos);
				if (v.search(/[*/]/) === -1) r[mode].push(v);
				else r[mode].push(this.asterWrap(v));
				
				if (lastPos === -1) break;
				else cursor = lastPos - 1;

			}
			cursor++;
		}
		
		this.plusTainter(r);
		
		return r;
	}
	
	assignTainter(r, param) {
		
	}
	
	solve(param, target) {
		const multiResult = { left: [], right: [] };
		for (const currentEquation of this.equationsStructure) {
			for (const mode in currentEquation) {
				for (const item of currentEquation[mode]) {
					multiResult[mode].push(item);
				}
			}
		}
		this.plusTainter(multiResult);
		console.log(multiResult);
	}
}
const b = new Solve('5 + 4 -3 + 7/c = 2 *a / 5 + 6.4 * -2 / c - 4/3 + 9 + 6', 'c + 3 = a + 5');
//const b = new Solve('c = 1');
console.log(b.equationsStructure);