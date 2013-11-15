/**
* Формирование логов
*
* @module Log
*
*/      

var LOG = LOG || {};

/**
* Объект формирования и вывода сообщений
* @namespace LOG
* @class Log
*/

LOG.Log = {
/**
* Выводит сообщение на страницу
* @method out
* @param {string} message екст сообщения
* @return {} 
*/
    out: function (message) {
        var outTag = document.getElementById("log");
        if (!outTag) {
            outTag = document.createElement("div");
            outTag.id = "log";
            outTag.className = "log";
            document.body.appendChild(outTag);
        }
        var textNode = document.createTextNode(message);
        outTag.appendChild(textNode);
        outTag.appendChild(document.createElement("br"));
    }
};

