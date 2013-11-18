// Write your code below...

document.write('<script src="js/Color.js"></script>');
document.write('<script src="js/logic_game.js"></script>');
document.write('<script src="js/Primitives.js"></script>');
document.write('<script src="js/game_field.js"></script>');


var GAME = GAME || {};

GAME.Game = {
    initialization : function() {
        this.canvasContext = this.getCanvasContext(305, 305);

        if (!this.canvasContext) {
            console.error('Ошибка получения контекста для рисования');
            return;
        };

        this.gameField = new GAMEFIELD.GameField(0, 0, 300, 300, this.canvasContext);
        this.gameField.draw();
        this.logicGame = new LOGICGAME.LogicGame();
        var pos = this.logicGame.start(false);
	    var cross = new PRIMITIVES.Cross(0, 0, 0, 0, this.canvasContext);
	    cross.color = COLORPAINT.ColorPaint.color.BLACK;
        this.gameField.setElementInCell(pos.x, pos.y, cross);
        this.canvasContext.canvas.onclick = this.onClick.bind(this);
    },

    onClick : function(event) {
	    var status = this.logicGame.status();
	    if (status != 0) {
		    this.gameField.clearField();
		    this.logicGame.start(false);
		    var pos = this.logicGame.start(false);
		    this.gameField.setElementInCell(pos.x, pos.y, new PRIMITIVES.Cross(0, 0, 0, 0, this.canvasContext));
		    return;
	    }

        var cursorPosition = this.getCursorPosition(event);
        if (this.gameField.isPointInside(cursorPosition.x, cursorPosition.y)) {
            var pos = this.gameField.getNumberCellByPoint(cursorPosition.x, cursorPosition.y);
	        if (this.logicGame.sellIsFullL(pos)) {
		        return;
	        }
            this.gameField.setElementInCellByPoint(cursorPosition.x, cursorPosition.y, new PRIMITIVES.Circle(0, 0, 0, 0, this.canvasContext));
            var nextPos = this.logicGame.move(pos);
            if (nextPos) {
                this.gameField.setElementInCell(nextPos.x, nextPos.y, new PRIMITIVES.Cross(0, 0, 0, 0, this.canvasContext));
            }
            var status = this.logicGame.status();
            if (status != 0) {
	            if (status != 3) {
		            this.gameField.drawWinLine(this.logicGame.getLineWin())
	            }
            }
        }
    },

    getCursorPosition : function (event) {
        var boundingClientRect = this.canvasContext.canvas.getBoundingClientRect();
        return {
            x: event.clientX - boundingClientRect.left * (this.canvasContext.canvas.width / boundingClientRect.width),
            y: event.clientY - boundingClientRect.top * (this.canvasContext.canvas.height / boundingClientRect.height)
        };
    },

    getCanvasContext : function(recommendedWidth, recommendedHeight) {
        var canvasElement = document.getElementById("playgroundCanvas");
        if (!canvasElement) {
            canvasElement = this.createCanvasInElement(document.getElementById("playground"), recommendedWidth, recommendedHeight);
        }
        if (canvasElement) {
            return canvasElement.getContext("2d")
        } else {
            console.error('Ошибка создания холста')
        }
    },

    createCanvasInElement : function(element, recommendedWidth, recommendedHeight) {
        if (element) {
            var canvasNode = document.createElement('canvas');
            canvasNode.id = "playgroundCanvas";
            canvasNode.height = recommendedHeight;
            canvasNode.width = recommendedWidth;
            playground.appendChild(canvasNode);
            return canvasNode;
        } else {
            console.error('Передан пустой параметр')
            return undefined;
        }
    }
};

window.onload = GAME.Game.initialization.bind(GAME.Game);
