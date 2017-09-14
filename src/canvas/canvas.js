import { bodyLock } from 'UTIL/index.js';

export default class Canvas {

    width: number;
    height: nubmer;
    drawing: boolean;
    rate: number;
    lastX: number;
    lastY: number;

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
            this.draw(this.getPosition(e.touches[0].clientX, e.touches[0].clientY), false);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (this.drawing) {
                this.draw(this.getPosition(e.touches[0].clientX, e.touches[0].clientY), true);
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
};
