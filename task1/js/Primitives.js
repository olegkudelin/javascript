/**
 * Created by kudelin on 01.10.13.
 *
 * Модуль содержит несколько геометрических примитивов: круг, прямоугольник.
 * @module PRIMITIVES
 *
 */

var PRIMITIVES = PRIMITIVES || {};

/**
 * Объект прямоугольник
 * @namespace PRIMITIVES
 * @class Rectangular
 * @constructor
 * @param {int} x Координата x
 * @param {int} y Координата y
 * @param {int} width Ширина
 * @param {int} heigth Высота
 * @param {CanvasRenderingContext2D} context Контекст рисования
 */

PRIMITIVES.Rectangular = function (x, y, width, height, context) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.context = context;
    this.border = false;
    this.LINE_WIDTH = 2;
    this.color = COLORPAINT.ColorPaint.color.BLACK;
};


PRIMITIVES.Rectangular.prototype = {
    set setColor (color) {
        this.color = color;
    },
    get getColor () {
        return this.color;
    },
    isPointInside: function (x, y) {
        var c = this.context;
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height);
        c.closePath();
        return c.isPointInPath(x, y);
    },
    draw : function () {
        this.context.beginPath();
        this.context.fillStyle = this.color; // Установим цвет заливки
        this.context.strokeStyle = this.color; // Установим цвет каемки
        this.context.fillRect(this.x, this.y, this.width, this.height);  // Нарисуем закрашенные примоугольник
        this.context.fill();
        this.context.closePath();
    }
};

/**
 * Объект крестик
 * @namespace PRIMITIVES
 * @class Cross
 * @constructor
 * @param {int} x Координата x
 * @param {int} y Координата y
 * @param {int} width Ширина
 * @param {int} heigth Высота
 * @param {CanvasRenderingContext2D} context Контекст рисования
 */


PRIMITIVES.Cross = function(x, y, width, heigth, context) {
    PRIMITIVES.Rectangular.apply(this, arguments);
};

PRIMITIVES.Cross.prototype = Object.create(PRIMITIVES.Rectangular.prototype);
PRIMITIVES.Cross.prototype.constructor = PRIMITIVES.Cross;


PRIMITIVES.Cross.prototype.draw = function() {
    this.context.beginPath();
    this.context.strokeStyle = this.color;
    this.context.lineWidth = this.LINE_WIDTH;
    this.context.moveTo(this.x, this.y);
    this.context.lineTo(this.x + this.width, this.y + this.height);
    this.context.moveTo(this.x + this.width, this.y);
    this.context.lineTo(this.x, this.y + this.height);
    this.context.stroke();
    this.context.closePath();
};

/**
 * Объект круг
 * @namespace PRIMITIVES
 * @class Circle
 * @constructor
 * @param {PRIMITIVES.Point} centerPoint Координата центра круга
 * @param {int} radius Радиус
 * @param {CanvasRenderingContext2D} context Контекст
 */

PRIMITIVES.Circle = function(x, y, width, heigth, context) {
    PRIMITIVES.Rectangular.apply(this, arguments);
};

PRIMITIVES.Circle.prototype = Object.create(PRIMITIVES.Rectangular.prototype);
PRIMITIVES.Circle.prototype.constructor = PRIMITIVES.Cross;


PRIMITIVES.Circle.prototype.isPointInside = function (x, y) {
    this.context.beginPath();
    var radius = (this.width > this.height) ? this.width/2 : this.height/2;
    this.context.arc(this.x+this.width/2, this.y + this.height/2, radius, 0, 2 * Math.PI, false);
    return this.context.isPointInPath(x, y);
};

PRIMITIVES.Circle.prototype.draw = function () {
    this.context.beginPath();
    this.context.lineWidth = this.LINE_WIDTH;
    this.context.strokeStyle = this.color;
    var radius = (this.width > this.height) ? this.width/2 : this.height/2;
    this.context.arc(this.x+this.width/2, this.y + this.height/2, radius, 0, 2 * Math.PI, false);
    this.context.stroke();
};
