/**
*
* Приложение, реализующее некоторые функции раскрасски
* (работает только если поддерживается элемент <canvas>)
* 
* Для подключения скрипта к html странице, необходимо: 
* 1. Добавить в html документ ссылку на файл
*    <script src="js/paint.js"></script>
* 2. Добавить тег canvas на страницу с индентификатором id="figure" (<canvas id="figure"/>) и определить размер
* 3. Вызвать функцию PAINT.Paint.initialize(), после загрузки страницы
*
* При вызове функции PAINT.Paint.initialize() происходит инициализация объекта для рисования DRAWONCANVAS.DrawOnCanvas.
* Потом происходит создание на холсте двух областей: 
* - области палитры PAINT.Palette, которая отвечает за выбор цвета
* - области рисования PAINT.Image, которая отвечает за раскрашиваемый рисунок и его расскрашивание
* Далее инициализации происходит установка обработчиков событий и инициализация объектов завершается
* @module Paint
*
*/

document.write("<script src=\"js/log.js\"></script>"); // модуль вывода логов
document.write("<script src=\"js/drawoncanvas.js\"></script>"); // модуль отрисовки на холсте
document.write("<script src=\"js/primitives.js\"></script>"); // объекты геометрических примитивов
document.write("<script src=\"js/colorpaint.js\"></script>"); // цвета

var PAINT = PAINT || {};


