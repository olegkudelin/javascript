/**
 * Created by kudelin on 13.11.13.
 */

var GAMEFIELD = GAMEFIELD || {};

GAMEFIELD.GameField = function(x, y, width, heigth, context) {
    PRIMITIVES.Rectangular.apply(this, arguments);
    this.NUMBER_SELL = 3;
};

GAMEFIELD.GameField.prototype = Object.create(PRIMITIVES.Rectangular.prototype);
GAMEFIELD.GameField.prototype.constructor = GAMEFIELD.GameField;

GAMEFIELD.GameField.prototype.setElementInCellByPoint = function(x, y, element) {
    var sell = this.getNumberCellByPoint(x,y);
    this.setElementInCell(sell.x, sell.y, element);
};

GAMEFIELD.GameField.prototype.setElementInCell = function(cellX, cellY, element) {
    var offset = this.width/this.NUMBER_SELL * 0.10;
    element.x = this.width/this.NUMBER_SELL * (cellX - 1) + offset;
    element.y = this.height/this.NUMBER_SELL * (cellY - 1) + offset;
    element.width = this.width/this.NUMBER_SELL - offset * 2;
    element.height = this.height/this.NUMBER_SELL - offset * 2;
    element.color = COLORPAINT.ColorPaint.color.BLACK;
    element.draw();
};

GAMEFIELD.GameField.prototype.draw = function() {
    this.context.strokeStyle = COLORPAINT.ColorPaint.color.BLACK; // Установим цвет каемки
    this.context.lineWidth = 0.5;
    var parallax = 0.5;
    for (var i = 0; i <= this.NUMBER_SELL; i++) {
        this.context.moveTo((this.width/this.NUMBER_SELL).toFixed(0) * i + parallax, this.y + parallax);
        this.context.lineTo((this.width/this.NUMBER_SELL).toFixed(0) * i + parallax, this.height + parallax);
        this.context.moveTo(this.x  + parallax, (this.height/this.NUMBER_SELL).toFixed(0) * i + parallax);
        this.context.lineTo(this.width  + parallax, (this.height/this.NUMBER_SELL).toFixed(0) * i + parallax);
    }
    this.context.stroke();
};

GAMEFIELD.GameField.prototype.clearField = function() {
	this.context.beginPath();
	this.context.clearRect(this.x, this.y, this.width, this.height);
	this.context.beginPath();
	this.draw();
};

GAMEFIELD.GameField.prototype.getNumberCellByPoint = function(x, y) {
    return {
        x: Math.ceil(x / (this.width/this.NUMBER_SELL)),
        y: Math.ceil(y / (this.height/this.NUMBER_SELL))
    }
};

GAMEFIELD.GameField.prototype.drawWinLine = function(cellsArray) {
	this.context.beginPath();
	this.context.strokeStyle = COLORPAINT.ColorPaint.color.RED;
	this.context.lineWidth = 4;
	if (cellsArray.cell1.x == cellsArray.cell3.x) {
		this.context.moveTo(this.width/this.NUMBER_SELL * cellsArray.cell1.x - this.width/this.NUMBER_SELL/2, 0);
		this.context.lineTo(this.width/this.NUMBER_SELL * cellsArray.cell1.x - this.width/this.NUMBER_SELL/2, this.height);
	} else if (cellsArray.cell1.y == cellsArray.cell3.y) {
		this.context.moveTo(0, this.height/this.NUMBER_SELL * cellsArray.cell1.y - this.height/this.NUMBER_SELL/2);
		this.context.lineTo(this.width, this.height/this.NUMBER_SELL * cellsArray.cell1.y - this.height/this.NUMBER_SELL/2);
	} else {
		if (cellsArray.cell1.x == cellsArray.cell1.y) {
			this.context.moveTo(0,0);
			this.context.lineTo(this.width, this.height);

		} else {
			this.context.moveTo(this.width, 0);
			this.context.lineTo(0,this.height);
		}
	}
	this.context.stroke();
	this.context.closePath();
};

