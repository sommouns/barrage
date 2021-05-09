"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var isPaused = true;
var CanvasBarrage = /** @class */ (function () {
    function CanvasBarrage(videoDom, canvasDom, options, data) {
        if (data === void 0) { data = []; }
        this.barrage = [];
        this.videoDom = videoDom;
        this.canvasDom = canvasDom;
        this.height = videoDom.clientHeight;
        this.width = videoDom.clientWidth;
        this.canvas = canvasDom.getContext("2d");
        this.defaultProps = {
            fontSize: 16,
            color: "#000000",
            speed: 1,
        };
        this.data = data;
        Object.assign(this.defaultProps, options);
        this.init();
    }
    CanvasBarrage.prototype.init = function () {
        var _this = this;
        this.canvasDom.style.height = this.height - 80 + "px";
        this.canvasDom.style.width = this.width + "px";
        this.barrage = this.data.map(function (item) {
            return new Barrage(__assign(__assign({}, _this.defaultProps), item), _this.canvas);
        });
        this.videoDom.addEventListener("play", function (e) {
            isPaused = false;
            _this.render();
        });
        this.videoDom.addEventListener("pause", function (e) {
            isPaused = true;
        });
        requestAnimationFrame(this.render.bind(this));
    };
    CanvasBarrage.prototype.render = function () {
        // clear canvas
        if (isPaused) {
            return;
        }
        this.canvas.clearRect(0, 0, this.height, this.width);
        var currentTime = this.videoDom.currentTime;
        this.barrage.forEach(function (barrage) {
            if (barrage.info.time <= currentTime) {
                if (!barrage.isInited) {
                    barrage.init();
                }
                barrage.render();
            }
        });
        requestAnimationFrame(this.render.bind(this));
    };
    CanvasBarrage.prototype.add = function (data) {
        this.barrage.push(new Barrage(__assign(__assign({}, this.defaultProps), data), this.canvas));
    };
    return CanvasBarrage;
}());
var Barrage = /** @class */ (function () {
    function Barrage(props, context) {
        this.isInited = false;
        this.opacity = 0;
        this.info = props;
        this.ctx = context;
    }
    Barrage.prototype.init = function () {
        this.calaculateInitPosition();
        this.isInited = true;
    };
    Barrage.prototype.calaculateInitPosition = function () {
        var span = document.createElement("span");
        span.innerHTML = this.info.text;
        span.style.position = "absolute";
        span.style.opacity = "0";
        document.body.appendChild(span);
        this.width = span.clientWidth;
        document.body.removeChild(span);
        this.x = this.ctx.canvas.width;
        this.y = this.ctx.canvas.height * Math.random();
        if (this.y < this.info.fontSize) {
            this.y = this.info.fontSize;
        }
        if (this.y > this.ctx.canvas.height - this.info.fontSize) {
            this.y = this.ctx.canvas.height - this.info.fontSize;
        }
    };
    Barrage.prototype.render = function () {
        this.x -= this.info.speed;
        this.ctx.font = this.info.fontSize + "px Microsoft Yahei";
        this.ctx.fillStyle = this.info.color;
        this.ctx.fillText(this.info.text, this.x, this.y);
    };
    return Barrage;
}());
