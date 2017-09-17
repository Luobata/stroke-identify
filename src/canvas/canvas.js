import { bodyLock } from 'UTIL/index.js';

export default class Canvas {

    width: number;
    height: nubmer;
    drawing: boolean;
    rate: number;
    lastX: number;
    lastY: number;
    zone: object;

    constructor (canvas, ctx, 
        {
            width,
            height
        }
    ) {
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

        bodyLock.lock();
        this.init();
        this.eventBind();
    };

    init () {
        this.canvas.width = this.width * 2;
        this.canvas.height = this.height * 2;

        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
    };

    eventBind () {
        this.canvas.addEventListener('touchstart', (e) => {
            this.drawing = true;
            let position = this.getPosition(e.touches[0].clientX, e.touches[0].clientY);
            changeZone.call(this, position);
            this.draw(position, false);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (this.drawing) {
                let position = this.getPosition(e.touches[0].clientX, e.touches[0].clientY);
                changeZone.call(this, position);
                this.draw(position, true);
            }
            e.preventDefault();
        });

        this.canvas.addEventListener('touchend', (e) => {
            this.drawing = false;
        });
    };

    draw ({
        x,
        y
    }, isLine) {
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
    };

    getPosition (x, y) {
        const box = this.canvas.getBoundingClientRect();

        return {
            x: (x - box.left * (this.canvas.width / box.width)) * this.rate,
            y: (y - box.top * (this.canvas.height / box.height)) * this.rate
        };
    };

    getDrawZone () {
    };

    clear () {
        this.canvas.height = this.canvas.height;
    };

    recognize () {
        console.log(this.zone);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'blue';
        this.ctx.lineWidth = 5;
        this.ctx.lineJoin = 'round';
        this.ctx.moveTo(this.zone.left, this.zone.top);
        this.ctx.lineTo(this.zone.right, this.zone.top);
        this.ctx.lineTo(this.zone.right, this.zone.bottom);
        this.ctx.lineTo(this.zone.left, this.zone.bottom);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
        clearZone.call(this);
    };
};

// 私有方法 call方式调用 保证有this 所有不能使用箭头函数
const changeZone = function (position) {
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
};

const clearZone = function () {
    this.zone = {
        left: null,
        right: null,
        top: null,
        bottom: null
    };
};
