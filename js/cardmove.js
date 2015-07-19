/**
 * 卡片滑动翻滚
 */
;

"use strict";

(function (window, document, undefined) {
    var clientHeight = document.documentElement.getBoundingClientRect().height, MOVE_THREHOLD = clientHeight / 5, DOWN = 1,
        UP = -1, MINY = 5;

    var div = document.createElement('div');
    var prefix = ['webkit', 'moz', 'o', 'ms'];

    function CardMove(element, opts) {
        return (this instanceof CardMove)
            ? this.init(element, opts)
            : new CardMove(element, opts);
    }

    CardMove.prototype.init = function (element, opts) {
        var self = this;

        // set element
        self.element = element;
        if (typeof element === 'string') {
            self.element = document.querySelector(element);
        }

        if (!self.element) {
            throw new Error('element not found');
        }

        var domPages = self.element.children;
        if (domPages.length < 2) {
            throw new Error('At least 2 frames required!');
        }

        setStyle(self.element.style, "height", clientHeight + "px");

        self.pages = Array.prototype.slice.call(domPages, 0);

        self.pages.forEach(function (page) {
            setStyle(page.style, "height", clientHeight + "px");
        });

        self.prePage = null;
        self.currentPage = self.pages[0];
        self.nextPage = self.pages[1];

        self.clientHeight = clientHeight;


        addEvent(self.element, "touchstart", self, false);

        return self;
    }

    /**
     * 事件分发
     * @param event
     */
    CardMove.prototype.handleEvent = function (event) {
        var self = this;

        switch (event.type) {
            case "touchstart":
                self._start(event);
                break;
            case "touchmove":
                self._move(event);
                break;
            case "touchend":
                self._end(event);
                break;
            case "touchcancel":
                self._cancel(event);
                break;
            case 'webkitTransitionEnd':
                self._transitionEnd(event);
                break;
        }
    };

    CardMove.prototype._start = function (event) {
        var self = this;

        addEvent(self.element, "touchmove", self, false);
        addEvent(self.element, "touchend", self, false);
        addEvent(self.element, "webkitTransitionEnd", self, false);
        //addEvent(document, "touchstart", self.documentPreventFn , false);

        var tagName = event.target.tagName;
        if (tagName !== 'A' && tagName !== 'SELECT' && tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'BUTTON') {
            event.preventDefault();
        }

        self.startPageX = getPage(event, 'pageX');
        self.startPageY = getPage(event, 'pageY');
        self.startTime = event.timeStamp;
        self.moving = false;
        self.transition = false;
    }

    CardMove.prototype._move = function (event) {
        var self = this;

        var pageX = getPage(event, 'pageX');
        var pageY = getPage(event, 'pageY');

        //滑动没超过MINY,不动作
        var dir = swipeDirection(self.startPageY, pageY);
        if (dir === 0) {
            //removeEvent(self.element, "touchend", self, false);
            return;
        }

        if (dir === UP && self.nextPage) {
            if (!self.moving) {
                self.moving = true;
                setStyle(self.nextPage.style, {
                    "transitionDuration": "0ms",
                    "-webkit-transform": "translate3d(0, " + self.clientHeight + "px, 0)"
                });
                $(self.nextPage).addClass("active").removeClass("f-hide");
            } else {
                setStyle(self.currentPage.style, {
                    "transitionDuration": "0ms",
                    "-webkit-transform": "translate3d(0, -" + Math.min(self.clientHeight, Math.abs(self.startPageY - pageY)/10) + "px, 0) scale(" + (1 - (Math.abs(self.startPageY - pageY) / self.clientHeight * 0.2) ) +")"
                });
                setStyle(self.nextPage.style, {
                    "transitionDuration": "0ms",
                    "-webkit-transform": "translate3d(0, " + (self.clientHeight - Math.abs(self.startPageY - pageY)) + "px, 0)"
                });
            }
        } else if (dir === DOWN && self.prePage) {
            if (!self.moving) {
                self.moving = true;
                setStyle(self.prePage.style, {
                    "transitionDuration": "0ms",
                    "webkitTransform": "translate3d(0, -" + self.clientHeight + "px, 0)"
                });
                $(self.prePage).addClass("active").removeClass("f-hide");
                //$(self.currentPage).removeClass("active");
            } else {
                setStyle(self.currentPage.style, {
                    "transitionDuration": "0ms",
                    "webkitTransform": "translate3d(0, " + (Math.abs(self.startPageY - pageY) / 10) + "px, 0) scale(" + (1 - (Math.abs(self.startPageY - pageY) / self.clientHeight * 0.2) ) + ")"
                });
                setStyle(self.prePage.style, {
                    "transitionDuration": "0ms",
                    "webkitTransform": "translate3d(0, " + (Math.abs(self.startPageY - pageY) - self.clientHeight) + "px, 0)"
                });
            }
        } else {
            removeEvent(self.element, "touchend", self, false);
        }
    }

    CardMove.prototype._end = function (event) {
        var self = this,
            pageY = getPage(event, 'pageY'),
            target;

        removeEvent(self.element, "touchmove", self, false);
        removeEvent(self.element, "touchend", self, false);
        //removeEvent(document, "touchstart", self.documentPreventFn, false);

        var dir = swipeDirection(self.startPageY, pageY);
        self.direction = dir;
        self.transition = true;
        if (dir === UP) {
            setStyle(self.nextPage.style, {
                "transitionDuration": "350ms",
                "-webkit-transform": "translate3d(0, 0, 0)"
            });
        } if (dir === DOWN) {
            setStyle(self.prePage.style, {
                "transitionDuration": "350ms",
                "-webkit-transform": "translate3d(0, 0, 0)"
            });
        }
    }

    CardMove.prototype._cancel = function (event) {
        var self = this;
        removeEvent(document, "touchstart", self, false);
        removeEvent(document, "webkitTransitionEnd", self, false);
    }

    CardMove.prototype._transitionEnd = function (event) {
        var self = this;
         //alert("_transitionEnd");

        if (!self.transition) return;

        removeEvent(document, "webkitTransitionEnd", self, false);

        $(self.currentPage).addClass("f-hide");
        if (self.direction === UP) {
            $(self.nextPage).removeClass("active");
            self.prePage = self.currentPage;
            self.currentPage = self.nextPage;
            self.nextPage = null;
        } else if (self.direction === DOWN) {
            $(self.prePage).removeClass("active");
            self.nextPage = self.currentPage;
            self.currentPage = self.prePage;
            self.prePage = null;
        }
        self.transition = false;
        self._triggerEvent('cdTransitionEnd', true, false, {"currentPage": self.currentPage});
    }

    CardMove.prototype._triggerEvent = function (type, bubbles, cancelable, data) {
        var self = this;

        var ev = document.createEvent('Event');
        ev.initEvent(type, bubbles, cancelable);

        if (data) {
            for (var d in data) {
                if (data.hasOwnProperty(d)) {
                    ev[d] = data[d];
                }
            }
        }

        return self.element.dispatchEvent(ev);
    }

    CardMove.prototype._cancel = function (event) {
        var self = this;
        removeEvent(document, "touchstart", self, false);
        removeEvent(document, "webkitTransitionEnd", self, false);
    }

    /**
     * 滑动手势方向
     *   向左滑返回1，向右滑返回-1
     * @returns {string}
     */
    function swipeDirection(startY, moveY) {
        if (Math.abs(startY - moveY) < MINY) return 0;

        return startY > moveY ? UP : DOWN;
    }

    function addEvent(el, type, fn, capture) {
        el.addEventListener(type, fn, !!capture);
    }

    function removeEvent (el, type, fn, capture) {
        el.removeEventListener(type, fn, !!capture);
    }

    function getPage(event, page) {
        return event.changedTouches ? event.changedTouches[0][page] : event[page];
    }

    function setStyle(style, prop, val) {
        if (typeof prop === "string" && style[prop] !== undefined) {
            style[prop] = val;
        }

        if (typeof prop === "object") {
            for (var key in prop) {
                setStyle(style, key, prop[key]);
            }
        }
    }

    function getCSSVal(prop) {
        if (div.style[prop] !== undefined) {
            return prop;
        }
        else {
            var ret;
            some(prefix, function (_prefix) {
                var _prop = _prefix + ucFirst(prop);
                if (div.style[_prop] !== undefined) {
                    ret = '-' + _prefix + '-' + prop;
                    return true;
                }
            });
            return ret;
        }
    }

    function ucFirst(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }

    function some(ary, callback) {
        for (var i = 0, len = ary.length; i < len; i++) {
            if (callback(ary[i], i)) {
                return true;
            }
        }
        return false;
    }


    window.CardMove = CardMove;

})(window, window.document);