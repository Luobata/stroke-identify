import init from 'CANVAS/index.js';

let global_canvas;

const identify = {
    init (dom, options) {
        const canvas = document.getElementById(dom);
        let ctx;

        if (canvas.getContext) {
            ctx = canvas.getContext('2d');
            global_canvas = init(canvas, ctx, options);
        }
    },
    recognize () {
        global_canvas.recognize();
    },
    clear () {
        global_canvas.clear();
    }
};

export default identify;
