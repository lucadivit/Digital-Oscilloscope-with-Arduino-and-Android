/**
 * Created by Luca on 16/03/2016.
 */

    var Coordinate = (function(){
        var pair = {
            x: null,
            y: null
        };
        return {
            setX: function(coordinateX){
                pair.x = coordinateX;
            },
            setY: function(coordinateY){
                pair.y = coordinateY;
            },
            getX: function(){
                return pair.x;
            },
            getY: function(){
                return pair.y;
            },
            setCoordinate: function(coordinateX,coordinateY){
                pair.x = coordinateX;
                pair.y = coordinateY;
            },
            getCoordinate: function(){
                return pair;
            }
        }
    }());