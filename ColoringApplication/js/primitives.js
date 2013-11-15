/**
* Модуль содержит несколько геометрических примитивов: круг, прямоугольник.
* @module primitives
*
*/

var PRIMITIVES = PRIMITIVES || {};

/**
* Объект точка 
* @namespace PRIMITIVES
* @class Point
* @constructor 
* @param {int} x Координата x
* @param {int} y Координата y
*/

PRIMITIVES.Point = {
    x: undefined,
    y: undefined,
    setCoord: function (x, y) {
        this.x = x;
        this.y = y;
    }
};

/**
* Объект круг 
* @namespace PRIMITIVES
* @class Circle
* @constructor 
* @param {int} x Координата x
* @param {int} y Координата y
* @param {int} Radius Радиус
*/

PRIMITIVES.Circle = function (x, y, Radius) {
    this.x = x;
    this.y = y;
    this.radius = Radius;
    this.color;    // Цвет внутри круга
    this.border = false; // Флаг, определяющий, будет ли отрисовываться окружность другим цветом. Актуально для белого круга на белом фоне и т.п. 
};

   
   /**
   * Определяет, находится ли точка внутри фигуры
   * @method pointInObject
   * @param {int} x Координата x
   * @param {int} y Координата y
   * @return {boolean} True, если точка внутри фигуры
   */
    PRIMITIVES.Circle.prototype.pointInObject = function (x, y) {
        var r = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)); // Вычисление расстояния между центром окружности и точкой
        return Boolean(this.radius > r);
    };


   /**
   * Установка цвета фигуры
   * @method setColor
   * @param {Color} color Цвет
   */
    PRIMITIVES.Circle.prototype.setColor = function (color) {
        this.color = color;
    };


   /**
   * Получение цвета фигуры
   * @method getColor
   * @param {}
   * @return {strnig} color цвет фигуры
   */
    PRIMITIVES.Circle.prototype.getColor = function () {
        return this.color;
    };


/**
* Объект прямоугольник 
* @namespace PRIMITIVES
* @class Rectangular
* @constructor 
* @param {int} x Координата x
* @param {int} y Координата y
* @param {int} width Ширина
* @param {int} heigth Высота
*/

PRIMITIVES.Rectangular = function (x, y, width, heigth) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.heigth = heigth;
};

   /**
   * Установка цвета фигуры
   * @method setColor
   * @param {Color} color Цвет
   */
    PRIMITIVES.Rectangular.prototype.setColor = function (color) {
        this.color = color;
    };

    /**
    * Получение цвета фигуры
    * @method getColor
    * @param {}
    * @return {strnig} color цвет фигуры
    */
    PRIMITIVES.Rectangular.prototype.getColor = function () {
        return this.color;
    };

   /**
   * Определяет, находится ли точка внутри фигуры
   * @method pointInObject
   * @param {int} x Координата x
   * @param {int} y Координата y
   * @return {boolean} True, если точка внутри фигуры, false - иначе
   */
    PRIMITIVES.Rectangular.prototype.pointInObject = function (x, y) {
        if (x < this.x) return false; // Может быть слева
        if (y < this.y) return false; // А с верху
        if (x > (this.x + this.width)) return false; // А может справа
        if (y > (this.y + this.heigth)) return false; // А вдруг снизу
        return true;  // Если за пределами нет, значит она внутри
    };
