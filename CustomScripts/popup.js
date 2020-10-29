
/*
 FUCK OFF DEEP STATE CUNTS. 
 WE ARE THE NEWS.
 AND FUCK JANNIES.
 */


angular.module("master-app", ["slider-directive"]).controller("popup-controller", ["$scope", "$timeout", function ($scope, $timeout) {
    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.randBetween = function (min, max) {
        return (Math.random() * (max - min) + min);
    };

    $scope.roundTo = function (value, decimals) {
        var mult = Math.pow(10, decimals);

        return Math.round(value * mult) / mult;
    };

    $scope.clickCopyWallet = function (wallet) {
        var inp = $("#wallet" + wallet.id)[0];

        inp.select();
        inp.setSelectionRange(0, 99999);

        document.execCommand("copy");

        $timeout(function () {
            alert("Address Copied");
        }, 5);
        
    }

    $scope.closePopup = function () {
        $scope.showingDonate = false;
    }

    $scope.cryptoWallets = [
        {
            id: 1,
            name: "Bitcoin (BTC)",
            address: "382MrNkzJCyRPiTQ3fjeS88kUbCnUZA5H1"
        },
        {
            id: 2,
            name: "Ripple (XRP)",
            address: "rE2SwpwMU4SjkJXoDqrdj4rVsnBK2BDkD5"
        },
        {
            id: 3,
            name: "Ethereum (ETH)",
            address: "0x0e73a3c3e6a0ce01956e04730f8ad13654f975f6"
        },
        {
            id: 4,
            name: "Litecoin (LTC)",
            address: "MW7TM2ZaX1tzrqU3YNwDqUenVd1f9Jp6nr"
        },
        {
            id: 5,
            name: "Dash (DASH)",
            address: "XiKkdHWM5cXpxxLGagfkCKataDSPtJ7ucY"
        }
    ];

    $scope.mod_crop = {
        active: false,
        name: "Crop Edges",
        left: false,
        right: true,
        top: false,
        buttom: false,
        size: .05,
        controlsTemplate: "/Partials/crop-controls.html",
        update: function () {

            if ($scope.mod_pepe_stamp.timeout != null) {
                $timeout.cancel($scope.mod_pepe_stamp.timeout);
                $scope.mod_pepe_stamp.timeout = null;
            }

            $scope.mod_pepe_stamp.timeout = $timeout(function () {
                $scope.derpa.updateImageCtx();
            }, 50);
        },
        modifyCtx: function () {

            var takeLeft = 0;
            var takeTop = 0;
            var takeBottom = 0;
            var takeRight = 0;

            if ($scope.mod_crop.left) {
                takeLeft = $scope.canvas.width * $scope.mod_crop.size * $scope.randBetween(.95, 1.05);
            }

            if ($scope.mod_crop.right) {
                takeRight = $scope.canvas.width * $scope.mod_crop.size * $scope.randBetween(.95, 1.05);
            }

            if ($scope.mod_crop.top) {
                takeTop = $scope.canvas.height * $scope.mod_crop.size * $scope.randBetween(.95, 1.05);
            }

            if ($scope.mod_crop.bottom) {
                takeBottom = $scope.canvas.height * $scope.mod_crop.size * $scope.randBetween(.95, 1.05);
            }

            var canvas = document.createElement("canvas");

            canvas.width = $scope.canvas.width - (takeLeft + takeRight);
            canvas.height = $scope.canvas.height - (takeTop + takeBottom);

            var ctx = canvas.getContext("2d");

            ctx.drawImage($scope.canvas, takeLeft, takeTop, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

            $scope.canvas = canvas;
            $scope.ctx = ctx;
        }
    }

    $scope.mod_pepe_stamp = {
        active: false,
        name: "Image Stamp",
        upLeft: false,
        upRight: false,
        downLeft: false,
        downRight: true,
        size: .125,
        controlsTemplate: "/Partials/image-stamp-controls.html",
        stamps: [
            {
                name: "Original Pepe",
                imageName: "originalPepe",
                image: new Image(),
                url: "/Images/originalPepe.png",
                isCustom: false,
                mult: 1,
                loaded: false
            },
            {
                name: "DERPA BLOCK",
                imageName: "derpaIcon",
                image: new Image(),
                url: "/Images/derpa-icon.png",
                isCustom: false,
                mult: 1.25,
                loaded: false
            },
            {
                name: "Trump Laugh",
                imageName: "trumpLaugh",
                image: new Image(),
                url: "/Images/trump-laugh.png",
                isCustom: false,
                mult: 1,
                loaded: false
            },
            {
                name: "Q Flag Icon",
                imageName: "qicon",
                image: new Image(),
                url: "/Images/qicon.png",
                isCustom: false,
                mult: 1,
                loaded: false
            },
            {
                name: "WWG1WGA",
                imageName: "wwg1wga",
                image: new Image(),
                url: "/Images/wwg1wga.png",
                isCustom: false,
                mult: 2,
                loaded: false
            },
            {
                name: "Angry NPC",
                imageName: "angryNPC",
                image: new Image(),
                url: "/Images/angryNPC.png",
                isCustom: false,
                mult: 1,
                loaded: false
            }
        ],
        update: function () {

            if ($scope.mod_pepe_stamp.timeout != null) {
                $timeout.cancel($scope.mod_pepe_stamp.timeout);
                $scope.mod_pepe_stamp.timeout = null;
            }

            $scope.mod_pepe_stamp.timeout = $timeout(function () {
                $scope.derpa.updateImageCtx();
            }, 50);
        },
        readyStamp: function (stamp) {




            if (!stamp.loaded && !stamp.isCustom) {
                stamp.image.onload = function () {

                    stamp.loaded = true;
                    $scope.derpa.updateImageCtx();
                }

                stamp.image.src = stamp.url;
            }
        },
        init: function () {
            $scope.mod_pepe_stamp.selectedStamp = $scope.mod_pepe_stamp.stamps[0];

            for (var g = 0; g < $scope.mod_pepe_stamp.stamps.length; g++) {
                $scope.mod_pepe_stamp.readyStamp($scope.mod_pepe_stamp.stamps[g]);
            }
        },
        modifyCtx: function () {

            var stamp = $scope.mod_pepe_stamp.selectedStamp;

            if (!stamp.loaded) {
                return;
            }

            var lgDir = Math.max($scope.canvas.width, $scope.canvas.height);

            var size = $scope.mod_pepe_stamp.size * lgDir * stamp.mult * $scope.randBetween(.95, 1.05);

            var lgDir2 = Math.max(stamp.image.width, stamp.image.height);

            var perc = size / lgDir2;

            var offs = lgDir * .015;

            var lshift = .2;

            if ($scope.mod_pepe_stamp.upLeft) {
                var r = offs * $scope.randBetween(-lshift, lshift);

                $scope.ctx.drawImage(stamp.image, offs + r, offs + r, stamp.image.width * perc, stamp.image.height * perc);
            }
            if ($scope.mod_pepe_stamp.upRight) {
                var r = offs * $scope.randBetween(-lshift, lshift);
                $scope.ctx.drawImage(stamp.image, $scope.canvas.width - (offs + stamp.image.width * perc) + r, offs + r, stamp.image.width * perc, stamp.image.height * perc);
            }
            if ($scope.mod_pepe_stamp.downLeft) {
                var r = offs * $scope.randBetween(-lshift, lshift);
                $scope.ctx.drawImage(stamp.image, offs + r, $scope.canvas.height - (offs + stamp.image.height * perc) + r, stamp.image.width * perc, stamp.image.height * perc);
            }
            if ($scope.mod_pepe_stamp.downRight) {
                var r = offs * $scope.randBetween(-lshift, lshift);
                $scope.ctx.drawImage(stamp.image, $scope.canvas.width - (offs + stamp.image.width * perc) + r, $scope.canvas.height - (offs + stamp.image.height * perc) + r, stamp.image.width * perc, stamp.image.height * perc);
            }
        }
    }

    $scope.mod_pepe_stamp.init();

    $scope.mod_tri_rec = {
        active: true,
        name: "Triangular Recolor",
        controlsTemplate: "/Partials/triangle-recolor-controls.html",
        intensity: .3,
        intensitySlider: {
            min: .1,
            max: .6,
            value: $scope.randBetween(.19, .25),
            onEndEdit: function () {
                $scope.derpa.activeProcessing = true;

                $timeout(function () {
                    $scope.derpa.updateImage();
                }, 25);

                $scope.safeApply();
            }
        },
        brightnessSlider: {
            min: 0,
            max: 1,
            value: $scope.randBetween(0, .1),
            onEndEdit: function () {
                $scope.derpa.activeProcessing = true;

                $timeout(function () {
                    $scope.derpa.updateImage();
                }, 25);

                $scope.safeApply();
            }
        },
        sizeSlider: {
            min: .04,
            max: .2,
            value: $scope.randBetween(.06, .1),
            onEndEdit: function () {
                $scope.derpa.activeProcessing = true;

                $timeout(function () {
                    $scope.derpa.updateImage();
                }, 25);

                $scope.safeApply();
            }
        },
        shift: .5,
        triangles: [],
        getColor: function () {

            var min = $scope.mod_tri_rec.brightnessSlider.value * 155.0;
            
            return {
                r: min + Math.random() * (255 - min),
                g: min + Math.random() * (255 - min),
                b: min + Math.random() * (255 - min),
                a: 255
            };
        },
        update: function () {

            var lgDir = Math.max($scope.derpa.width, $scope.derpa.height);

            var x = -($scope.mod_tri_rec.sizeSlider.value * lgDir * 2);
            var y = -($scope.mod_tri_rec.sizeSlider.value * lgDir * 2);

            var maxX = $scope.derpa.width + ($scope.mod_tri_rec.sizeSlider.value * lgDir * 2);
            var maxY = $scope.derpa.height + ($scope.mod_tri_rec.sizeSlider.value * lgDir * 2);

            var size = $scope.mod_tri_rec.sizeSlider.value * lgDir;

            var shift = size * $scope.mod_tri_rec.shift;

            var grid = [];

            for (var g = 0; g * size + x <= maxX + size; g++) {
                grid[g] = [];
                for (var h = 0; h * size + y <= maxY + size; h++) {
                    var gridLoc = {
                        x: g * size + x,
                        y: h * size + y
                    };

                    gridLoc.x = gridLoc.x + $scope.randBetween(0, shift) - (shift * .5);
                    gridLoc.y = gridLoc.y + $scope.randBetween(0, shift) - (shift * .5);
                    grid[g][h] = gridLoc;
                }
            }

            $scope.mod_tri_rec.triangles = [];

            for (var g = 0; g < grid.length - 1; g++) {
                for (var h = 0; h < grid[g].length - 1; h++) {

                    if ($scope.randBetween(0, 100) > 50) {

                        $scope.mod_tri_rec.triangles.push({
                            corners: [
                                [grid[g][h].x, grid[g][h].y],
                                [grid[g + 1][h].x, grid[g + 1][h].y],
                                [grid[g][h + 1].x, grid[g][h + 1].y]
                            ],
                            color: $scope.mod_tri_rec.getColor()
                        });
                        $scope.mod_tri_rec.triangles.push({
                            corners: [
                                [grid[g + 1][h + 1].x, grid[g + 1][h + 1].y],
                                [grid[g + 1][h].x, grid[g + 1][h].y],
                                [grid[g][h + 1].x, grid[g][h + 1].y]
                            ],
                            color: $scope.mod_tri_rec.getColor()
                        });

                    } else {

                        $scope.mod_tri_rec.triangles.push({
                            corners: [
                                [grid[g][h].x, grid[g][h].y],
                                [grid[g + 1][h + 1].x, grid[g + 1][h + 1].y],
                                [grid[g][h + 1].x, grid[g][h + 1].y]
                            ],
                            color: $scope.mod_tri_rec.getColor()
                        });
                        $scope.mod_tri_rec.triangles.push({
                            corners: [
                                [grid[g][h].x, grid[g][h].y],
                                [grid[g + 1][h].x, grid[g + 1][h].y],
                                [grid[g + 1][h + 1].x, grid[g + 1][h + 1].y]
                            ],
                            color: $scope.mod_tri_rec.getColor()
                        });
                    }
                }
            }
        },
        modifyCtx: function () {

            $scope.mod_tri_rec.update();

            for (var g = 0; g < $scope.mod_tri_rec.triangles.length; g++) {
                $scope.ctx.beginPath();
                $scope.ctx.moveTo($scope.mod_tri_rec.triangles[g].corners[0][0], $scope.mod_tri_rec.triangles[g].corners[0][1]);
                $scope.ctx.lineTo($scope.mod_tri_rec.triangles[g].corners[1][0], $scope.mod_tri_rec.triangles[g].corners[1][1]);
                $scope.ctx.lineTo($scope.mod_tri_rec.triangles[g].corners[2][0], $scope.mod_tri_rec.triangles[g].corners[2][1]);
                $scope.ctx.closePath();

                var rgba = "rgba(";
                rgba += $scope.mod_tri_rec.triangles[g].color.r + ",";
                rgba += $scope.mod_tri_rec.triangles[g].color.g + ",";
                rgba += $scope.mod_tri_rec.triangles[g].color.b + ",";
                rgba += $scope.mod_tri_rec.intensitySlider.value + ")";
                // the outline
                $scope.ctx.fillStyle = rgba;
                $scope.ctx.fill();
            }
        }
        /*modify: function (imageManager) {
            $scope.mod_tri_rec.update();

            for (var x = 0; x < $scope.derpa.imageManager.width; x++) {
                for (var y = 0; y < $scope.derpa.imageManager.height; y++) {

                    var found = false;

                    for (var g = 0; g < $scope.mod_tri_rec.triangles.length && !found; g++) {
                        if (pointInTriangle([x, y], $scope.mod_tri_rec.triangles[g].corners)) {

                            $scope.derpa.imageManager.pixels[x][y] = transitionToColor($scope.derpa.imageManager.pixels[x][y], $scope.mod_tri_rec.triangles[g].color, $scope.mod_tri_rec.intensitySlider.value);
                            found = true;
                        }
                    }
                }
            }
        }*/
    };

    $scope.toggleModActive = function () {
        $scope.derpa.selectedMod.active = !$scope.derpa.selectedMod.active;

        if ($scope.derpa.selectedMod.modify) {
            $scope.derpa.activeProcessing = true;
        }

        $timeout(function () {
            if ($scope.derpa.selectedMod.modify) {
                $scope.derpa.updateImage();
            }
            else {
                $scope.derpa.updateImageCtx();
            }
        }, 25);
    }

    $scope.derpa = {
        image: null,
        srcImage: null,
        imageManager: null,
        imageIsLoaded: false,
        selectedMod: $scope.mod_tri_rec,
        init: function () {

            $scope.derpa.image = document.getElementById("derpaImage");
            $scope.derpa.srcImage = document.getElementById("sourceImage");

            $scope.derpa.dropZone = document.getElementById("dropZone");
            $scope.derpa.dropZone.addEventListener("dragenter", $scope.derpa.handleDragEnter, false);
            $scope.derpa.dropZone.addEventListener("dragleave", $scope.derpa.handleDragLeave, false);
            $scope.derpa.dropZone.addEventListener("dragout", $scope.derpa.handleDragOut, false);
            $scope.derpa.dropZone.addEventListener("dragover", $scope.derpa.handleDragOver, false);
            $scope.derpa.dropZone.addEventListener("drop", $scope.derpa.handleDrop, false);
            //
            // read & create an image from the image file
             // end handleFiles
        },
        handleDrop: function (e) {
            e.stopPropagation();
            e.preventDefault();
            $scope.derpa.dragging = false;
            //

            $scope.derpa.activeProcessing = true;
            var url = e.dataTransfer.getData('text/plain');
            var files = e.dataTransfer.files;

            $timeout(function () {

                // for img elements, url is the img src so 
                // create an Image Object & draw to canvas
                if (url) {

                    $scope.derpa.srcImage.onload = function () {
                        $scope.derpa.imageIsLoaded = true;
                        $scope.derpa.updateImage();
                        $scope.safeApply();
                    }

                    $scope.derpa.srcImage.src = url;
                    // for img file(s), read the file & draw to canvas
                } else {
                    $scope.derpa.handleFiles(files);
                }
            }, 25);

            $scope.safeApply();
        },
        handleFiles: function (files) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = /image.*/;
                if (!file.type.match(imageType)) { continue; }
                var img = document.createElement("img");
                $scope.derpa.srcImage.classList.add("obj");
                $scope.derpa.srcImage.file = file;
                var reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {


                        $scope.derpa.srcImage.onload = function () {
                            $scope.derpa.imageIsLoaded = true;
                            $scope.derpa.updateImage();
                            $scope.safeApply();
                        }

                        $scope.derpa.srcImage.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);
            } // end for
        },
        handleDragEnter: function (e) {
            $scope.derpa.dragging = true;
            $scope.safeApply();
            e.stopPropagation();
            e.preventDefault();
        },
        handleDragOver: function (e) {
            $scope.derpa.dragging = true;
            $scope.safeApply();
            e.stopPropagation();
            e.preventDefault();
        },
        handleDragLeave: function (e) {
            $scope.derpa.dragging = false;
            $scope.safeApply();
            e.stopPropagation();
            e.preventDefault();
        },
        handleDragOut: function (e) {
            $scope.derpa.dragging = false;
            $scope.safeApply();
            e.stopPropagation();
            e.preventDefault();
        },
        mods: [
            $scope.mod_tri_rec,
            $scope.mod_crop,
            $scope.mod_pepe_stamp
        ],
        downloadImage: function () {

            var chars = "abcdefghijklmnopqrstuvwxyz";
            var nm = "";

            var cc = Math.round($scope.randBetween(7, 11));

            for (var g = 0; g < cc; g++) {
                var n = Math.round($scope.randBetween(0, chars.length - 1));
                nm += chars.substring(n, n + 1);
                if ($scope.randBetween(0, 5) > 4) {
                    nm += "-";
                }
            }

            var a = $("<a>")
                .attr("href", $scope.canvas.toDataURL("image/png"))
                .attr("download", nm + Math.round($scope.randBetween(100, 999999)) + ".png")
                .appendTo("body");

            a[0].click();

            a.remove();
        },
        imageLoaded: function (fileReader) {

            $scope.derpa.srcImage.onload = function () {
                $scope.derpa.imageIsLoaded = true;
                $scope.derpa.updateImage();
                $scope.safeApply();
            };
            $scope.derpa.srcImage.src = fileReader.result;
        },
        useCurrentAsSource: function () {
            $scope.derpa.activeProcessing = true;

            $timeout(function () {
                $scope.derpa.srcImage.src = $scope.canvas.toDataURL("image/png");
            }, 25);
        },
        updateImage: function () {
            if ($scope.derpa.srcImage == null) {
                return;
            }
            var canvas = document.createElement("canvas");
            $scope.canvas = canvas;
            canvas.width = $scope.derpa.srcImage.width;
            canvas.height = $scope.derpa.srcImage.height;
            var ctx = canvas.getContext("2d");
            $scope.ctx = ctx;
            ctx.drawImage($scope.derpa.srcImage, 0, 0);
            $scope.derpa.imageManager = DERPAArtTools.getPixelsManager(ctx.getImageData(0, 0, $scope.derpa.srcImage.width, $scope.derpa.srcImage.height));
            $scope.derpa.imageManager.reset();

            $scope.derpa.width = $scope.derpa.srcImage.width;
            $scope.derpa.height = $scope.derpa.srcImage.height;

            for (var g = 0; g < $scope.derpa.mods.length; g++) {

                if ($scope.derpa.mods[g].active) {
                    if ($scope.derpa.mods[g].modify) {
                        $scope.derpa.mods[g].modify($scope.derpa.imageManager);
                    }
                }
            }

            $scope.derpa.imageManager.update();

            $scope.derpa.updateImageCtx();

            $scope.derpa.activeProcessing = false;

            $scope.safeApply();
        },
        updateImageCtx: function () {

            var canvas = document.createElement("canvas");
            $scope.canvas = canvas;
            canvas.width = $scope.derpa.srcImage.width;
            canvas.height = $scope.derpa.srcImage.height;
            var ctx = canvas.getContext("2d");
            $scope.ctx = ctx;
            ctx.drawImage($scope.derpa.srcImage, 0, 0);

            $scope.ctx.putImageData($scope.derpa.imageManager.imageData, 0, 0);

            for (var g = 0; g < $scope.derpa.mods.length; g++) {

                if ($scope.derpa.mods[g].active) {
                    if ($scope.derpa.mods[g].modifyCtx) {
                        $scope.derpa.mods[g].modifyCtx();
                    }
                }
            }

            $scope.derpa.image.src = $scope.canvas.toDataURL("image/png");
        }
    };

    document.getElementById('imageFile').onchange = function (evt) {

        $scope.derpa.imageIsLoaded = false;
        $scope.derpa.activeProcessing = true;

        $timeout(function () {
            var tgt = evt.target || window.event.srcElement,
                files = tgt.files;

            // FileReader support
            if (FileReader && files && files.length) {
                var fr = new FileReader();
                fr.onload = function () {
                    $scope.derpa.imageLoaded(fr);
                };
                fr.readAsDataURL(files[0]);
            }
        }, 25);

        $scope.safeApply();
    }

    $scope.derpa.init();

    
}]);

