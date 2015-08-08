
        function Swip(a, b, c, d, e, f) {
            this.conNode = a,
                this.background = null ,
                this.backCtx = null ,
                this.mask = null ,
                this.maskCtx = null ,
                this.lottery = null ;
                this.lotteryType = "image",
                this.cover = b || "#000",
                this.coverType = c,
                this.pixlesData = null ,
                this.width = d,
                this.height = e;
                this.lastPosition = null ,
                this.drawPercentCallback = f;
        }

        Swip.prototype = {
            createElement: function (a, b) {
                var c = document.createElement(a);
                for (var d in b)
                    c.setAttribute(d, b[d]);
                return c
            },
            getTransparentPercent: function (a, b, c) {
                for (var d = a.getImageData(0, 0, b, c), e = d.data, f = [], g = 0, h = e.length; h > g; g += 4) {
                    var i = e[g + 3];
                    128 > i && f.push(g)
                }
                return (f.length / (e.length / 4) * 100).toFixed(2)
            },
            resizeCanvas: function (a, b, c) {
                a.width = b,
                    a.height = c,
                    a.getContext("2d").clearRect(0, 0, b, c)
            },
            resizeCanvas_w: function (a, b, c) {
                a.width = b,
                    a.height = c,
                    a.getContext("2d").clearRect(0, 0, b, c),
                    this.drawMask()
            },
            drawPoint: function (a, b) {
                    this.maskCtx.beginPath();
                    this.maskCtx.arc(a, b, 15, 0, 2 * Math.PI);
                    this.maskCtx.fill();
                    this.maskCtx.beginPath(),
                    this.maskCtx.lineWidth = 30,
                    this.maskCtx.lineCap = this.maskCtx.lineJoin = "round";
                this.lastPosition && this.maskCtx.moveTo(this.lastPosition[0], this.lastPosition[1]),
                    this.maskCtx.lineTo(a, b);
                    this.maskCtx.stroke();
                    this.lastPosition = [a, b],
                    this.mask.style.zIndex = 20 == this.mask.style.zIndex ? 21 : 20
            },
            bindEvent: function () {
                var a = this
                    , b = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())
                    , c = b ? "touchstart" : "mousedown"
                    , d = b ? "touchmove" : "mousemove";
                if (b)
                    a.conNode.addEventListener("touchmove", function (a) {
                            e && a.preventDefault(),
                                a.cancelable ? a.preventDefault() : window.event.returnValue = !1
                        }
                        , !1),
                        a.conNode.addEventListener("touchend", function () {
                                e = !1;
                                var b = a.getTransparentPercent(a.maskCtx, a.width, a.height);
                                b >= 30 && "function" == typeof a.drawPercentCallback && a.drawPercentCallback()
                            }
                            , !1);
                else {
                    var e = !1;
                    a.conNode.addEventListener("mouseup", function (b) {
                            b.preventDefault(),
                                e = !1;
                            var c = a.getTransparentPercent(a.maskCtx, a.width, a.height);

                            c >= 30 && "function" == typeof a.drawPercentCallback && a.drawPercentCallback()
                        }
                        , !1)
                }
                this.mask.addEventListener(c, function (c) {
                        c.preventDefault(),
                            e = !0;
                        var d = b ? c.touches[0].pageX : c.pageX || c.x
                            , f = b ? c.touches[0].pageY : c.pageY || c.y;
                        a.drawPoint(d, f, e)
                    }
                    , !1),
                    this.mask.addEventListener(d, function (c) {
                            if (c.preventDefault(),
                                    !e)
                                return !1;
                            c.preventDefault();
                            var d = b ? c.touches[0].pageX : c.pageX || c.x
                                , f = b ? c.touches[0].pageY : c.pageY || c.y;
                            a.drawPoint(d, f, e)
                        }
                        , !1)
            },
            drawMask: function () {
                if ("color" == this.coverType)
                    this.maskCtx.fillStyle = this.cover,
                        this.maskCtx.fillRect(0, 0, this.width, this.height),
                        this.maskCtx.globalCompositeOperation = "destination-out";
                else if ("image" == this.coverType) {
                    var a = new Image
                        , b = this;
                    a.crossOrigin = "";
                        a.onload = function () {
                            b.resizeCanvas(b.mask, b.width, b.height);
                            b.maskCtx.globalAlpha = .98;
                                b.maskCtx.drawImage(this, 0, 0, this.width, this.height, 0, 0, b.width, b.height);
                            var a = 25
                                , c = $("#ca-tips").val()
                                , d = b.maskCtx.createLinearGradient(0, 0, b.width, 0);
                                d.addColorStop("0", "rgba(229, 28, 35, .8)");
                                d.addColorStop("1.0", "rgba(0, 128, 0, .5)"),
                                b.maskCtx.font = "Bold " + a + "px Arial",
                                b.maskCtx.textAlign = "left",
                                b.maskCtx.fillStyle = d;
                                b.maskCtx.fillText(" " +c, b.width / 2 - b.maskCtx.measureText(c).width / 2, 75);
                                b.maskCtx.globalAlpha = 1;
                                b.maskCtx.globalCompositeOperation = "destination-out";
                        }
                        ;
                        a.src = this.cover
                }
            },
            init: function (a, b) {
                   var clientRect = document.documentElement.getBoundingClientRect();
                   var clientWidth = clientRect.width;
                   var clientHeight = clientRect.height;
                    this.mask = this.mask || this.createElement("canvas", {
                        style: "position:absolute;left:50%;top:0;width:" + clientWidth + "px;margin-left:-" + clientWidth/2 + "px;height:100%;background-color:transparent;"
                    });
                    this.mask.style.zIndex = 20,
                this.conNode.innerHTML.replace(/[\w\W]| /g, "");
                    this.conNode.appendChild(this.mask),
                    this.bindEvent();
                    this.maskCtx = this.maskCtx || this.mask.getContext("2d");
                    this.drawMask();
                var c = this;
                window.addEventListener("resize", function () {
                        c.width = clientWidth,
                            c.height = clientHeight,
                            c.resizeCanvas_w(c.mask, c.width, c.height)
                    }
                    , !1)
            }
        }
