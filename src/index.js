const getPixels = require('get-pixels');
const savePixels = require('save-pixels');
const ndarray = require('ndarray');
const fs = require('fs');

function findMedian(pixels, y, x, z, n) {
    let array = [];
    for (let i = y - n; i <= y + n; i++) {
        for (let j = x - n; j <= x + n; j++) {
            array.push(pixels.get(i, j, z));
        }
    }
    return array.sort((a, b) => a - b)[n];
}

function createMedaianNdArrayOneThread(pixels, n = 4) {
    const processedPixelsArr = copyNdArray(pixels);
    const matrixY = processedPixelsArr.shape[0],
        matrixX = processedPixelsArr.shape[1],
        channels = processedPixelsArr.shape[2];
    for (let y = 0; y < matrixY; y++) {
        for (let x = 0; x < matrixX; x++) {
            if (y > n && y < matrixY - n && x > n && x < matrixX - n) {
                for (let z = 0; z < channels; z++) {
                    processedPixelsArr.set(y, x, z, findMedian(pixels, y, x, z, n));
                }
            }
        }
    }
    return processedPixelsArr;
}

function copyNdArray(pixels) {
    const processedPixelsArr = ndarray(
        new Uint8Array(pixels.size).fill(0),
        pixels.shape,
        pixels.stride,
        pixels.offset
    );
    return processedPixelsArr;
}

getPixels('./public/src-images/distorted.png', 'image/png', (err, pixels) => {
    if (err) {
        console.error(err);
    } else {
        // Time of the start
        let time;
        const startTime = new Date();

        // Create ndarray of pixels of image with applied median filter 
        const processedPixelsArr = createMedaianNdArrayOneThread(pixels, 3);

        // Save ndarray of pixels to the .png file in public/parsed-images/res.png
        const buffer = fs.createWriteStream('./public/processed-images/res.png');
        savePixels(processedPixelsArr, 'png').pipe(buffer);

        time = new Date() - startTime;
        console.log(`ms spend: ${time};`);
    }
});

/*
const { Worker, threadId, parentPort, isMainThread, workerData } = require('worker_threads');

const worker = new Worker(__dirname + '/index.js');

worker.on('online', () => {
    console.log('Worker ready');
});

worker.on('message', (msg) => {
    console.log('Worker message:', msg);
});

worker.on('error', (err) => {
    console.error('Worker error:', err);
});

worker.on('exit', (code) => {
    console.log('Worker exit code:', code);
});

*/