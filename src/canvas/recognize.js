/**
 * @description 图案识别算法
 */
import { abs } from 'UTIL/index.js';
const MIN_MOVECONTENT = 50;

export default (
    list: Array
) => {
    let singles = simplySingle(list);
    singles = limitDirections(singles);
    singles = simplyDirection(singles);
    console.log(singles);

    return singles;
};

// 信号去噪 算法来自 http://haojian.github.io/gesture_recognition/
const simplySingle = (list) => {
    if (list.length <= 1) return list;

    let simplyList = [list[0]];
    let x = simplyList[0].x;
    let y = simplyList[0].y;

    for (let i = 1; i < list.length; i++) {
        let item = list[i];
        let dx = item.x - x;
        let dy = item.y - y;

        if ((dx * dx + dy * dy) > MIN_MOVECONTENT) {
            simplyList.push(item);
            x = item.x;
            y = item.y;
        }
    }

    return simplyList;
};

const limitDirections = (list) => {
    let dirList = [];
    let lastX = list[0].x;
    let lastY = list[0].y;

    for (let i = 1; i < list.length; i++) {
        let dx = list[i].x - lastX;
        let dy = list[i].y - lastY;

        if (abs(dx) > abs(dy)) {
            dy = 0;
        } else {
            dx = 0;
        }

        dirList.push({x: dx, y: dy});
        lastX = list[i].x;
        lastY = list[i].y;
    }

    return dirList;
};

const simplyDirection = (list) => {
    let dirList = [];
    let lastX = list[0].x;
    let lastY = list[1].y;
    const similarDir = (a, b) => {
        return !!(a * b > 0);
    };

    for (let i = 1;i < list.length; i++) {
        let joined = false;

        if (similarDir(lastX, list[i].x)) {
            joined = true;
            lastX += list[i].x;
        }

        if (similarDir(lastY, list[i].y)) {
            joined = true;
            lastY += list[i].y;
        }

        if (!joined || i === list.length - 1) {
            dirList.push({x: lastX, y: lastY});

            lastX = list[i].x;
            lastY = list[i].y;
        }
    }

    return dirList;
};

const removeShortNoise = (list) => {
};
