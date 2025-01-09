// const fetch = require("node-fetch");
import { getComfyStatus, uploadComfyImage } from './fetchcomfyui.js';
import workflow from './workflow_api(2).json' with { type: "json" };

function genId() {
  return Math.floor(Math.random() * 1000000000000000);
}

async function sendPrompt(inputImgName, positive) {
  const image = JSON.parse(JSON.stringify(workflow["11"]));

  const ks = JSON.parse(JSON.stringify(workflow["3"]));

  const positivePrompt = JSON.parse(JSON.stringify(workflow["6"]));

  Object.assign(image.inputs, {image: inputImgName})

  Object.assign(ks.inputs, {
    seed: Math.floor(Math.random() * 956342728827370)
  })

  Object.assign(positivePrompt.inputs, {
    text: positivePrompt.inputs.text + positive
  }) 
  
  const wf = Object.assign({}, workflow, {
    "11": image,
    "3": ks,
    "6": positivePrompt
  })
  try {
    const response = await fetch('http://127.0.0.1:8188/prompt', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',  
      },
      body: JSON.stringify({prompt: wf})
    })  

    const prompt = await response.json()
    console.log(prompt);
    await getComfyStatus(prompt.prompt_id, inputImgName);

  } catch (error) {
    console.log(error);
  }
} 

export async function vegetateImage(imgFilename, positive = "") {
  const inputImgName = `img${genId()}.png`;
  console.log('Uploading', imgFilename);
  await uploadComfyImage(imgFilename, inputImgName);
  await sendPrompt(inputImgName, positive);
  return inputImgName;
}

