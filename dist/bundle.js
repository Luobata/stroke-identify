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
        //e.preventDefault();
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

/**
 * @description 图案识别算法
 */

var MIN_MOVECONTENT = 20;

var _recognize = (function (list) {
    return simplySingle(list);
});

// 信号去噪 算法来自 http://haojian.github.io/gesture_recognition/
var simplySingle = function simplySingle(list) {
    if (list.length <= 1) return list;

    var simplyList = [list[0]];
    var x = simplyList[0].x;
    var y = simplyList[0].y;

    for (var i = 1; i < list.length; i++) {
        var item = list[i];
        var dx = item.x - x;
        var dy = item.y - y;

        if (dx * dx + dy * dy > MIN_MOVECONTENT) {
            simplyList.push(item);
            x = item.x;
            y = item.y;
        }
    }

    return simplyList;
};

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
        this.zone = {
            left: null,
            right: null,
            top: null,
            bottom: null
        };
        this.zoneList = [];

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
                var position = _this.getPosition(e.touches[0].clientX, e.touches[0].clientY);
                changeZone.call(_this, position);
                _this.draw(position, false);
            });

            this.canvas.addEventListener('touchmove', function (e) {
                if (_this.drawing) {
                    var position = _this.getPosition(e.touches[0].clientX, e.touches[0].clientY);
                    changeZone.call(_this, position);
                    _this.draw(position, true);
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
                this.ctx.lineWidth = 5;
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
    }, {
        key: 'getDrawZone',
        value: function getDrawZone() {}
    }, {
        key: 'clear',
        value: function clear() {
            this.canvas.height = this.canvas.height;
        }
    }, {
        key: 'recognize',
        value: function recognize() {
            console.log(this.zoneList);
            //this.ctx.save();
            //this.ctx.beginPath();
            //this.ctx.strokeStyle = 'blue';
            //this.ctx.lineWidth = 5;
            //this.ctx.lineJoin = 'round';
            //this.ctx.moveTo(this.zone.left, this.zone.top);
            //this.ctx.lineTo(this.zone.right, this.zone.top);
            //this.ctx.lineTo(this.zone.right, this.zone.bottom);
            //this.ctx.lineTo(this.zone.left, this.zone.bottom);
            //this.ctx.closePath();
            //this.ctx.stroke();
            //this.ctx.restore();
            clearZone.call(this);

            var simplyList = _recognize(this.zoneList);
            drawLineList.call(this, simplyList);
            console.log(simplyList);
        }
    }]);
    return Canvas;
}();



// 私有方法 call方式调用 保证有this 所有不能使用箭头函数
var changeZone = function changeZone(position) {
    if (!this.zone.left || position.x < this.zone.left) {
        this.zone.left = position.x;
    }

    if (!this.zone.right || position.x > this.zone.right) {
        this.zone.right = position.x;
    }

    if (!this.zone.top || position.y > this.zone.top) {
        this.zone.top = position.y;
    }

    if (!this.zone.bottom || position.y < this.zone.bottom) {
        this.zone.bottom = position.y;
    }
    addZoneList.call(this, position);
};

var clearZone = function clearZone() {
    this.zone = {
        left: null,
        right: null,
        top: null,
        bottom: null
    };
};

var addZoneList = function addZoneList(position) {
    this.zoneList.push(position);
};

var drawLine = function drawLine(oX, oY) {
    var _this2 = this;

    var lastX = oX;
    var lastY = oY;

    return function (x, y) {
        _this2.ctx.save();
        _this2.ctx.beginPath();
        _this2.ctx.strokeStyle = 'green';
        _this2.ctx.lineWidth = 4;
        _this2.ctx.lineJoin = 'round';
        _this2.ctx.moveTo(lastX, lastY);
        _this2.ctx.lineTo(x, y);
        _this2.ctx.closePath();
        _this2.ctx.stroke();
        _this2.ctx.restore();
        lastX = x;
        lastY = y;
    };
};

var drawLineList = function drawLineList(list) {
    var draw = drawLine.call(this, list[0].x, list[0].y);

    for (var i = 1; i < list.length; i++) {
        draw(list[i].x, list[i].y);
    }
};

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
    },
    recognize: function recognize() {
        global_canvas.recognize();
    },
    clear: function clear() {
        global_canvas.clear();
    }
};

return identify;

})));
//# sourceMappingURL=bundle.js.map
