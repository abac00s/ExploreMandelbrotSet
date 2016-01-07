var xmin = -2.0, ymin = -2.0, xmax = 2.0, ymax = 2.0; 
var canvas;

function draw() {
    canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        var img = ctx.createImageData(canvas.width, canvas.height);
        
        var x, y, p, c;
        for(var i = 0; i < img.data.length; i+=4) {
            img.data[i+3] = 255;
            x = (i/4) % canvas.width;
            y = ((i/4) - x)/canvas.width;
            p = convertToComplex(x, y);
            
            c = compColor(p.x, p.y);
            img.data[i] = c;
        }
        
        ctx.putImageData(img, 0, 0);
    }
}

function compColor(x, y) {
    var i;
    var x0 = x, y0 = y, temp;
    for(i = 0; i < 256 && (x*x + y*y) < 4; i++) {
        temp = x*x - y*y + x0;
        y = 2*x*y + y0;
        x = temp
    }
    return i;
}

function convertToComplex(x, y) {
    var px = x*(xmax - xmin)/canvas.width + xmin;
    var py = ymax - y*(ymax - ymin)/canvas.height;
    return {x: px, y: py};
}
