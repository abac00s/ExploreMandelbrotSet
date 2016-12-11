var xmin = -2.0, ymin = -2.0, xmax = 2.0, ymax = 2.0; 
var canvas;

function init() {
    canvas = document.getElementById("canvas");
    draw();
    
    canvas.addEventListener("mousedown", function (e) {
        var pos1 = getMousePos(e);
        var p1 = convertToComplex(pos1.x, pos1.y);
        
        var func = function (e) {
            var pos2 = getMousePos(e);
            var p2 = convertToComplex(pos2.x, pos2.y);
            var dx = p2.x - p1.x, dy = p2.y - p1.y;
            var screen_dx = pos2.x - pos1.x, screen_dy = pos2.y - pos1.y;
            if(screen_dx*screen_dx + screen_dy*screen_dy > 1000) {
                xmax -= dx;
                xmin -= dx;
                ymax -= dy;
                ymin -= dy;
                draw();
            }
        };
        
        canvas.addEventListener("mousemove", func, false);
        
        canvas.addEventListener("mouseup", function (e) {
            var pos2 = getMousePos(e);
            var p2 = convertToComplex(pos2.x, pos2.y);
            var dx = p2.x - p1.x, dy = p2.y - p1.y;
            xmax -= dx;
            xmin -= dx;
            ymax -= dy;
            ymin -= dy;
            draw();
            canvas.removeEventListener("mousemove", func);
        }, false);
    }, false);
    
    canvas.addEventListener("mousewheel", mouseWheelHandler, false);
    canvas.addEventListener("DOMMouseScroll", mouseWheelHandler, false);    //To make Firefox happy :)
}

function mouseWheelHandler(e) {
    var delta = e.wheelDelta || -e.detail;
    var pos = getMousePos(e);
    var p = convertToComplex(pos.x, pos.y);
    
    var newWidth, newHeight;
    
    if(delta > 0) { 
        newWidth = (xmax - xmin)/1.5;
        newHeight = (ymax - ymin)/1.5;
    }
    else {
        newWidth = (xmax - xmin)*1.5;
        newHeight = (ymax - ymin)*1.5;
    }
       
    xmax = p.x + newWidth/2;
    xmin = p.x - newWidth/2;
    ymax = p.y + newHeight/2;
    ymin = p.y - newHeight/2;
        
    draw();
    return false;
}

function draw() {
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
            /*img.data[i+2] = Math.floor(c/(256*256));
            img.data[i+1] = Math.floor((c/256)%256);
            img.data[i] = Math.floor(c%256);*/
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

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}