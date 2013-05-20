function rotateAround(ctx, angle, cx, cy){
	var u = Math.cos(angle);
	var v = Math.sin(angle);
	var x = cx - (u * cx - v * cy);
	var y = cy - (v * cx + u * cy);
	ctx.translate(x, y);
	ctx.rotate(angle);
};

		var USE_FAST_CANVAS = false;
	 	var canvas = null;
        var ctx;
		var FISH_INCREMENTAL = 50;
		var FISH_MAXIMUM = 1000;
		var DEBUG = false;

		var is_HD = false;

		var STAGE_WIDTH;
		var STAGE_HEIGHT;

		var FISH_WIDTH = 350;
		var FISH_SCALE = 0.2;
		var FISH_MINIMUM_X;
		var FISH_MAXIMUM_X;
		var FISH_MINIMUM_Y;
		var FISH_MAXIMUM_Y;

		
		var fish_speed = 3;
		var fish_angular_speed = 0.02;
		var fish_width = 350;
		var fish_height = 259;
		
		var background_speed = 0.2;
		var background_width = 1024;
		var background_height = 768;
		var top_overlay_speed = 0.3;
		var top_overlay_width = 1500;
		var top_overlay_height = 135;
		var bottom_overlay_speed = 0.6;
		var bottom_overlay_width = 1500;
		var bottom_overlay_height = 159;
		
		var background_sprite_width_minus_stage_width;
		var top_overlay_sprite_with_minus_stage_width;
		var bottom_overlay_sprite_width_minus_stage_width;
		
		var backgroundImage;
		var topOverlayImage;
		var bottomOverlayImage;
		
		var fishes= [];
		var assets = [];

		var fpsCounter;
		var font;

		var assetsLoaded = 0;
		var allAssetsLoaded = false;
 		var canvasCreated = false;	

 		var readyTimeoutID = -1;
 		var fishInt;

		 function addMoreFish(event)
		{
			if (fishes.length <= FISH_MAXIMUM) {
				addFish(FISH_INCREMENTAL);
				console.log("# of fish: " + fishes.length);
				fpsCounter.startSingleRoundOfTest();
			}
			
		}		
		
		 var debugTxt;
		
		 function addMoreFishByTouch(event)
		{
			//var touch:Touch = event.getTouch(this, TouchPhase.ENDED);
			
			if (touch && touch.tapCount == 2)
			{
				addFish(FISH_INCREMENTAL);
			}
			
			debugTxt.text = fishes.length.toString();
		}
		
		 function addFish(count)
		{
			var name = "Boss";
			
			if (is_HD)
				name = "Boss2x";
			
			var texture = assets[name];
			
			var currentFishCount = fishes.length;
			
			for (var fishIndex=currentFishCount; fishIndex<currentFishCount+count; fishIndex++) 
			{
				var newFish = {};
				
				newFish.texture = texture;
				newFish.pivotX = fish_width / 2;
				newFish.pivotY = fish_height / 2;
				newFish.scaleX = FISH_SCALE;
				newFish.scaleY = FISH_SCALE;
				newFish.x = (Math.random() * FISH_MAXIMUM_X) + FISH_MINIMUM_X;
				newFish.y = (Math.random() * FISH_MAXIMUM_Y) + FISH_MINIMUM_Y;
				newFish.rotation = Math.random() * Math.PI * 2.0;
				
				fishes[fishIndex] = newFish;
			}
			
		}
		
		 function compositeImage(texture_name)
		{
			var d=0;
			var container = {};
			container.x = d;
			
			if (is_HD)
				texture_name += "2x";

			var w, h;
			if (texture_name == "Background") {
				w = background_width;
				h = background_height;
			} else if(texture_name == "TopOverlay") {
				w = top_overlay_width;
				h = top_overlay_height;
			} else if (texture_name == "BottomOverlay") {
				w = bottom_overlay_width;
				h = bottom_overlay_height;
			}
			
			var img1 = {};
			img1.texture = assets[texture_name];
			var img2 = {};
			img2.texture = assets[texture_name];
			
			img1.x = d;
			container.img1 = img1;
			img2.x = w;
			container.img2 = img2;
			container.width = w + w;
			container.height = h;
			
			return container;
		}
		
		 function isHD(stageHeight)
		{
			return stageHeight==1536 || stageHeight==640;
		}

		function assetLoaded () {
			assetsLoaded++;
			if (assetsLoaded >= 4) {
				console.log("all assets loaded");
				allAssetsLoaded = true;
				checkInitStatus();
			}
		}

		function checkInitStatus() {
			if (allAssetsLoaded && canvasCreated) {
				init2();
			}
		}

		function onDeviceReadyTimeout() {
			// device ready not called; must be in a browser
			USE_FAST_CANVAS = false;
			console.log("onDeviceReadyTimeout()");
			txt = createTextField();
			canvas = createHTMLCanvas();
			canvasCreated = true;
			ctx = canvas.getContext("2d");
			loadAssets();

			checkInitStatus();
		}

        function onDeviceReady() {
			console.log("onDeviceReady()");
			clearTimeout(readyTimeoutID);
			if (USE_FAST_CANVAS) {
				canvas = window.plugins.fastCanvas;
                var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
                canvas.width = width;
                canvas.height = height;
				ctx = canvas.getContext("2d");
				font = new FastCanvasImage();
       			font.onload = onFontLoaded;
       			font.src = "assets/courier_white_shadow.png";
      
       			txt = new TextRenderer(ctx, font);
			} else {
				txt = createTextField();
				canvas = createHTMLCanvas();
				ctx = canvas.getContext("2d");
			}
			canvasCreated = true;
			loadAssets();

			checkInitStatus();
		}

		function onFontLoaded(){
       		console.log("font loaded");
            ctx.save();
       		ctx.translate(20,20);
       		ctx.scale(2,2);
       		txt.drawText("HELLO");
            ctx.restore();
		}

		function createHTMLCanvas () {
			var canvas = document.createElement("canvas");
			var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
			var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
			canvas.width = width;
			canvas.height = height;
			canvas.style.left = "0px";
        	canvas.style.top = "0px";

			document.body.appendChild(canvas);
			return canvas;
		}

		function createTextField() {
			var txt = document.createElement("input");
			txt.id = "fpscounter";
			txt.setAttribute("value", "HELLO");
			txt.setAttribute("style", "position:absolute; left=10px; top=580px;");
			document.body.appendChild(txt);
			return txt;
		}

		
		 function initialize() 
		{

			console.log("initialized");
			document.addEventListener("deviceready", onDeviceReady, false);
			readyTimeoutID = setTimeout(onDeviceReadyTimeout, 2000);
		}

		function loadAssets() {
			loadAsset("Background", "background.jpg");
			//loadAsset("Background2x", "2x_background.jpg");
			loadAsset("BottomOverlay", "bottom-overlay.png");
			//loadAsset("BottomOverlay2x", "2x_bottom-overlay.png");
			loadAsset("TopOverlay", "top.png");
			//loadAsset("TopOverlay2x", "2x_top.png");
			loadAsset("Boss", "base-state.png");
			//loadAsset("Boss2x", "2x_base-state.png");
		}

		function loadAsset(name, fileName) {
			//var img = FastUtils.createImage(ctx);
			var img = new Image();
			img.src = "assets/" + fileName;
			img.onload = assetLoaded;
			assets[name] = img;
		}

		function init2() {
			console.log("init2");

			STAGE_WIDTH = canvas.width;
			STAGE_HEIGHT = canvas.height;

			FISH_MINIMUM_X = -80;
			FISH_MAXIMUM_X = STAGE_WIDTH + 100;
			FISH_MINIMUM_Y = 60;
			FISH_MAXIMUM_Y = STAGE_HEIGHT;

			is_HD = isHD(STAGE_HEIGHT);
			
			if (is_HD)
			{
				fish_speed *= 2;
				fish_angular_speed *= 2;
				background_speed *= 2;
				top_overlay_speed *= 2;
				bottom_overlay_speed *= 2;
			}

			backgroundImage = compositeImage("Background");
			
			if (!is_HD)
				backgroundImage.scaleX = backgroundImage.scaleY = STAGE_HEIGHT/768;
			
			topOverlayImage = compositeImage("TopOverlay");
			topOverlayImage.y = topOverlayImage.height * -0.5;
			
			bottomOverlayImage = compositeImage("BottomOverlay");
			bottomOverlayImage.y = STAGE_HEIGHT - (bottomOverlayImage.height * 0.5);
			
			addFish(FISH_INCREMENTAL);
			
			background_sprite_width_minus_stage_width = backgroundImage.width - STAGE_WIDTH;
			top_overlay_sprite_with_minus_stage_width = topOverlayImage.width - STAGE_WIDTH;
			bottom_overlay_sprite_width_minus_stage_width = bottomOverlayImage.width - STAGE_WIDTH;

			if ( !window.requestAnimationFrame ) {
 
        		window.requestAnimationFrame = ( function() {
 
            		return window.webkitRequestAnimationFrame ||
            		window.mozRequestAnimationFrame ||
            		window.oRequestAnimationFrame ||
            		window.msRequestAnimationFrame ||
            		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
 
             			window.setTimeout( callback, 1000 / 60 );
 
           		 	};

 
        		} )();
			}

			requestAnimationFrame(loop);

			fpsCounter = new FPSCounter(this, FISH_INCREMENTAL, FISH_MAXIMUM/FISH_INCREMENTAL, USE_FAST_CANVAS, this);
			fishInt = setInterval(addMoreFish, 60000);
			
			if (!DEBUG)
			{
				fpsCounter.start();
			}
			else
			{
				debugTxt.scaleX = 5;
				debugTxt.scaleY = 5;
				debugTxt.textColor = 0xFFFF00;
				debugTxt.x = 200;
				debugTxt.y = 30;
				debugTxt.selectable = false;
				
				//addEventListener(starling.events.TouchEvent.TOUCH, addMoreFishByTouch);
			}

		}

		function render() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.drawImage(backgroundImage.img1.texture, backgroundImage.x, 0);
			ctx.drawImage(backgroundImage.img2.texture, backgroundImage.x+backgroundImage.width/2, 0);
			
			for (var i = 0; i < fishes.length; i++) {

				var fish = fishes[i];
				var w = 100;
				var h = w * fish_height/fish_width;
				ctx.save();
				ctx.translate(fish.x, fish.y);
				rotateAround(ctx,fish.rotation, w/2,h/2);
				ctx.drawImage(fish.texture, 0, 0, w, h);
				ctx.restore();
			}

			ctx.drawImage(topOverlayImage.img1.texture, topOverlayImage.x, 0);
			ctx.drawImage(topOverlayImage.img2.texture, topOverlayImage.x+topOverlayImage.width/2, 0);
	
			ctx.drawImage(bottomOverlayImage.img1.texture, bottomOverlayImage.x, bottomOverlayImage.y);
			ctx.drawImage(bottomOverlayImage.img2.texture, bottomOverlayImage.x+bottomOverlayImage.width/2, bottomOverlayImage.y);
			
			ctx.save();
			ctx.translate(20,20);
       		ctx.scale(2,2);
       		fpsCounter.frameCounterAddOne();
       		ctx.restore();

			//render();
		}

		 function move() 
		{
			backgroundImage.x -= background_speed;
			if (backgroundImage.x < -background_sprite_width_minus_stage_width)
			{
				backgroundImage.x += background_sprite_width_minus_stage_width;
			}
				
			topOverlayImage.x -= top_overlay_speed;
			if (topOverlayImage.x < -top_overlay_sprite_with_minus_stage_width)
			{
				topOverlayImage.x += top_overlay_sprite_with_minus_stage_width;
			}
			
			bottomOverlayImage.x -= bottom_overlay_speed;
			if (bottomOverlayImage.x < -bottom_overlay_sprite_width_minus_stage_width)
			{
				bottomOverlayImage.x += bottom_overlay_sprite_width_minus_stage_width;
			}
			
			for (var fishIndex = 0; fishIndex < fishes.length; fishIndex++) 
			{
				var myFish = fishes[fishIndex];
				
				myFish.x -= fish_speed;
				if(myFish.x < FISH_MINIMUM_X)
				{
					myFish.x += FISH_MAXIMUM_X;
				}
				
				myFish.rotation += fish_angular_speed;
			}
			render();
		}
		
		 function loop(event) 
		{
			move();
			requestAnimationFrame(loop);
		}