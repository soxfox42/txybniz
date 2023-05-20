const svgNS = 'http://www.w3.org/2000/svg';
const welcomeText = '\\ Welcome to TXYBNIZ\n';
const descriptionText = '\\ A creative coding playground';
const positiveColor = 'rgb(255, 255, 255)';
const negativeColor = 'rgb(255, 35, 65)';

const circles = document.getElementById('circles') as HTMLCanvasElement;
const comments = document.getElementById('comments')!;
const code = document.getElementById('code')!;

const gap = 2;
const maxRadius = 10;
const size = 16;
const pixelSize = (size - 1) * gap + size * 2 * maxRadius;

let startTime = Date.now();

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
        newCirc.setAttribute('fill', positiveColor);
        circles.appendChild(newCirc);
    }
}

function evaluate(t: number, x: number, y: number): number {
    return Math.sin(t * 2 - x / 3 - y);
}

// Re-initialise to run a new program
function restart() {
    startTime = Date.now();
}

// Update the size and color of all circles according to the program
function update() {
    const t = (Date.now() - startTime) / 1000;
    for (let i = 0; i < size * size; i++) {
        const x = i % size;
        const y = Math.floor(i / size);

        let value = evaluate(t, x, y);
        let color = positiveColor;
        value = Math.max(-1, Math.min(1, value));
        if (value < 0) {
            value *= -1;
            color = negativeColor;
        }
        
        const circle = circles.children.item(i);
        circle?.setAttribute('r', `${value * maxRadius}`);
        circle?.setAttribute('fill', color);
    }
    requestAnimationFrame(update);
}

// Set up page
comments.textContent = welcomeText + descriptionText;
prepareSVG();

// Start rendering
requestAnimationFrame(update);

// Reset when code is updated
code.addEventListener('input', restart);

