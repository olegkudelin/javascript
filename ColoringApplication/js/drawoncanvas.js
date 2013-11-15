/**
* Модуль предоставляет холст и методы для рисования различных фигур
* Объект в виде литерала и не требует создания.
*
*/

var DRAWONCANVAS = DRAWONCANVAS || {};


/**
* Объект точка 
* @namespace DRAWONCANVAS
* @class Point
* @constructor 
* @param {int} x Координата x
* @param {int} y Координата y
*/
DRAWONCANVAS.Point = function (x, y) {
    this.x = x;
    this.y = y;
};


/**
* Объект холста 
* @namespace DRAWONCANVAS
* @class DrawOnCanvas
*/
DRAWONCANVAS.DrawOnCanvas = {
    aColor: undefined, // Текущий цвет
    canvas: undefined, // Сам объект Canvas
    canvasBackground: undefined, // Сам объект Canvas
    canvasTemporary: undefined, // Сам объект Canvas

    gDrawingContext: undefined,  // Контекст для тисования
    gDrawingContextBackground: undefined,  // Контекст для тисования
    gDrawingContextTemporary: undefined,  // Контекст для тисования
    arrayOfPoint: [],  // Массив последних точек для рисования кривой

    /**
    * Инициализация объекта
    * @method initialize
    * @param {Сanvas} canvas Холст для рисования
    * @param {int} heigth Высота
    * @param {int} width Ширина
    */
    initialize: function (canvasDraw, canvasBackground, width, heigth) {
        this.canvas = canvasDraw;
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("heigth", heigth);
        this.canvas.width = width;
        this.canvas.heigth = heigth;

	this.canvasBackground = canvasBackground;
        this.canvasBackground.setAttribute("width", width);
        this.canvasBackground.setAttribute("heigth", heigth);
        this.gDrawingContext = this.canvas.getContext("2d");

	this.gDrawingContextBackground = this.canvasBackground.getContext("2d");
    },

    /**
    * Установка текущего цвета для рисования
    * @method setColor
    * @param {string} color Цвет
    */
    setColor: function (color) {
        this.aColor = color;
    },

    /**
    * Получение текущего цвета для рисования
    * @method getColor
    * @return {string} Цвет
    */
    getColor: function () {
        return this.aColor;
    },

    /**
    * Рисование точки
    * @method drawPoint
    * @param {int} x Координата x
    * @param {int} y Координата y
    */
    drawPoint: function (x, y) {
        var RADIUS = 10; // Радиус точки
        drawCircle(x, y, this.RADIUS, true)
    },

    /**
    * Рисование круга
    * @method drawCircle
    * @param {int} x Координата x
    * @param {int} y Координата y
    * @param {int} radius Радиус круга
    * @param {boolean} haveBorder Отрисовка окружности другим цветом, true - если рисовать
    */
    drawCircle: function (x, y, radius, haveBorder) {
//      LOG.Log.out(x + "    " + y + "     " + radius);
        this.gDrawingContext.beginPath();  
        this.gDrawingContext.fillStyle = this.getColor(); // Установим цвет заливки
        this.gDrawingContext.arc(x, y, radius, 0, 2 * Math.PI, false); // Нарисуем окружность
        this.gDrawingContext.fill();  // Закрасим
        if (haveBorder) {  // Если надо, орисуем каемку
            if (this.getColor() === COLORPAINT.Color.WHITE) {
                this.gDrawingContext.beginPath();
                this.gDrawingContext.strokeStyle = COLORPAINT.Color.BLACK;
                this.gDrawingContext.arc(x, y, radius, 0, 2 * Math.PI, false);
                this.gDrawingContext.stroke();
            }
            if (this.getColor() === COLORPAINT.Color.BLACK) {
                this.gDrawingContext.beginPath();
                this.gDrawingContext.strokeStyle = COLORPAINT.Color.WHITE;
                this.gDrawingContext.arc(x, y, radius, 0, 2 * Math.PI, false);
                this.gDrawingContext.stroke();
            }
        }
        this.gDrawingContext.closePath();
    },

    /**
    * Рисование прямоугольника
    * @method drawRect
    * @param {int} x Координата x
    * @param {int} y Координата y
    * @param {int} heigth Высота
    * @param {int} width Ширина
    */
    drawRect: function (x, y, width, heigth)
    {
    	this.gDrawingContext.beginPath()
        this.gDrawingContext.fillStyle = this.getColor();
        this.gDrawingContext.strokeStyle = this.getColor();
        this.gDrawingContext.fillRect(x, y, width, heigth);
        this.gDrawingContext.fill();
        this.gDrawingContext.closePath();
    },

    /**
    * Рисование кривой Безье
    * Рисование производиться последовательным вызывом метода с передачей следующей точки.
    * Для завершения рисавания необходим вызов метода endDrawBezierCurve()ж
    * @method drawBezierCurveByPoint
    * @param {int} x Координата x
    * @param {int} y Координата y
    */
    drawBezierCurveByPoint: function (x, y) {
        if (this.arrayOfPoint.length === 0) { // Если массив пустой, то значит кривая не рисовалась и необходимо инициализировать рисование
            this.LINE_WIDTH = 10;  // Толщина линии
            this.gDrawingContext.lineWidth = this.LINE_WIDTH;
            this.gDrawingContext.beginPath();
            this.gDrawingContext.strokeStyle = this.getColor();
            this.gDrawingContext.moveTo(x, y);
        }
        var point = new DRAWONCANVAS.Point(x, y);
        var i = this.arrayOfPoint.push(point); 
        if (i > 2) {
            this.gDrawingContext.bezierCurveTo(this.arrayOfPoint[0].x, this.arrayOfPoint[0].y, this.arrayOfPoint[1].x, this.arrayOfPoint[1].y, this.arrayOfPoint[2].x, this.arrayOfPoint[2].y);
            this.gDrawingContext.stroke();
            this.arrayOfPoint[0] = this.arrayOfPoint[2]; // Очищаем массив с сохранением последней точки, которую переносим в начало массива, чтобы было потом к чему привязаться
            this.arrayOfPoint.length = 1;
        }
    },
    
    /**
    * Завершение рисования кривой
    * @method endDrawBezierCurve
    */
    endDrawBezierCurve: function () {
        this.arrayOfPoint.length = 0;
        this.gDrawingContext.closePath();
    },

    /**
    * Рисование рисунка, загруженного в Image
    * @method drawImage
    * @param {Image} backgroundImage Image с загруженным рисунком
    * @param {int} x Координата x
    * @param {int} y Координата y
    * @param {int} width Ширина
    * @param {int} heigth Высота+
    */
    drawImage: function (backgroundImage, x, y, width, heigth) {
        this.gDrawingContextBackground.drawImage(backgroundImage, x, y, width, heigth);
    },
 
    /**
    * Превод глобальных координат, полученных и событий в координаты Canvas
    * @method drawBezierCurveByPoint
    * @param {Event} event Событие мыши, в котором содертся координаты
    * @return {DRAWONCANVAS.Point} Координаты
    */
    getCursorPosition: function (event) {
	var x = event.clientX;
	var y = event.clientY;
	var node = event.target;
	while (node) {
		x -= node.offsetLeft - node.scrollLeft;
		y -= node.offsetTop - node.scrollTop;
		node = node.offsetParent;
	}
        DRAWONCANVAS.Point.x = x;
        DRAWONCANVAS.Point.y = y;
        return DRAWONCANVAS.Point;
    },

    getPositionInArray : function(x, y) {
        return (( x ) + ( y )*this.canvas.getAttribute('width'))*4;
    },

    fillObject: function (x, y, borderLeft, borderTop, borderRigth, borderBottom) {
        
        var image = this.gDrawingContext.getImageData( 0, 0, this.canvas.getAttribute("width"), this.canvas.getAttribute("heigth"));
        var imageBackgraundData = this.gDrawingContextBackground.getImageData( 0, 0, this.canvasBackground.getAttribute("width"), this.canvasBackground.getAttribute("heigth")).data;
        var imageData = image.data;


        var stackArrayX = [];
        var stackArrayY = [];

        var tecColor = this.getColor();
        var c1 = parseInt(tecColor.substring(1,3), 16);
        var c2 = parseInt(tecColor.substring(3,5), 16);
        var c3 = parseInt(tecColor.substring(5,7), 16);
        var c4 = 0xff;

        var posInArrayImage = 0;

        var fillColor = "#" + imageData[posInArrayImage].toString(16) + imageData[posInArrayImage + 1].toString(16) + imageData[posInArrayImage + 2].toString(16);

        var f1 = 0x0;
        var f2 = 0x0;
        var f3 = 0x0;
        var f4 = 0xff;

        stackArrayX.push(x);
        stackArrayY.push(y);

        while (stackArrayX.length > 0) {
            x = stackArrayX.pop();
            y = stackArrayY.pop();
            posInArrayImage = this.getPositionInArray(x,y);

            if (((imageBackgraundData[posInArrayImage] != f1)||(imageBackgraundData[posInArrayImage + 1] != f2)||(imageBackgraundData[posInArrayImage + 2] != f3)||(imageBackgraundData[posInArrayImage + 3] != f4))&&((imageData[posInArrayImage] != c1)||(imageData[posInArrayImage + 1] != c2)||(imageData[posInArrayImage + 2] != c3)||(imageData[posInArrayImage + 3] != c4))) {
                imageData[posInArrayImage] = c1;
                imageData[posInArrayImage + 1] = c2;
                imageData[posInArrayImage + 2] = c3;
                imageData[posInArrayImage + 3] = 0xff;
		if (x < borderRigth)	{
	                stackArrayX.push(x + 1);
        	        stackArrayY.push(y);
		}
		if (x > borderLeft)	{
	                stackArrayX.push(x - 1);
	                stackArrayY.push(y);
		}
		if (y < borderBottom)	{
	                stackArrayX.push(x);
        	        stackArrayY.push(y + 1);
		}
		if (y > borderTop)	{
			stackArrayX.push(x);
	                stackArrayY.push(y - 1);
		}
            }
        }

        this.gDrawingContext.putImageData(image, 0, 0);
    },

    fillArray: function (x, y, replaceColor) {
        var tecColor = this.getColor().substring(1);
        var imageDateOfCurrentPoint = this.gDrawingContext.getImageData(x, y, 1, 1);
        imageDateOfCurrentPoint.data[0] = parseInt(tecColor.substring(0,2), 16);
        imageDateOfCurrentPoint.data[1] = parseInt(tecColor.substring(2,4), 16);
        imageDateOfCurrentPoint.data[2] = parseInt(tecColor.substring(4,6), 16);
        this.gDrawingContext.putImageData(imageDateOfCurrentPoint, x, y);
        var data = this.gDrawingContext.getImageData(x - 1, y - 1, 3, 3).data;
        for (var i = 0; i < 9; i++) {
            if (i === 5) continue;
            s = data[i*3].toString(16) + data[i*3 + 1].toString(16) + data[i*3 + 2].toString(16);
            if (s === replaceColor.substring(1)) {
                 this.fillArray(((x-1)+(i%3)), ((y-1)+Math.floor(i/3)), replaceColor);
            }
        }
    }
};
