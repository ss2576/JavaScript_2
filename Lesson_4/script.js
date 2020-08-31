function replaceFunc() {
    if (document.querySelector('#part2').checked) {
        document.querySelector('#output').value = document.querySelector('#input').value.replace(/((?<!\b)')|('(?!\b))/gm, '"');
    } else {
        document.querySelector('#output').value = document.querySelector('#input').value.replace(/'/gm, '"');
    }
}

window.addEventListener('load', () => {
    document.querySelector('#input').addEventListener('input', replaceFunc);
    document.querySelector('#part2').addEventListener('change', replaceFunc);
    replaceFunc();
});