/**
 * Created by kudelin on 01.10.13.
 */

var COLORPAINT = COLORPAINT || {};

COLORPAINT.Colors = {
    BLACK: '#000000',
    RED: '#ff0000',
    ORANGE: '#ffa500',
    YELLOW: '#ffff00',
    GREEN: '#008000',
    BLUE: '#0000ff',
    WHITE: '#ffffff'
};

COLORPAINT.ColorPaint = {
    getColorString : function (value) {
        value = value.toFixed(0);
        if (value > 255) {
            value = 255;
        } else if (value < 0) {
            value = 0;
        }
        var sub = "00" + value.toString(16);
        return sub.substr(sub.length - 2, 2);
    },

    color : COLORPAINT.Colors,
    blendColor : function (color1, color2) {


        var c1 =  parseInt(color1.substring(1,3), 16);
        var c2 =  parseInt(color1.substring(3,5), 16);
        var c3 =  parseInt(color1.substring(5,7), 16);

        var b1 =  parseInt(color2.substring(1,3), 16);
        var b2 =  parseInt(color2.substring(3,5), 16);
        var b3 =  parseInt(color2.substring(5,7), 16);


        var m1 = (c1 + b1);
        var m2 = (c2 + b2);
        var m3 = (c3 + b3);
//        console.log("#" + this.getColorString(m1) + this.getColorString(m2) + this.getColorString(m3));
        return "#" + this.getColorString(m1) + this.getColorString(m2) + this.getColorString(m3);
    },
    mixer: function(color1, color2, value) {
        var bLimit = function (byte){
            if (byte < 0) {
                return 0;
            }
            if (byte > 255) {
                return 255;
            }
            return byte;
        };

        var d = value / 200;

        var c1 =  parseInt(color1.substring(1,3), 16);
        var c2 =  parseInt(color1.substring(3,5), 16);
        var c3 =  parseInt(color1.substring(5,7), 16);

        var DR = c1 * (1.275 - d);
        var DG = c2 * (1.275 - d);
        var DB = c3 * (1.275 - d);

        var b1 =  parseInt(color2.substring(1,3), 16);
        var b2 =  parseInt(color2.substring(3,5), 16);
        var b3 =  parseInt(color2.substring(5,7), 16);


        var m3 = b3 * d + DB;
        var m2 = b2 * d + DG;
        var m1 = b1 * d + DR;
        return "#" + this.getColorString(m1) + this.getColorString(m2) + this.getColorString(m3);
    }

};
