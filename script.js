function generarImagen() {
    const NombreProducto = document.getElementById('NombreProducto').value;
    const PrecioProducto = document.getElementById('PrecioProducto').value;
    const CodigoBarras = document.getElementById('CodigoBarras').value;

    const canvas = document.getElementById('EtiquetaResultado');
    const ctx = canvas.getContext('2d');

    // Código para generar la imagen (tal como se proporcionó en tu código original) ...
    canvas.width = 296;
    canvas.height = 152;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 296, 110);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 110, 296, 42);

    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "white";

    const x = 2;
    const y = 18;
    const maxWidth = canvas.width - x;
    const text = NombreProducto.toUpperCase();

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const testWidth = context.measureText(testLine).width;

            if (testWidth > maxWidth) {
                context.fillText(line, x, y);
                line = words[i] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        context.fillText(line, x, y);
    }

    wrapText(ctx, text, x, y, maxWidth, 18);

    const x1 = 70;
    const y1 = 96;
    const maxWidth1 = canvas.width - x1;
    const text1 = "$" + PrecioProducto;

    ctx.font = "bold 70px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text1, x1, y1, maxWidth1);

    const barcodeImg = new Image();
    JsBarcode(barcodeImg, CodigoBarras, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: true,
        fontSize: 12,
        margin: 4,
        textMargin: 0
    });

    barcodeImg.onload = () => {
        ctx.drawImage(barcodeImg, 155, 112, 140, 40);
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("$2.975 x KG", 4, 124);
    };
}

function enviarImagenAlServidor() {
    const TagId = document.getElementById('TagId').value;
    const canvas = document.getElementById('EtiquetaResultado');
    const image = canvas.toDataURL("image/png");

    const base64Content = image.replace(/^data:image\/(png|jpg);base64,/, '');

    const jsonObject = {
        "StoreCode": '9856',
        "TagID": TagId,
        "ImageBase64": base64Content
    };

    fetch('http://135.148.211.48:5000/pushImage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonObject)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La respuesta de la solicitud no es válida.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
        console.error('Error en la petición:', error);
    });
}
