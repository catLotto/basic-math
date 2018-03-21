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
	
	plusTainter(zero) {
		let n = 0;
		zero = zero.map(item => {
			if (!item.match(/[a-zA-Z]/g)) {
				n += eval(item);
				return 0;
			}
			return item;
		});

		if (n) zero.push(String(n));
//		console.log('mode', zero);
		return zero.filter(item => {
			if (item !== 0) return true;
		});
	}
	
	invertValue(v) {
		v = v.replace(/\+/g, '');
		if (v === '0') {
			return '';
		}
		else if (v.toString()[0] === '-')
			return v.slice(1);
		else
			return '-' + v;
	}
	
	parseEq(str) {
		const operator = '+-*/';
		const splitChar = '*/=';
		let zero = [];
		let cursor = 0;
		let dir = ''; // Direct is '' or '-'
		
		const eq = str.replace(/ /g, '') + '+0'; // '-3=2a+6*2';
		if (eq.match(/[\w\d]{2,}/g)) throw Error('Variable name should be one length.');
		
		var n = 0;
		while (cursor < eq.length) {
			const c = eq[cursor]; // Defined current char
			if (c === '=') {
				dir = '-'
			} else {
				let lastPos = find(eq, /[^\w\d*/.]/g, cursor + 1);
			
				while (lastPos !== -1 && eq[lastPos-1].search(/[*/]/) !== -1) {
					lastPos = find(eq, /[^\w\d*/.]/g, lastPos + 1);
				}
				
				let v;
				v = eq.substring(cursor, lastPos === -1 ? undefined : lastPos);
				if (dir === '-') {
					v = this.invertValue(v);
				}
				
				if (v !== '') {
					if (v.search(/[*/]/) === -1) zero.push(v.replace(/\+/g, ''));
					else zero.push(this.asterWrap(v.replace(/\+/g, '')));

				}
				if (lastPos === -1) break;
				else cursor = lastPos - 1;
			}
			cursor++;
		}
		
		zero = this.plusTainter(zero);
		
		return zero;
	}
	
	assignTainter(r, param) {
		return r.map(item => {
			let resultItem = item;
			for (const key in param) {
				resultItem = resultItem.replace(key, param[key]);
			}
			return resultItem;
		});
	}
	
	moveTainter(r) {
			
	}
	
	toStr(r) {
		return r.reduce((accumulator, value, index) => {
			let op = '';
			if (index && !value.match(/[+-]/g)) op = '+';
			else value = value.replace('+', '');
			return accumulator + op + value;
		}, '');
	}
	
	solve(param, target) {
		let multiResult = [];
		for (const currentEquation of this.equationsStructure) {
			for (const item of currentEquation) {
				multiResult.push(item);
			}
		}
		if (param) multiResult = this.assignTainter(multiResult, param);
//		this.moveTainter(multiResult);
		
		multiResult = this.plusTainter(multiResult);
		console.log('multiResult', multiResult);
		
		return;
		let r;
		try {
			r = eval(this.toStr(multiResult.right));
		} catch (e) {
			r = this.toStr(multiResult.right);
		}
		
		const result = {
			[this.toStr(multiResult.left)]: r
		};
		return { multiResult, result };
	}
}
//const b = new Solve('5 + 4 -3 + 7/c = 2 *a / 5 + 6.4 * -2 / c - 4/3 + 9 + 6', 'c + 3 = a + 5');
const b = new Solve('b + 3/2 =1 - 5 * a - c + 1');
console.log(b.equationsStructure);