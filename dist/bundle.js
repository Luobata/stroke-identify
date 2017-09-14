(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.strokeIdentify = factory());
}(this, (function () { 'use strict';

var bodyLock = function () {
    var originScrollTop,
        originCssText,
        win = window,
        doc = win.document;
    var forbidFunc = function forbidFunc(e) {
        e.preventDefault();
        return false;
    };
    var fixedBody = {
        lock: function lock() {
            win.addEventListener('touchmove', forbidFunc);
            win.addEventListener('MSPointerMove', forbidFunc);
            win.addEventListener('pointermove', forbidFunc);
            originScrollTop = win.pageYOffset;
            originCssText = doc.body.style.cssText;
            //doc.body.style.cssText = 'height: 100vh;background-color: #f5f5f5;position: fixed;top: -999999px;'
        },
        unlock: function unlock() {
            win.removeEventListener('touchmove', forbidFunc);
            win.removeEventListener('MSPointerMove', forbidFunc);
            win.removeEventListener('pointermove', forbidFunc);
            doc.body.style.cssText = originCssText;
            win.scrollTo(win.pageXOffset, originScrollTop);
        }
    };
    return fixedBody;
}();

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Canvas = function () {
    function Canvas(canvas, ctx, _ref) {
        var width = _ref.width,
            height = _ref.height;
        classCallCheck(this, Canvas);

        this.canvas = canvas;
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.drawing = false;
        this.rate = parseInt(document.body.clientWidth / 320, 10) * 2;

        bodyLock.lock();
        this.init();
        this.eventBind();
    }

    createClass(Canvas, [{
        key: 'init',
        value: function init() {
            this.canvas.width = this.width * 2;
            this.canvas.height = this.height * 2;

            this.canvas.style.width = this.width + 'px';
            this.canvas.style.height = this.height + 'px';
        }
    }, {
        key: 'eventBind',
        value: function eventBind() {
            var _this = this;

            this.canvas.addEventListener('touchstart', function (e) {
                _this.drawing = true;
                _this.draw(_this.getPosition(e.touches[0].clientX, e.touches[0].clientY), false);
            });

            this.canvas.addEventListener('touchmove', function (e) {
                if (_this.drawing) {
                    _this.draw(_this.getPosition(e.touches[0].clientX, e.touches[0].clientY), true);
                }
                e.preventDefault();
            });

            this.canvas.addEventListener('touchend', function (e) {
                _this.drawing = false;
            });
        }
    }, {
        key: 'draw',
        value: function draw(_ref2, isLine) {
            var x = _ref2.x,
                y = _ref2.y;

            if (isLine) {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'red';
                this.ctx.lineWidth = 10;
                this.ctx.lineJoin = 'round';
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.restore();
            }

            this.lastX = x;
            this.lastY = y;
        }
    }, {
        key: 'getPosition',
        value: function getPosition(x, y) {
            var box = this.canvas.getBoundingClientRect();

            return {
                x: (x - box.left * (this.canvas.width / box.width)) * this.rate,
                y: (y - box.top * (this.canvas.height / box.height)) * this.rate
            };
        }
    }]);
    return Canvas;
}();

var _init = (function (canvas, ctx, options) {
    return new Canvas(canvas, ctx, options);
});

var global_canvas = void 0;

var identify = {
    init: function init(dom, options) {
        var canvas = document.getElementById(dom);
        var ctx = void 0;

        if (canvas.getContext) {
            ctx = canvas.getContext('2d');
            global_canvas = _init(canvas, ctx, options);
        }
    }
};

return identify;

})));
//# sourceMappingURL=bundle.js.map
