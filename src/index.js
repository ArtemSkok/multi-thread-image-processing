const getPixels = require('get-pixels');
const savePixels = require('save-pixels');
const ndarray = require('ndarray');
const fs = require('fs');

let time;
const startTime = new Date();

getPixels('./public/src-images/distorted.png', 'image/png', (err, pixels) => {
    if (err) {
        console.error(err);
    } else {
        const processedPixelsArr = ndarray(
            new Uint8Array(pixels.size).fill(0),
            pixels.shape,
            pixels.stride,
            pixels.offset
        );

        const matrixY = pixels.shape[0],
            matrixX = pixels.shape[1],
            channels = pixels.shape[2];

        const n = 5;

        for (let y = 0; y < matrixY; y++) {
            for (let x = 0; x < matrixX; x++) {
                if (y > n && y < matrixY - n && x > n && x < matrixX - n) {
                    for (let z = 0; z < channels; z++) {
                        debugger;
                        var valueSum = 0;
                        for (let i = y - n; i <= y + n; i++) {
                            for (let j = x - n; j <= x + n; j++) {
                                valueSum += pixels.get(i, j, z);
                            }
                        }
                        processedPixelsArr.set(y, x, z, valueSum / ((2 * n + 1) * (2 * n + 1)));
                      
                    }
                }
            }
        }

        const buffer = fs.createWriteStream(
            './public/processed-images/res.png'
        );
        savePixels(processedPixelsArr, 'png').pipe(buffer);

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
