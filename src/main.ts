const svgNS = 'http://www.w3.org/2000/svg';
const welcomeText = '\\ Welcome to TXYBNIZ\n';
const descriptionText = '\\ A creative coding playground';

import { colors } from './settings';
import { VM } from './vm';

const circles = document.getElementById('circles') as HTMLCanvasElement;
const comments = document.getElementById('comments')!;
const code = document.getElementById('code') as HTMLInputElement;

const gap = 2;
const maxRadius = 10;
const size = 16;
const pixelSize = (size - 1) * gap + size * 2 * maxRadius;

let startTime: number, vm: VM;

// Create and position all the circle elements
function prepareSVG() {
    circles.setAttribute('viewBox', `0 0 ${pixelSize} ${pixelSize}`);
    const start = maxRadius;
    const step = 2 * maxRadius + gap;

    for (let i = 0; i < size * size; i++) {
        const x = i % size;
        const y = Math.floor(i / size);

        const newCirc = document.createElementNS(svgNS, 'circle');
        newCirc.setAttribute('cx', `${start + step * x}`);
        newCirc.setAttribute('cy', `${start + step * y}`);
        newCirc.setAttribute('r', `${maxRadius}`);
        newCirc.setAttribute('fill', colors.positive);
        circles.appendChild(newCirc);
    }
}

function evaluate(t: number, x: number, y: number): number {
    vm.stack = [t * 65536 | 0, y * 65536 | 0, x * 65536 | 0];
    try {
        vm.run();
    } catch {
        return 0;
    }
    return vm.stack[vm.stack.length - 1] / 65536;
}

// Re-initialise to run a new program
function restart() {
    vm = new VM(code.value);
    startTime = Date.now();
}

// Update the size and color of all circles according to the program
function update() {
    const t = (Date.now() - startTime) / 1000;
    for (let i = 0; i < size * size; i++) {
        let x = i % size;
        let y = Math.floor(i / size);

        x = x / (size - 1) * 2 - 1;
        y = y / (size - 1) * 2 - 1;

        let value = evaluate(t, x, y);
        let color = colors.positive;
        value = Math.max(-1, Math.min(1, value));
        if (value < 0) {
            value *= -1;
            color = colors.negative;
        }
        
        const circle = circles.children.item(i);
        circle?.setAttribute('r', `${value * maxRadius}`);
        circle?.setAttribute('fill', color);
    }
    requestAnimationFrame(update);
}

function saveCode(code: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('code', code);
    window.history.replaceState(null, '', url);
}

// Set up page
comments.textContent = welcomeText + descriptionText;
prepareSVG();

// Load code from URL if given
const url = new URL(window.location.href);
const newCode = url.searchParams.get('code');
if (newCode) {
    code.value = newCode;
}

// Start rendering
restart();
requestAnimationFrame(update);

// Reset when code is updated
code.addEventListener('input', restart);
code.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        saveCode((e.target as HTMLInputElement).value);
    }
});

