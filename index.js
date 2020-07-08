const fs = require("fs");
const { createCanvas, loadImage } = require('canvas');

const params = {
    input: './stickers',
    sticker: {
        size: 310,
        shadow: {
            color: '#bebebe',
            angle: 135,
            offset: 1,
            blur: 1,
        },
    },
    background: '#e4e4e4',
    output: {
        width: 500,
        height: 500,
        path: './previews',
    },
}

let canvas = createCanvas(params.output.width, params.output.height, params.output.extension);

scanStickers = (path ) => {
    return new Promise ((resolve, reject) => {
        resolve(fs.readdirSync(path));
    })
};

createPreview = (filePath, fileName) => {
    let ctx = canvas.getContext("2d");

    loadImage(filePath).then((image) => {

        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        addBackgroundToFile(params.background);

        // Move Pivot Point To Center
        ctx.translate((canvas.width / 2), (canvas.width / 2));

        // Create Shadow
        const cos = Math.cos((params.sticker.shadow.angle) * (Math.PI / 180));
        const sin = Math.sin((params.sticker.shadow.angle) * (Math.PI / 180));
        ctx.shadowOffsetX = params.sticker.shadow.offset * cos;
        ctx.shadowOffsetY = params.sticker.shadow.offset * sin;
        ctx.shadowColor = params.sticker.shadow.color;
        ctx.shadowBlur = params.sticker.shadow.blur;
        
        // Draw Image From Center
        ctx.drawImage(image,
            params.sticker.size / -2,
            params.sticker.size / -2,
            params.sticker.size,
            params.sticker.size,
        );
        ctx.restore();

        downloadFile(fileName);
    });
}

addBackgroundToFile = (background) => {
    let ctx = canvas.getContext("2d");

    // Draw Background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

downloadFile = (fileName) => {
    fs.writeFileSync(`${params.output.path}/${fileName}`, canvas.toBuffer());
}

scanStickers(params.input).then(stickers => {
    stickers.forEach(sticker => {
        createPreview(`${params.input}/${sticker}`, sticker);
    });
});
