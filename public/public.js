//change img input and output to src to take from url

const img_input = document.getElementById('input');
const img_output = document.getElementById('output');

urlinput = new URLSearchParams(window.location.search);
inputImgName = urlinput.get('inputImgName');
outputImgName = urlinput.get('outputImgName');

console.log('inputImgName', inputImgName);
console.log('outputImgName', outputImgName);

img_input.src = `./image_input/${inputImgName}`;

img_output.src = `./image_output/${outputImgName}`;