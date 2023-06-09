type Colors = { [name: string]: string };
export const colors: Colors = {};
const defaults: Colors = {
    background: '#000000',
    positive: '#ffffff',
    negative: '#ff2341',
}

const rootStyle = document.documentElement.style;
function updateCSSVars() {
    for (const [key, color] of Object.entries(colors)) {
        rootStyle.setProperty(`--${key}`, color);
    }
}

for (const key in defaults) {
    colors[key] = localStorage.getItem(key) || defaults[key];

    const input = document.getElementById(key) as HTMLInputElement;
    input.value = colors[key];

    input.addEventListener('input', () => {
        colors[key] = input.value;
        localStorage.setItem(key, input.value);
        updateCSSVars();
    });
}
updateCSSVars();

const settingsMenu = document.getElementById('settings')!;
const settingsIcon = document.getElementById('settings-icon')!;
let settingsTimer: number | undefined;
settingsIcon.addEventListener('click', () => {
    if (settingsMenu.classList.contains('open')) {
        settingsMenu.classList.remove('open');
        clearTimeout(settingsTimer);
        settingsTimer = setTimeout(() => settingsMenu.classList.add('disabled'), 1000);
    } else {
        settingsMenu.classList.remove('disabled');
        clearTimeout(settingsTimer);
        settingsTimer = setTimeout(() => settingsMenu.classList.add('open'), 10);
    }
});