/**
* Объект Палитра
* Выстраивается в один ряд
* Предоставляет возможность выбора цвета для рисования.
* Состоит из разноцветных кружков. Выстраивается в один ряд по горизонтли или вертикали в зависимости от переданной области
* Для создания необходимо вызвать метод setPatette(x, y, width, heigth) и передать геометрические размеры
* Потом в обработчике событий вызывать onMouseClick(event)
* В зависимости от того, какая сторона длиньше, будет горизонтальная или вертикальная
* @namespace PAINT
* @class PAINT.Palette
*/
PAINT.Palette = {
    
    arrayOfElement: [],   // содержит ячейки палитры в виде массива объктов Circle, 
    arrayOfElementPalleteRectangle: [], // ячейки для смешивания цветов  
    colorArray: function () {
        return [COLORPAINT.Color.BLACK, COLORPAINT.Color.RED, COLORPAINT.Color.ORANGE, COLORPAINT.Color.YELLOW, COLORPAINT.Color.GREEN, COLORPAINT.Color.BLUE, COLORPAINT.Color.WHITE];
    }, 
    rectanglePalette: undefined, // Геометрические размеры палитры и ее положение PRIMITIVES.Rectangular
    
   /**
   * Создание палитры в заданном прямоугольнике
   * @method setPatette                                                                          
   * @param {int} x Верхняя левая точка x
   * @param {int} y Верхняя левая точка y
   * @param {int} width Ширина
   * @param {int} heigth Высота                                                                
   */
    setPatette: function (x, y, width, heigth) {
        this.rectanglePalette = new PRIMITIVES.Rectangular(x, y, width, heigth);
        var lengthOfPalette = ((width > heigth) ? width : heigth); // зависит от ориентации. Берется самая длинная сторона
        var widthOfPalette = ((width < heigth) ? width : heigth);
        var SEPARATION_LENGTH = 0.5 // Число процентов для разделителей
        var separation = (lengthOfPalette * SEPARATION_LENGTH / 100); // Расстояние между ячейками краски в процентах от общей длинны

        var radius = (lengthOfPalette / this.colorArray().length - separation) / 2; // Радиус ячейки краски
        if ((radius * 2) > widthOfPalette / 2) {                 // Если диаметр больше ширины, его надо уменьшить
            radius = (widthOfPalette / 2 - 1) / 2;
        }
        if (width > heigth) {
            this.createElementOfPallete(x + separation / 2, y + widthOfPalette / 4 - separation, radius, separation, true); // горизонтальное размещение
            this.createElementOfPalleteRectangle(x + separation, y + separation + widthOfPalette / 2, radius * 3, widthOfPalette / 2, separation, true);
        } else {
            this.createElementOfPallete(x + widthOfPalette / 4 - separation, y + separation / 2, radius, separation, false); // вертикальное размещение
            this.createElementOfPalleteRectangle(x + widthOfPalette / 2, y + separation, widthOfPalette / 2 - separation * 2, radius * 3, separation, false);
        }
    },


   /**
   * Создание элементов палитры с одновременной отрисовкой. 
   * Предполагается, что палитра располагается горизонтально                                              ***************************
   * @method setElementOfPallete                                                                          *
   * @param {int} x Крайняя точка на длинной стороне палитры, учитывающая отступ от края                  * Х
   * @param {int} y Точка на середине короткой стороны палитры по вертикали                               *
   * @param {int} radius Радиус ячейки                                                                    ***************************
   * @param {int} separation Расстояние между ячейками                                                    
   * @param {boolean} orientationIsHorizontal Ориентация true - горизонтальная, false - вертикальная                                                    
   */
    createElementOfPallete: function (x, y, radius, separation, orientation) {
        var getAdditiveX = 0, getAdditiveY = 0;  // Функции добавляющие прибавку для следующего элемента
        if (orientation) {                       // если горизонтальное размещение - добавка к Х, Y остается постоянным
            getAdditiveX = function () { return (radius + (radius + separation) * i * 2); };
            getAdditiveY = function () { return 0; }
        } else {                                 // если вертикальное размещение - добавка к Y, X остается постоянным
            getAdditiveX = function () { return 0; }
            getAdditiveY = function () { return (radius + (radius + separation) * i * 2); };
        }
        for (var i = 0, max = this.colorArray().length; i < max; i++) {
            var circle = new PRIMITIVES.Circle(x + getAdditiveX(), y + getAdditiveY(), radius);
            circle.setColor(this.colorArray()[i]);
            this.arrayOfElement.push(circle);
            DRAWONCANVAS.DrawOnCanvas.setColor(circle.getColor());
            DRAWONCANVAS.DrawOnCanvas.drawCircle(x + getAdditiveX(), y + getAdditiveY(), radius, true);
        }
    },


    createElementOfPalleteRectangle: function (x, y, width, heigth, separation, orientation) {
        var getAdditiveX = 0, getAdditiveY = 0; 
        if (orientation) {
            getAdditiveX = function () { return ((width + separation) * i); };
            getAdditiveY = function () { return 0; }
        } else { 
            getAdditiveX = function () { return 0; }
            getAdditiveY = function () { return ((heigth + separation) * i); };
        }
        for (var i = 0, max = Math.floor(this.colorArray().length / 2); i < max; i++) {
            var rectangule = new PRIMITIVES.Rectangular(x + getAdditiveX(), y + getAdditiveY(), width, heigth);
            rectangule.setColor(COLORPAINT.Color.ORANGE);
            this.arrayOfElementPalleteRectangle.push(rectangule);
            DRAWONCANVAS.DrawOnCanvas.setColor(rectangule.getColor());
            DRAWONCANVAS.DrawOnCanvas.drawRect(rectangule.x, rectangule.y, rectangule.width, rectangule.heigth);
        }
    },


   /**
   * Обработчик события на щелчок мыши. 
   * Проверяет, попадает ли точка на какой нибудь элемент палитры. При его нахождении устанавливает выбранный цвет как основной
   * @method onMouseClick
   * @param {Event} event Экземпляр события
   */   
    onMouseClick: function (event)
    {
        var cursorPosition = DRAWONCANVAS.DrawOnCanvas.getCursorPosition(event);

	LOG.Log.out(cursorPosition.x + "          " + cursorPosition.y );

        if (!this.rectanglePalette.pointInObject(cursorPosition.x, cursorPosition.y)) return;
        for (var i = 0, max = this.arrayOfElement.length; i < max; i++) {
            if (this.arrayOfElement[i].pointInObject(cursorPosition.x, cursorPosition.y)) {
                DRAWONCANVAS.DrawOnCanvas.setColor(this.arrayOfElement[i].getColor());
            }
        }
        for (var i = 0, max = this.arrayOfElementPalleteRectangle.length; i < max; i++) {
            if (this.arrayOfElementPalleteRectangle[i].pointInObject(cursorPosition.x, cursorPosition.y)) {
		DRAWONCANVAS.DrawOnCanvas.drawRect(this.arrayOfElementPalleteRectangle[i].x, this.arrayOfElementPalleteRectangle[i].y, this.arrayOfElementPalleteRectangle[i].width, this.arrayOfElementPalleteRectangle[i].heigth);
            }
        }
    }
}

