
var DERPAArtTools = {
    getColorIndicesForCoord: function (x, y, width) {

        var red = y * (width * 4) + x * 4;

        return {
            r: red,
            g: red + 1,
            b: red + 2,
            a: red + 3
        }
    },
    getPixelColors: function (imageData) {
        var columns = [];

        for (var x = 0; x < imageData.width; x++) {
            var rows = [];

            columns.push(rows);

            for (var y = 0; y < imageData.height; y++) {
                rows.push(DERPAArtTools.getPixelColor(x, y, imageData));
            }
        }

        return columns;
    },
    setPixelColors: function (imageData, colors, offsetX, offsetY) {

        offsetX = offsetX || 0;
        offsetY = offsetY || 0;

        for (var x = 0; x < colors.length; x++) {
            for (var y = 0; y < colors[x].length; y++) {
                var rgba = DERPAArtTools.getColorIndicesForCoord(x + offsetX, y + offsetY, imageData.width);

                imageData.data[rgba.r] = colors[x][y].r;
                imageData.data[rgba.g] = colors[x][y].g;
                imageData.data[rgba.b] = colors[x][y].b;
                imageData.data[rgba.a] = colors[x][y].a;
            }
        }
    },
    getPixelColor: function (x, y, imageData) {
        var rgba = DERPAArtTools.getColorIndicesForCoord(x, y, imageData.width);

        return {
            r: imageData.data[rgba.r],
            g: imageData.data[rgba.g],
            b: imageData.data[rgba.b],
            a: imageData.data[rgba.a]
        };
    },
    setPixelColor: function (x, y, imageData, rgba) {

        var loc = DERPAArtTools.getColorIndicesForCoord(x, y, imageData.width);

        imageData.data[loc.r] = rgba.r;
        imageData.data[loc.g] = rgba.g;
        imageData.data[loc.b] = rgba.b;
        imageData.data[loc.a] = rgba.a;
    },
    getPixelsManager: function (imageData) {
        var manager = {
            imageData: imageData,
            width: imageData.width,
            height: imageData.height,
            pixels: DERPAArtTools.getPixelColors(imageData),
            update: function () {
                DERPAArtTools.setPixelColors(imageData, manager.pixels);
            },
            reset: function () {
                manager.pixels = DERPAArtTools.getPixelColors(imageData);
            },
            brighten: function (percentage) {
                for (var x = 0; x < manager.width; x++) {
                    for (var y = 0; y < manager.height; y++) {
                        manager.pixels[x][y] = DERPAArtTools.brighten(manager.pixels[x][y], percentage);
                    }
                }
            },
            darken: function (percentage) {
                for (var x = 0; x < manager.width; x++) {
                    for (var y = 0; y < manager.height; y++) {
                        manager.pixels[x][y] = DERPAArtTools.brighten(manager.pixels[x][y], darken);
                    }
                }
            },
            fade: function (percentage) {
                for (var x = 0; x < manager.width; x++) {
                    for (var y = 0; y < manager.height; y++) {
                        manager.pixels[x][y].a = manager.pixels[x][y].a * (1 - percentage);
                    }
                }
            },
            blur: function (radius, percentage) {

                percentage = percentage || 1;

                var columns = [];

                for (var x = 0; x < manager.width; x++) {

                    var rows = [];

                    columns.push(rows);

                    for (var y = 0; y < manager.height; y++) {

                        var pixel = manager.pixels[x][y];

                        pixel.weight = radius;

                        var colors = [pixel];

                        for (var x1 = 0; x1 < radius * 2; x1++) {
                            for (var y1 = 0; y1 < radius * 2; y1++) {

                                var xv = x + (x1 - radius);
                                var yv = y + (y1 - radius);

                                var dist = getDistanceFromTo(x, y, xv, yv);

                                var mult = Math.max(0, 1 - dist / radius) * percentage;

                                if (xv > 0 && yv > 0 && xv < manager.width && yv < manager.height) {
                                    var px = manager.pixels[xv][yv];

                                    px.weight = mult;

                                    colors.push(px);
                                }
                            }
                        }

                        pixel = weightMergeColors(colors);

                        rows.push(pixel);
                    }
                }

                manager.pixels = columns;
            }
        };

        return manager;
    },
    getPixelManager: function (x, y, imageData) {

        var rgba = DERPAArtTools.getColorIndicesForCoord(x, y, imageData.width);

        var manager = {
            rgba: {
                r: imageData.data[rgba.r],
                g: imageData.data[rgba.g],
                b: imageData.data[rgba.b],
                a: imageData.data[rgba.a]
            },
            update: function () {
                imageData.data[rgba.r] = manager.rgba.r;
                imageData.data[rgba.g] = manager.rgba.g;
                imageData.data[rgba.b] = manager.rgba.b;
                imageData.data[rgba.a] = manager.rgba.a;
            },
            reset: function () {
                manager.rgba = {
                    r: imageData.data[rgba.r],
                    g: imageData.data[rgba.g],
                    b: imageData.data[rgba.b],
                    a: imageData.data[rgba.a]
                };
            }
        };

        return manager;
    },
    getRGBAString: function (rgba, noModAlpha) {
        return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + (noModAlpha == true ? rgba.a : rgba.a / 255.0) + ")";
    },
    getRGBString: function (rgb) {
        return "rgb(" + rgba.r + "," + rgba.g + "," + rgba.b + ")";
    },
    brighten: function (rgb, percentage) {
        var trgb = { r: 0, g: 0, b: 0, a: rgb.a };

        trgb.r = rgb.r + (255 - rgb.r) * percentage;
        trgb.g = rgb.g + (255 - rgb.g) * percentage;
        trgb.b = rgb.b + (255 - rgb.b) * percentage;

        return trgb;
    },
    darken: function (rgb, percentage) {
        var trgb = { r: 0, g: 0, b: 0, a: rgb.a };

        trgb.r = rgb.r * (1 - percentage);
        trgb.g = rgb.g * (1 - percentage);
        trgb.b = rgb.b * (1 - percentage);

        return trgb;
    }
};


