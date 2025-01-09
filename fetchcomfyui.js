import fs from 'fs';

export async function fetchComfy(promptId) {
    const response = await fetch(`http://127.0.0.1:8188/history/${promptId}`);
    const data = await response.json();
    // console.dir(data, {depth: 2});
    return data;
}

async function getComfyImage(filename, inputImgName) {
    const response = await fetch(`http://127.0.0.1:8188/view?filename=${filename}`)
    const blob = await response.blob()
    fs.writeFileSync(`image_output/${inputImgName}`, Buffer.from(await blob.arrayBuffer()));
    console.log('Image downloaded successfully.');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getComfyStatus(promptId, inputImgName) {
    let data = await fetchComfy(promptId);  
    let i = 0;
    while(data?.[promptId]?.status?.completed !== true) {
        await sleep(4 * 1000);
        data = await fetchComfy(promptId);
        i++;
        console.log(i);
    }
    console.log(data?.[promptId]?.status?.status_str);
    console.log(`prompt ${promptId} status is a ${data?.[promptId]?.status?.status_str}`);
    console.log(data?.[promptId]?.outputs);
    if(data?.[promptId]?.status?.status_str === "success") {
        console.log("your output image is named ", data?.[promptId]?.outputs?.['44']?.images?.[0]?.filename);
        await getComfyImage(data?.[promptId]?.outputs?.['44']?.images?.[0]?.filename, inputImgName);
    };
}

export async function uploadComfyImage(filename, newFilename) {
    const formData = new FormData();
    console.log(`Uploading image ${filename} as ${newFilename}`);
    let imageBuffer = fs.readFileSync(`image_input/${filename}`);
    let imageBlob = new Blob([imageBuffer]);
    formData.append('image', imageBlob, `${newFilename}`);
    const response = await fetch('http://127.0.0.1:8188/upload/image', {
        method: 'POST',
        body: formData
    });
    return await response.json();
}