/**
* Объект Рисунок
* Содержит рисунок для раскашивания
* Для загрузки изображения вызвать метод loadImage(fileName, x, y, width, heigth) и передать геометрические размеры
* Потом gдцепить обработчики событий
* @namespace PAINT
* @class PAINT.Image
*/
PAINT.Image = {

    isMouseDown: false,
    fileName: "",   // Имя файла 

    rectangleImage: undefined, // Геометрические размеры рисунка и его положение PRIMITIVES.Rectangular

    backgroundImage: undefined, // Изображение Image


   /**
   * Загрузка рисунка в заданном прямоугольнике
   * @method loadImage                                                                          
   * @param {string} fileName Имя файла, содержащего рисунок                                                                
   * @param {int} x Верхняя левая точка x
   * @param {int} y Верхняя левая точка y
   * @param {int} width Ширина
   * @param {int} heigth Высота
   */
    loadImage: function (fileName, x, y, width, heigth) {
        this.fileName = fileName;
        this.rectangleImage = new PRIMITIVES.Rectangular(x, y, width, heigth); // Создание области для хранения геометрических размеров
        this.backgroundImage = new Image();
         this.backgroundImage.onload = this.load.bind(PAINT.Image); 
         this.backgroundImage.src = fileName;
  },
    
    load: function () {
        DRAWONCANVAS.DrawOnCanvas.drawImage(this.backgroundImage, this.rectangleImage.x, this.rectangleImage.y, this.rectangleImage.width, this.rectangleImage.heigth); // Отрисовка
    },

    setImage: function (fileName) {
    },

    /**
    * Обработчик события нажатия клавиши мыши
    * @method onMouseDown                                                                          
    * @param {Еvent} event Экземпляр события
    */
    onMouseDown: function (event) {
        var cursorPosition = DRAWONCANVAS.DrawOnCanvas.getCursorPosition(event); // получение координат в области канвы
        if (!this.rectangleImage.pointInObject(cursorPosition.x, cursorPosition.y)) return;  // Если позиция не наша, то выход
        this.isMouseDown = true;
    },

    /**
    * Обработчик события отпускания клавиши мыши
    * @method onMouseUp                                                                          
    * @param {Еvent} event Экземпляр события
    */
    onMouseUp: function (event) {
        if (this.isMouseDown) DRAWONCANVAS.DrawOnCanvas.endDrawBezierCurve();
        this.isMouseDown = false;
    },

    /**
    * Обработчик события движение мыши
    * @method onMouseMove                                                                          
    * @param {Еvent} event Экземпляр события
    */
    onMouseMove: function (event) {
        if (this.isMouseDown) {
            var cursorPosition = DRAWONCANVAS.DrawOnCanvas.getCursorPosition(event); // получение координат в области канвы
            if (!this.rectangleImage.pointInObject(cursorPosition.x, cursorPosition.y)) return;  // Если позиция не наша, то выход
            DRAWONCANVAS.DrawOnCanvas.drawBezierCurveByPoint(cursorPosition.x, cursorPosition.y);
        }
    },

    /**
    * Обработчик события выхода мыши за пределы объекта
    * @method onMouseOut                                                                          
    * @param {Еvent} event Экземпляр события
    */
    onMouseOut: function (event) {
        if (this.isMouseDown) DRAWONCANVAS.DrawOnCanvas.endDrawBezierCurve();
        this.isMouseDown = false;
    },

    /**
    * Обработчик события нажатия мыши
    * @method onMouseClick                                                                          
    * @param {Еvent} event Экземпляр события
    */
    onMouseClick: function (event) {
        var cursorPosition = DRAWONCANVAS.DrawOnCanvas.getCursorPosition(event); // получение координат в области канвы
        if (!this.rectangleImage.pointInObject(cursorPosition.x, cursorPosition.y)) return;  // Если позиция не наша, то выход
        DRAWONCANVAS.DrawOnCanvas.fillObject(cursorPosition.x, cursorPosition.y, this.rectangleImage.x, this.rectangleImage.y, this.rectangleImage.x + this.rectangleImage.width, this.rectangleImage.y + this.rectangleImage.heigth);
    }
}


/**
* Объект Раскрасска
* Главный объект программы, определяет области для палитры и рисунка, подсоединяет собылия к обработчикам
* Основной метод initialize() без параметров - точка входа в программу
* @namespace PAINT
* @class PAINT.Paint
*/
PAINT.Paint = {
    initialize: function () {
        this.log = LOG.Log;
        if (document.getElementById("figure")) {
            this.canvas = DRAWONCANVAS.DrawOnCanvas;
            var background = document.getElementById("background");
            this.canvas.initialize(document.getElementById("figure"), background, 1200, 800);
            PAINT.Palette.setPatette(10, 10, 200, 600);
          	PAINT.Image.loadImage("images/ris1.png", 220, 60, 800, 600);
            	// Подключение событий
           	background.onclick = this.onClick;
           	background.onmousedown = this.onMouseDown; 
           	background.onmouseup = this.onMouseUp;
           	background.onmousemove = this.onMouseMove;
           	background.onmouseout = this.onMouseOut;
        } else {
            this.log.out("В документе отсутствует тег figure");
        }
    },

    onClick: function (event) {
        PAINT.Palette.onMouseClick.apply(PAINT.Palette, [event]);
        PAINT.Image.onMouseClick.apply(PAINT.Image, [event]);
    },

    onMouseDown: function (event) {
        PAINT.Image.onMouseDown.apply(PAINT.Image, [event]);
    },

    onMouseUp: function (event) {
        PAINT.Image.onMouseUp.apply(PAINT.Image, [event]);
    },

    onMouseMove: function (event) {
        PAINT.Image.onMouseMove.apply(PAINT.Image, [event]);
    },

    onMouseOut: function (event) {
        PAINT.Image.onMouseOut.apply(PAINT.Image, [event]);
    }
};
