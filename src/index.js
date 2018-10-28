const getPixels = require('get-pixels');
const ndarray = require('ndarray');

let time;
const startTime = new Date();

getPixels('./public/src-images/distorted.png', 'image/png', (err, pixels) => {
    if (err) {
        console.error(err);
    } else {
        const processedPixelsArr = ndarray(new Uint8Array(pixels.size).fill(0));

        const matrixY = pixels.shape[0],
            matrixX = pixels.shape[1],
            matrixZ = pixels.shape[2];

        for (let y = 0; y < matrixY; y++) {
            for (let x = 0; x < matrixX; x++) {
                for (let z = 0; z < matrixZ; z++) {
                    processedPixelsArr.set(y, x, z, pixels.get(y, x, z));
                }
            }
        }

        time = new Date() - startTime;
        console.log(`ms spend: ${time};`);
    }
});

/*const sharp = require('sharp');
const fs = require('fs');

const image = sharp('./public/src-images/distorted.png');

image.median(5).toFile('./public/processed-images/res.png', (err, info) => {
    if (err) {
        console.error(err);
    } else if (info) {
        console.info(info);
    }
});
*/