function DERPAVector(angle, magnitude, calc) {

    this.ang = angle;
    this.mag = magnitude;

    this.x = 0;
    this.y = 0;

    if (calc || calc == null) {
        this.x = getXOfVector(this.ang, this.mag);
        this.y = getYOfVector(this.ang, this.mag);
    }
}

DERPAVector.prototype.copy = function () {
    return new DERPAVector(this.ang, this.mag);
}

DERPAVector.prototype.setXY = function (x, y, calc) {
    this.x = x;
    this.y = y;

    if (calc || calc == null) {
        this.ang = getAngleFromTo(0, 0, x, y);
        this.mag = getDistanceFromTo(0, 0, x, y);
    }
}

DERPAVector.prototype.setAngMag = function (ang, mag, calc) {
    this.ang = ang;
    this.mag = mag;
    if (calc || calc == null) {
        this.x = getXOfVector(ang, mag);
        this.y = getYOfVector(ang, mag);
    }
}

DERPAVector.prototype.setMag = function (mag, calc) {
    this.mag = mag;
    if (calc || calc == null) {
        this.x = getXOfVector(this.ang, mag);
        this.y = getYOfVector(this.ang, mag);
    }
}

DERPAVector.prototype.setAng = function (ang, calc) {
    this.ang = ang;
    if (calc || calc == null) {
        this.x = getXOfVector(ang, this.mag);
        this.y = getYOfVector(ang, this.mag);
    }
}

DERPAVector.prototype.addVector = function (vector) {
    var tmp = new DERPAVector(0, 0, false);
    tmp.setXY(this.x + vector.x, this.y + vector.y);
    return tmp;
}

