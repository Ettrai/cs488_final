var data; // a global
var deadzone = 0.2;
var max = 8;
var walk_intensity;
var tilt_intensity;
var deviceControllerActivated;

setInterval(function(){
    d3.json("http://" + controls.IP + ":8080/", function(error, json) {
        if(deviceControllerActivated) {
            if (error) return console.warn(error);
            data = json.Values;

            computeDirection(data);

        }
    }); }, 10);

computeDirection = function(data){

    var x = clamp(data.x_value, -max , max);
    var y = clamp(data.y_value, -max , max);
    var z = clamp(data.z_value, -max , max);

    walk_intensity = z/max * 3;
    tilt_intensity = x/max * 3;

    var weightEvent = new CustomEvent( 'weight-animation', getAnimationData() );
    window.dispatchEvent(weightEvent);


};

between = function(data, min, max) {
    return data >= min && data <= max;
};

var clamp = function(num, min, max) {
    return num < min ? min : (num > max ? max : num);
};

var getAnimationData = function() {
    var controlValues = {
        Left: 0,
        Right: 0,
        Forward: 0,
        Backward: 0
    };

    if (walk_intensity > 0.1) {
        controlValues["Forward"] = walk_intensity;
        controls["Speed"] = 1 + walk_intensity;
    }
    else if (walk_intensity < -0.1) {
        controlValues["Backward"] = -walk_intensity;
        controls["Speed"] = 1 - walk_intensity;
    }

    if (tilt_intensity > 0.1) {
        controlValues["Left"] = tilt_intensity;


    }
    else if (tilt_intensity < -0.1) {
        controlValues["Right"] = -tilt_intensity;
    }


    return {

        detail: {

            anims: ["Left", "Right", "Walk", "Inverse_Walk"],

            weights: [controlValues['Left'], controlValues['Right'], controlValues['Forward'], controlValues['Backward']]

        }


    };
}