/**
 * Created by kudelin on 14.11.13.
 */

var LOGICGAME = LOGICGAME || {};

LOGICGAME.LogicGame = function () {
    this.arraOfField = [0,0,0,0,0,0,0,0,0];
};

LOGICGAME.LogicGame.prototype = {

    start: function(isUserBegin) {
        this.arraOfField[0] = 0;
        this.arraOfField[1] = 0;
        this.arraOfField[2] = 0;
        this.arraOfField[3] = 0;
        this.arraOfField[4] = 0;
        this.arraOfField[5] = 0;
        this.arraOfField[6] = 0;
        this.arraOfField[7] = 0;
        this.arraOfField[8] = 0;
        if (!isUserBegin) {
            var pos = (Math.round(Math.random()) == 0) ? 5 : 4;
            this.arraOfField[pos - 1] = 2;
            return this.getPositionInTable(pos);
        }
    },

    /**
     * Делает ход
     * @param position позиция в координатах таблицы
     * @return ход компьютера или null если игра окончена
     */

    move: function(position) {
//        console.log(this.arraOfField);
        var curPos = this.getPositionInArray(position);
        this.arraOfField[curPos - 1] = 1;
        if ((this.checkWinState(this.arraOfField))||(this.arrayIsFull(this.arraOfField))) {
            return undefined;
        } else {
            var pos = this.getNextStep(new Array().concat(this.arraOfField));
            this.arraOfField[pos - 1] = 2;
            return this.getPositionInTable(pos);

        }
//        console.log(this.arraOfField);
    },

    /**
    *  Текущий статус игры
    *  @return
    *    0  не определен, игра продолжается
    *    1  выиграл человек
    *    2  выиграл компьютер
    *    3  ничья
    */

    status: function() { // 1 -
        if (this.checkWinState(this.arraOfField)) {
            var posInArray = this.winPosInArray(this.arraOfField);
            if (posInArray) {
                return this.arraOfField[posInArray[0]];
            } else {
                return undefined;
            }
        } else  if (this.arrayIsFull(this.arraOfField)) {
            return 3;
        } else {
            return 0;
        }
    },

    /**
    *  Возвращает выигрышную строку
    *
    */
    getLineWin: function() {
	    return this.lineWin(this.arraOfField);
    },


    lineWin: function(arrayOfField) {
        var posInArray = this.winPosInArray(arrayOfField);
        if (posInArray) {
            return this.getWinStruct(posInArray[0], posInArray[1], posInArray[2]);
        }
        return undefined;
    },

	sellIsFullL: function(posInTable) {
		return (this.arraOfField[this.getPositionInArray(posInTable) - 1] != 0);

	},

    winPosInArray: function(arrayOfField) {
        if (this.isLineWin(0,4,8, arrayOfField)) return new Array(0,4,8);
        if (this.isLineWin(2,4,6, arrayOfField)) return new Array(2,4,6);
        if (this.isLineWin(3,4,5, arrayOfField)) return new Array(3,4,5);
        if (this.isLineWin(1,4,7, arrayOfField)) return new Array(1,4,7);
        if (this.isLineWin(6,7,8, arrayOfField)) return new Array(6,7,8);
        if (this.isLineWin(0,3,6, arrayOfField)) return new Array(0,3,6);
        if (this.isLineWin(2,5,8, arrayOfField)) return new Array(2,5,8);
        if (this.isLineWin(0,1,2, arrayOfField)) return new Array(0,1,2);
        return undefined;
    },

    checkWinState: function(arrayOfField) {
        return (!!this.lineWin(arrayOfField));
    },

    isLineWin: function(pos1, pos2, pos3, arrayOfField) {
        return ((arrayOfField[pos1] == arrayOfField[pos2])&&(arrayOfField[pos1] == arrayOfField[pos3])&&(arrayOfField[pos1] != 0));
    },

    arrayIsFull: function(arrayOfField) {
        for (var i = 0; i < arrayOfField.length; i++) {
            if (arrayOfField[i] == 0) {
                return false;
            }
        }
        return true;
    },

    getWinStruct: function(pos1, pos2, pos3) {
        return {
            cell1 : this.getPositionInTable(pos1 + 1),
	        cell2 : this.getPositionInTable(pos2 + 1),
	        cell3 : this.getPositionInTable(pos3 + 1)
        }
    },

// от 1 до 9
    getPositionInTable: function(posInArray) {
        var x = posInArray % 3;
        if (x == 0) {
            x = 3;
        }
        return {
            y: Math.round((posInArray+1)/3),
            x: x
        }
    },

    getPositionInArray: function(posInTable) {
        var x = posInTable.x;
        var y = (posInTable.y - 1) * 3;
        return y + x;
    },

    getNextStep: function(arrayCurrentPos) {
        var estimationArray = new Array( 0, 0, 0, 0, 0, 0, 0, 0, 0);
        for (var i=0; i < estimationArray.length; i++) {
            if (arrayCurrentPos[i] == 0) {
                estimationArray[i] = this.getEstimateStep(new Array().concat(arrayCurrentPos),i,2, 100);
            } else {
                estimationArray[i] = 0;
            }
        }
	    var estimationArrayCopy = new Array().concat(estimationArray);
	    estimationArray.sort(function(a,b) {
		                        return b - a;
	                        });
        if (estimationArray[0] == 0) {
	        return arrayCurrentPos.indexOf(0) + 1;
	    } else {
            return estimationArrayCopy.indexOf(estimationArray[0]) + 1;
	    }
    },

//Здесь NextStep(pos:position;i,fig,wlo:byte):byte - рекурсивная функция, позволяющая для данной позиции pos оценить рейтинг хода на клетку i фигурой fig при глубине данного хода wlo (в полуходах). Она имеет вид:

    getEstimateStep: function(arrayCurrentPos, numericCell, currentFigure, vlog){
        arrayCurrentPos[numericCell] = currentFigure;
        if (this.checkWinState(arrayCurrentPos)) {
            if (currentFigure == 2) {
                return 1*vlog;
            } else {
                return -1*vlog;
            }
        }
        if (currentFigure == 1) {
            currentFigure = 2;
        } else {
            currentFigure = 1;
        }
        var result = 0;
        for (var i = 0; i < arrayCurrentPos.length; i++) {
            if (arrayCurrentPos[i] == 0) {
                result = result + this.getEstimateStep(new Array().concat(arrayCurrentPos), i, currentFigure, vlog/2);
            }
        }
        return result;
    }
};