function pointInTriangle(point, triangle) {
    //compute vectors & dot products
    var cx = point[0], cy = point[1],
        t0 = triangle[0], t1 = triangle[1], t2 = triangle[2],
        v0x = t2[0] - t0[0], v0y = t2[1] - t0[1],
        v1x = t1[0] - t0[0], v1y = t1[1] - t0[1],
        v2x = cx - t0[0], v2y = cy - t0[1],
        dot00 = v0x * v0x + v0y * v0y,
        dot01 = v0x * v1x + v0y * v1y,
        dot02 = v0x * v2x + v0y * v2y,
        dot11 = v1x * v1x + v1y * v1y,
        dot12 = v1x * v2x + v1y * v2y

    // Compute barycentric coordinates
    var b = (dot00 * dot11 - dot01 * dot01),
        inv = b === 0 ? 0 : (1 / b),
        u = (dot11 * dot02 - dot01 * dot12) * inv,
        v = (dot00 * dot12 - dot01 * dot02) * inv
    return u >= 0 && v >= 0 && (u + v < 1)
}


function getXOfVector(angle, distance) {
    return (Math.cos(angle * (Math.PI / 180)) * distance);
}

function to360(ang) {
    if (ang < 0) {
        return 360 + (ang % 360);
    }
    else {
        return ang % 360;
    }
}

function avg(values) {
    var v = 0;
    var cnt = 0;

    for (var g = 0; g < arguments.length; g++) {
        if (Array.isArray(arguments[g])) {
            for (var h = 0; h < arguments[g].length; h++) {
                cnt++;
                v += arguments[g][h];
            }
        }
        else {
            cnt++;
            v += arguments[g];
        }
    }

    return v / cnt;
}

function weightMergeColors(colors) {
    var rgba = {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
        weight: 0.0
    };

    for (var g = 0; g < colors.length; g++) {
        rgba.r += colors[g].r * colors[g].weight;
        rgba.g += colors[g].g * colors[g].weight;
        rgba.b += colors[g].b * colors[g].weight;
        rgba.a += colors[g].a * colors[g].weight;
        rgba.weight += colors[g].weight;
    }

    rgba.r = rgba.r / rgba.weight;
    rgba.g = rgba.g / rgba.weight;
    rgba.b = rgba.b / rgba.weight;
    rgba.a = rgba.a / rgba.weight;

    return rgba;
}

function transitionToColor(fromRGBA, toRGBA, percentage) {
    return {
        r: fromRGBA.r + (toRGBA.r - fromRGBA.r) * percentage,
        g: fromRGBA.g + (toRGBA.g - fromRGBA.g) * percentage,
        b: fromRGBA.b + (toRGBA.b - fromRGBA.b) * percentage,
        a: fromRGBA.a + (toRGBA.a - fromRGBA.a) * percentage
    };
}

function rotatePointAroundPoint(center, point, rot) {
    var v = new DERPAVector(getAngleFromTo(center.x, center.y, point.x, point.y), getDistanceFromTo(center.x, center.y, point.x, point.y));
    v.setAng(v.ang + rot);
    return { x: center.x + v.x, y: center.y + v.y };
}

function getDistanceFromLine(point, line) {
    var ang = getAngleFromTo(line.p1.x, line.p1.y, line.p2.x, line.p2.y);
    var diff = getAngleDiff(ang, 0);
    var dir = getTurnDir(ang, 0);
    var lp2 = rotatePointAroundPoint(line.p1, line.p2, diff * dir);
    var p = rotatePointAroundPoint(line.p1, point, diff * dir);

    if (p.x < line.p1.x) {
        return getDistanceFromTo(line.p1.x, line.p1.y, point.x, point.y);
    }

    if (p.x > lp2.x) {
        return getDistanceFromTo(line.p2.x, line.p2.y, point.x, point.y);
    }

    return Math.abs(p.y - lp2.y);
}

