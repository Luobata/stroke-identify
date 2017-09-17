/**
 * @description 图案识别算法
 */

const MIN_MOVECONTENT = 20;

export default (
    list: Array
) => {
    return simplySingle(list);
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
