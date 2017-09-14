export const bodyLock = (function () {
    var originScrollTop, originCssText, win = window, doc = win.document;
    var forbidFunc = function (e) {
        e.preventDefault();
        return false;
    };
    var fixedBody = {
        lock: function () {
            win.addEventListener('touchmove', forbidFunc);
            win.addEventListener('MSPointerMove', forbidFunc);
            win.addEventListener('pointermove', forbidFunc);
            originScrollTop = win.pageYOffset;
            originCssText = doc.body.style.cssText;
            //doc.body.style.cssText = 'height: 100vh;background-color: #f5f5f5;position: fixed;top: -999999px;'
        },
        unlock: function () {
            win.removeEventListener('touchmove', forbidFunc);
            win.removeEventListener('MSPointerMove', forbidFunc);
            win.removeEventListener('pointermove', forbidFunc);
            doc.body.style.cssText = originCssText;
            win.scrollTo(win.pageXOffset, originScrollTop);
        }
    };
    return fixedBody;
}());