function getLinePushDir(point, line) {
    var ang = getAngleFromTo(line.p1.x, line.p1.y, line.p2.x, line.p2.y);
    var diff = getAngleDiff(ang, 0);
    var dir = getTurnDir(ang, 0);
    var lp2 = rotatePointAroundPoint(line.p1, line.p2, diff * dir);
    var p = rotatePointAroundPoint(line.p1, point, diff * dir);

    /*if (point.x < line.p1.x) {
        return getAngleFromTo(line.p1.x, line.p1.y, point.x, point.y);
    }

    if (point.x > lp2.x) {
        return getAngleFromTo(line.p2.x, line.p2.y, point.x, point.y);
    }*/

    dir = getTurnDir(0, getAngleFromTo(line.p1.x, line.p1.y, p.x, p.y));
    return getAngleFromTo(line.p1.x, line.p1.y, line.p2.x, line.p2.y) + (90 * dir);
}

function randomizeList(list) {
    var list2 = [];
    var list3 = [];

    for (var g = 0; g < list.length; g++) {
        list3.push(list[g]);
    }

    while (list3.length > 0) {
        var ind = Math.floor(Math.random() * list3.length);

        list2.push(list3[ind]);
        list3.splice(ind, 1);
    }


    return list2
}

function drawPercentHexagon(ctx, sideLength, cX, cY, perc) {
    var len = sideLength * 6;
    var tD = len * perc;

    var v = new DERPAVector(-90, sideLength);

    var l = { x: cX + v.x, y: cY + v.y };

    ctx.moveTo(l.x, l.y);

    for (var g = 0; g < 6; g++) {
        v.setAng(30 + (g * 60));
        v.setMag(Math.min(tD, sideLength));

        l.x += v.x;
        l.y += v.y;

        ctx.lineTo(l.x, l.y);

        tD -= v.mag;

        if (tD == 0) {
            return;
        }
    }
}

function getYOfVector(angle, distance) {
    return (Math.sin(angle * (Math.PI / 180)) * distance);
}

function getDistanceFromTo(fromX, fromY, toX, toY) {
    return Math.sqrt(((fromX - toX) * (fromX - toX)) + ((fromY - toY) * (fromY - toY)));
}

function getAngleFromTo(fromX, fromY, toX, toY) {
    radians = Math.atan2(toY - fromY, toX - fromX);
    return (radians / Math.PI * 180);
}

function getTurnDir(fromAngle, toAngle) {
    fromAngle = to360(fromAngle);
    toAngle = to360(toAngle);

    if (fromAngle > toAngle) {
        if (fromAngle - toAngle <= 180) {
            return -1;
        }
        else {
            return 1;
        }
    }
    else {
        if (toAngle - fromAngle <= 180) {
            return 1;
        }
        else {
            return -1;
        }
    }
}

function getAngleDiff(angle1, angle2) {
    angle1 = to360(angle1);
    angle2 = to360(angle2);

    if (angle1 > angle2) {
        var tmp = angle1;
        angle1 = angle2;
        angle2 = tmp;
    }

    return (angle2 - angle1 <= 180 ? angle2 - angle1 : angle1 + (360 - angle2));
}

function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
    /*
            // it is worth noting that this should be the same as:
            x = line2StartX + (b * (line2EndX - line2StartX));
            y = line2StartX + (b * (line2EndY - line2StartY));
            */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a >= 0 && a <= 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b >= 0 && b <= 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

function drawLineDERPA(ctx, p1, p2, width) {
    ctx.beginPath();

    var ang = getAngleFromTo(p1.x, p1.y, p2.x, p2.y);
    var dist = getDistanceFromTo(p1.x, p1.y, p2.x, p2.y);
    var v = new DERPAVector(ang + 90, width * .5);
    var p = { x: p1.x + v.x, y: p1.y + v.y };
    ctx.moveTo(p.x, p.y);
    v.setAngMag(ang - 90, width);
    p.x += v.x;
    p.y += v.y;
    ctx.lineTo(p.x, p.y);
    v.setAngMag(ang, dist);
    p.x += v.x;
    p.y += v.y;
    ctx.lineTo(p.x, p.y);
    v.setAngMag(ang + 90, width);
    p.x += v.x;
    p.y += v.y;
    ctx.lineTo(p.x, p.y);
    v.setAngMag(ang - 180, dist);
    p.x += v.x;
    p.y += v.y;
    ctx.lineTo(p.x, p.y);
}