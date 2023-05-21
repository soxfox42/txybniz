import { VM } from '../src/vm';

const start = Date.now();
const code = '^x7r+';
const size = 128; // IBNIZ uses 256

const vm = new VM(code);
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = canvas.height = size;
const ctx = canvas.getContext('2d')!;
const im = ctx.createImageData(size, size);

function render() {
    const t = Math.floor((Date.now() - start) / 1000 * 60);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const xv = x / size * 2 - 1;
            const yv = y / size * 2 - 1;
            vm.stack = [t * 65536 | 0, yv * 65536 | 0, xv * 65536 | 0];
            vm.run();
            const value = vm.stack[0];

            // Just show the luminance channel
            im.data[idx] = value >> 8 & 255;
            im.data[idx + 1] = value >> 8 & 255;
            im.data[idx + 2] = value >> 8 & 255;
            im.data[idx + 3] = 255;
        }
    }
    ctx.putImageData(im, 0, 0);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
