function FPSCounter (ctx, fish_incremental, desired_test_round, ufc, main)
	{
		var _ctx = null;
		var main = main;
		var USE_FAST_CANVAS = ufc; 
		console.log("use fast canvas: " + ufc);
		var _startTime;
		var _frameCounter;
		
		var _afps;
		var _afpsList = []; 
		var fpsTracker = [];
		
		var _fishCount = 0;
		var _fishIncremental = 0;
		
		var _testRoundDesired = 0;
		var _testRoundCount = 0;

		_ctx = ctx;
		_fishIncremental = fish_incremental;
		_testRoundDesired = desired_test_round;

		var _doc = _ctx.parent;
		var txt;

		var getTextFieldRef = function() {}
		var updateText = function() {}

		if (USE_FAST_CANVAS) {
			getTextFieldRef = getTextFieldRefFastCanvas;
			updateText = updateTextFastCanvas;
		} else {
			getTextFieldRef = getTextFieldRefRegCanvas;
			updateText = updateTextRegCanvas;
		}

		FPSCounter.prototype.start = function()
		{
			console.log("start");
			txt = getTextFieldRef();
			console.log("txt: " + txt);
			startSingleRoundOfTest();
		}
		
		FPSCounter.prototype.reset = reset = function()
		{
			_startTime = new Date().getTime();
			_afps = 0;
			_frameCounter = 0;
			fpsTracker = [];
		}
		
		FPSCounter.prototype.frameCounterAddOne = frameCounterAddOne = function()
		{
			_frameCounter++;
			updateText("FPS: " + Math.floor(getFPSAverage()));
		}

		FPSCounter.prototype.startSingleRoundOfTest = startSingleRoundOfTest = function()
		{
			if (_testRoundCount > 0) {
				testDone();
			}
			_testRoundCount++;
			var testExeInt;
						
			var setEnterFrameInt;
								
			this.reset();
				
			//tstExeInt = setTimeout( testDone, 60000);
			
			/*setEnterFrameInt = setTimeout( function(){
				console.log("int called");
				
				this.reset();
				
				//testExeInt = setTimeout( testDone, 60000);
			}, 2000);*/
			
			
		}

		function getTextFieldRefRegCanvas () {
			var tf = document.getElementById("fpscounter");
			return tf;
		}

		function getTextFieldRefFastCanvas () {
			return main.txt;
		}

		function updateTextRegCanvas(str) {
			txt.value = str;
		}

		function updateTextFastCanvas(str) {
			txt.drawText(str);
		}
		
		function testDone(evt)
		{
			var total = 0;
			var afps;
			console.log("tracker length: " + fpsTracker.length);
			for (var i = 0; i < fpsTracker.length; i++ ) {
				total += fpsTracker[i];
			}
			afps = total/fpsTracker.length;
			var newEntry = _testRoundCount + ": " + _fishIncremental*_testRoundCount + " Fish - " + afps.toFixed(0) + " fps\n";
			console.log(newEntry);
			_afpsList.push(newEntry);
			
			if (_testRoundCount == _testRoundDesired)
			{
				console.log("test done");
			}
			console.log(_afpsList);
		}
		
		function getFPSAverage()
		{
			var millisecondsPassed = new Date().getTime() - _startTime;
			var framePerMilliseconds = _frameCounter / millisecondsPassed;
			var fps = framePerMilliseconds * 1000;
			fpsTracker.push(fps);
			return fps;
		}
	
}