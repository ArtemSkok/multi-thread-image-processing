const sharp = require('sharp');

const image = sharp('./public/src-images/distorted.png');

image.median(5).toFile('./public/processed-images/res.png', (err, info) => {
    if (err) {
        console.error(err);
    } else if (info) {
        console.info(info);
    }
});
