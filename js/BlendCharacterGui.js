/**
 * @author Michael Guerrero / http://realitymeltdown.com
 */
var deviceControllerActivated;
var controls;

function BlendCharacterGui(animations) {

	controls = {

		gui: null,
		"Lock Camera": false,
		"Show Model": true,
		"Show Skeleton": false,
		"Speed": 1.0,
		"Device Controller": false,
		//"Step Size": 0.016,
		//"Crossfade Time": 3.5,
		"Left": 1.0,
		"Right": 1.0,
		"Forward": 3.0,
		"Backward": 1.0,
		"IP": '10.151.213.150'

	};

	var animations = animations;

	this.showModel = function() {

		return controls['Show Model'];

	};

	this.showSkeleton = function() {

		return controls['Show Skeleton'];

	};

	this.getTimeScale = function() {

		return controls['Speed'];

	};

	this.update = function() {

		controls[ 'Left'] = animations[ 'Left' ].weight;
		controls[ 'Right'] = animations[ 'Right' ].weight;

		controls[ 'Forward'] = animations[ 'Walk' ].weight;
		controls[ 'Backward'] = animations[ 'Inverse_Walk' ].weight;


	};

	var init = function() {

		controls.gui = new dat.GUI();

		var settings = controls.gui.addFolder( 'Settings' );
		var playback = controls.gui.addFolder( 'Playback' );
		var blending = controls.gui.addFolder( 'Blend Tuning' );

		settings.add( controls, "Lock Camera" ).onChange( controls.lockCameraChanged );
		settings.add( controls, "Show Model" ).onChange( controls.showModelChanged );
		settings.add( controls, "IP");
		settings.add( controls, "Device Controller" ).onChange( deviceControllerChanged );



		// These controls execute functions
		playback.add( controls, "start" );
		playback.add( controls, "pause" );
		playback.add( controls, "step" );
		//playback.add( controls, "idle to walk" );
		//playback.add( controls, "walk to run" );
		//playback.add( controls, "warp walk to run" );

		blending.add( controls, "Left", 0, 3, 0.001).listen().onChange( function() {
			controls.weight("left")
		} );
		blending.add( controls, "Right", 0, 3, 0.001).listen().onChange( function() {
			controls.weight("right")
		} );
		blending.add( controls, "Forward", 0, 3, 0.01).listen().onChange( function() {
			controls.weight("forward")
		} );
		blending.add( controls, "Backward", 0, 3, 0.01).listen().onChange( function() {
			controls.weight("backward")
		} );
		blending.add( controls, "Speed", 0, 4, 0.01 );

		settings.open();
		playback.open();
		blending.open();

	};

	var getAnimationData = function() {

		return {

			detail: {

				anims: [ "Left", "Right", "Walk", "Inverse_Walk"],

				weights: [ controls['Left'], controls['Right'], controls['Forward'], controls['Backward']]

			}


		};
	};

	controls.start = function() {

		var startEvent = new CustomEvent( 'start-animation', getAnimationData() );
		window.dispatchEvent(startEvent);

	};

	controls.stop = function() {

		var stopEvent = new CustomEvent( 'stop-animation' );
		window.dispatchEvent( stopEvent );

	};

	controls.pause = function() {

		var pauseEvent = new CustomEvent( 'pause-animation' );
		window.dispatchEvent( pauseEvent );

	};

	controls.step = function() {

		var stepData = { detail: { stepSize: controls['Step Size'] } };
		window.dispatchEvent( new CustomEvent('step-animation', stepData ));

	};

	controls.weight = function(invoker) {

		//// renormalize
		//var sum = controls['Left'] + controls['Right'];
		//controls['Left'] /= sum;
		//controls['Right'] /= sum;

		if(controls['Left'] > 0  && invoker == "left") {
			controls['Right'] = 0;
		}

		if(controls['Right'] > 0  && invoker == "right") {
			controls['Left'] = 0;
		}

		if(controls['Forward'] > 0  && invoker == "forward") {
			controls['Backward'] = 0;
		}

		if(controls['Backward'] > 0  && invoker == "backward") {
			controls['Forward'] = 0;
		}



		//controls['run'] /= sum;

		var weightEvent = new CustomEvent( 'weight-animation', getAnimationData() );
		window.dispatchEvent(weightEvent);
	};

	controls.crossfade = function( from, to ) {

		var fadeData = getAnimationData();
		fadeData.detail.from = from;
		fadeData.detail.to = to;
		fadeData.detail.time = controls[ "Crossfade Time" ];

		window.dispatchEvent( new CustomEvent( 'crossfade', fadeData ) );
	}

	controls.warp = function( from, to ) {

		var warpData = getAnimationData();
		warpData.detail.from = 'walk';
		warpData.detail.to = 'run';
		warpData.detail.time = controls[ "Crossfade Time" ];

		window.dispatchEvent( new CustomEvent( 'warp', warpData ) );
	}

//controls['idle to walk'] = function() {
//
//	controls.crossfade( 'idle', 'walk' );
//
//};
//
//controls['walk to run'] = function() {
//
//	controls.crossfade( 'walk', 'run' );
//
//};
//
//controls['warp walk to run'] = function() {
//
//	controls.warp( 'walk', 'run' );
//
//};

	controls.lockCameraChanged = function() {

		var data = {
			detail: {
				shouldLock: controls['Lock Camera']
			}
		}

		window.dispatchEvent( new CustomEvent( 'toggle-lock-camera', data ) );
	}

	controls.showSkeletonChanged = function() {

		var data = {
			detail: {
				shouldShow: controls['Show Skeleton']
			}
		}

		window.dispatchEvent( new CustomEvent( 'toggle-show-skeleton', data ) );
	}


	controls.showModelChanged = function() {

		var data = {
			detail: {
				shouldShow: controls['Show Model']
			}
		}

		window.dispatchEvent( new CustomEvent( 'toggle-show-model', data ) );
	}

	deviceControllerChanged = function() {
		deviceControllerActivated = controls["Device Controller"];
	}



	init.call(this);

}