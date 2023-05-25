// JS bitwise ops use 32-bit integers, which makes implementing 16.16 fixed-point easier.

const FIX = 1 << 16;

function isImmediateChar(char: string): boolean {
    return /^[0-9A-F.]$/.test(char);
}

function parseLiteral(literal: string): number {
    let whole = literal, fract = '';
    if (literal.includes('.')) {
        whole = literal.substring(0, literal.indexOf('.'));
        fract = literal.substring(literal.indexOf('.') + 1);
    }
    fract = fract.substring(0, 4).padEnd(4, '0');
    return parseInt(whole, 16) * 65536 | parseInt(fract, 16);
}

function parse(code: string): (number | string)[] {
    const parsed = [];
    let pos = 0;
    while (pos < code.length) {
        if (isImmediateChar(code[pos])) {
            let temp = '';
            while(isImmediateChar(code[pos])) {
                temp += code[pos++];
            }
            parsed.push(parseLiteral(temp));
        } else {
            parsed.push(code[pos++]);
        }
    }
    return parsed;
}

export class VM {
    code: (number | string)[];
    ip: number;
    stack: number[];
    // rstack: number[];

    constructor(code: string) {
        this.code = parse(code);
        this.ip = 0;
        this.stack = [];
    }

    ensureStack(count: number) {
        if (this.stack.length < count) {
            throw new Error('Not enough items on stack');
        }
    }

    push(value: number) {
        this.stack.push(Math.round(value));
    }

    pop(count: number): number[] {
        this.ensureStack(count);
        return this.stack.splice(-count);
    }

    step() {
        const inst = this.code[this.ip++];
        if (typeof inst === 'number') {
            this.push(inst);
            return;
        }

        //console.log(`Executing '${inst}'`);
        let a: number, b: number, c: number;
        switch (inst) {
            case '+':
                [a, b] = this.pop(2);
                this.push(a + b);
                break;
            case '-':
                [a, b] = this.pop(2);
                this.push(a - b);
                break;
            case '*':
                [a, b] = this.pop(2);
                this.push(a / FIX * b);
                break;
            case '/':
                [a, b] = this.pop(2);
                this.push(b === 0 ? 0 : a * FIX / b);
                break;
            case '%':
                [a, b] = this.pop(2);
                this.push(b === 0 ? 0 : a % b);
                break;
            case 'q':
                [a] = this.pop(1);
                this.push(a < 0 ? 0 : Math.sqrt(a / FIX) * FIX);
                break;
            case '&':
                [a, b] = this.pop(2);
                this.push(a & b);
                break;
            case '|':
                [a, b] = this.pop(2);
                this.push(a | b);
                break;
            case '^':
                [a, b] = this.pop(2);
                this.push(a ^ b);
                break;
            case 'r':
                [a, b] = this.pop(2);
                this.push(a >> (b / FIX) | a << (32 - b / FIX));
                break;
            case 'l':
                [a, b] = this.pop(2);
                this.push(a << (b / FIX));
                break;
            case 'l':
                [a] = this.pop(1);
                this.push(~a);
                break;
            case 's':
                [a] = this.pop(1);
                this.push(Math.sin(a / FIX * 2 * Math.PI) * FIX);
                break;
            case 'a':
                [a, b] = this.pop(2);
                this.push(Math.atan2(a / FIX, b / FIX) / 2 / Math.PI * FIX);
                break;
            case '<':
                [a] = this.pop(1);
                this.push(a < 0 ? a : 0);
                break;
            case '>':
                [a] = this.pop(1);
                this.push(a > 0 ? a : 0);
                break;
            case '=':
                [a] = this.pop(1);
                this.push(a === 0 ? 1 : 0);
                break;
            case 'd':
                [a] = this.pop(1);
                this.push(a);
                this.push(a);
                break;
            case 'p':
                this.pop(1);
                break;
            case 'x':
                [a, b] = this.pop(2);
                this.push(b);
                this.push(a);
                break;
            case 'v':
                [a, b, c] = this.pop(3);
                this.push(b);
                this.push(c);
                this.push(a);
                break;
            case ')':
                [a] = this.pop(1);
                this.push(this.stack[this.stack.length - 1 - (a / FIX)]);
                break;
            case '(':
                [a, b] = this.pop(2);
                this.stack[this.stack.length - 2 - (b / FIX)] = a;
                break;
            case ' ':
            case ',':
                break;
            default:
                throw new Error(`Unknown instruction '${inst}'`);
        }
    }

    run() {
        this.ip = 0;
        while (this.ip < this.code.length) {
            this.step();
        }
    }
}
