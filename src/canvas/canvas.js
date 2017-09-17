import { bodyLock } from 'UTIL/index.js';
import recognize from 'CANVAS/recognize.js';

export default class Canvas {

    width: number;
    height: nubmer;
    drawing: boolean;
    rate: number;
    lastX: number;
    lastY: number;
    zone: object;
    zoneList: Array;

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
        this.zoneList = [];

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

        let simplyList = recognize(this.zoneList);
        drawLineList.call(this, simplyList);
        console.log(simplyList);
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
    addZoneList.call(this, position);
};

const clearZone = function () {
    this.zone = {
        left: null,
        right: null,
        top: null,
        bottom: null
    };
};

const addZoneList = function (position) {
    this.zoneList.push(position);
};

const drawLine = function (oX, oY) {
    let lastX = oX;
    let lastY = oY;

    return (x, y) => {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 4;
        this.ctx.lineJoin = 'round';
        this.ctx.moveTo(lastX, lastY);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
        lastX = x;
        lastY = y;
    };
};

const drawLineList = function (list) {
    let draw = drawLine.call(this, list[0].x, list[0].y);

    for (let i = 1; i < list.length; i++) {
        draw(list[i].x, list[i].y);
    }

};
