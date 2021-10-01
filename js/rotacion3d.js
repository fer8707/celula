function loadImgs(dataObj) {
	dataObj.imgsLoaded = 0;
	if (!dataObj.imgsToLoad || dataObj.imgsToLoad.length == 0) {
		dataObj.start();
	} else {
		var img;
		for (var i = 0; i < dataObj.imgsToLoad.length; i++) {
			img = $('<img/>');
			img.load(handleImgLoad(dataObj.imgsToLoad[i].id, dataObj));
			img.attr('src', dataObj.imgsPath + dataObj.imgsToLoad[i].src);
		}
	}
}

function handleImgLoad(imgId, dataObj) {
	return function(event) {
		var targetEl = event.currentTarget;
		dataObj.imgsLoaded++;
		dataObj.imgs[imgId] = targetEl;

		if (dataObj.imgsLoaded == dataObj.imgsToLoad.length) {
			dataObj.start();
		} else {
			$('.txt', dataObj.preloader).text(Math.floor(100 * dataObj.imgsLoaded / dataObj.imgsToLoad.length) + ' %');
		}
	}
}

function Rotacion3D(settings, context) {
	this.settings = $.extend({
		imgsPath : 'img/sprites/',
		imgs : [],
		imgsLoaded : 0,
		imgsToLoad : [],
		imgPrefix : '',
		imgExt : '.jpg',
		imgCharDiv : '_',
		frameRate : 30, //fps
		frames : 17,
		hSlices : 17, //rebanadas de giro sobre la horizontal
		vSlices : 10, //rebanadas de giro sobre la vertical
		animH : false,
		animV : false,
		width : 540,
		height : 210,
		heightNav : 0,
		cicloH : false,
		cicloV : false,
		backgroundImg : null,
		animBackground : false,
		animBackHnotV : true,
		bgvel : 1, // px/frame
		autoHideHUD : false,
		flipHV : false,
		velV : -1.5,
		velH : 1.5,
		zoom : false,
		initH: 0,
		initV: 0
	}, settings);

	this.json = {
		animations : {
			stop : [0, 0]
		},
		images : [],
		frames : {
			count : 0,
			regY : 0,
			regX : 0,
			width : 0,
			height : 0
		}
	}

	this.context = context;
	this.sprite
	this.viewport
	this.canvas
	this.directionNav
	this.stage

	this.currentFrame = {
		h : 0,
		v : 0
	}

	this.startFrame = {
		h : 0,
		v : 0
	}

	this.dragTimeInterval = 100;
	this.intervalId = 0;

	this.dragOffset = {
		initX : 0,
		currentX : 0
	}

	this.hudUp = null;
	this.hudDown = null;
	this.hudLeft = null;
	this.hudRight = null;
}

Rotacion3D.prototype = {
	init : function() {

		this.context.addClass('rotacion3D');
		this.context.html('');
		this.viewport = $('<div class="viewport"></div>');
		this.viewport.width(this.settings.width);
		this.viewport.height(this.settings.height);
		this.preloader = $('<div class="preloader"><div class="txt"></div></div>');
		this.viewport.append(this.preloader);

		var img = '';
		var hS = this.settings.hSlices;
		var vS = this.settings.vSlices;
		var h = 0;
		var v = 0;

		for ( h = 0; h < hS; h++) {
            img = this.settings.imgPrefix + this.settings.imgCharDiv + h + this.settings.imgExt;
            this.settings.imgsToLoad.push({
                id : img,
                src : img
            });
            this.json.images.push(this.settings.imgsPath + img);
        }
	
		if (this.settings.backgroundImg) {
			this.settings.imgsToLoad.push({
				id : 'backgroundImg',
				src : this.settings.backgroundImg
			});
		}

		this.json.frames.count = hS * vS;
		this.json.frames.width = this.settings.width;
		this.json.frames.height = this.settings.height;

		this.context.append(this.viewport);

		this.canvas = this.createCanvas(this.settings.width, this.settings.height, this.viewport);

		this.stage = new createjs.Stage(this.canvas);
		this.stage.enableMouseOver();
		createjs.Touch.enable(this.stage);

		createjs.Ticker.setFPS(this.settings.frameRate);

		createjs.Ticker.addListener(this);
		this.sprite = new createjs.BitmapAnimation(new createjs.SpriteSheet(this.json));

		this.directionNav = $('<div class="directionNav"></div>');

		this.directionNav.width(this.settings.width);
		//this.directionNav.height(this.settings.height); es el de Pablo, se cambi� x el de abajo
		this.directionNav.height(this.settings.heightNav);

		this.viewport.append(this.directionNav);

		if (this.settings.autoHideHUD) {
			//Hide Direction nav
			this.directionNav.hide();
			this.viewport.hover(function() {
				this.directionNav.show();
			}, function() {
				this.directionNav.hide();
			});
		} else {
			this.directionNav.show();
		}

		if (!this.settings.animV && this.settings.vSlices > 1) {
			this.hudLeft = $('<a class="prevNav" href="javascript:;"  data-dir="prev"></a>');
			this.directionNav.append(this.hudLeft);
			this.hudRight = $('<a class="nextNav" href="javascript:;"  data-dir="next"></a>');
			this.directionNav.append(this.hudRight);
		}
		
		if (!this.settings.animH && this.settings.hSlices > 1) {
			this.hudUp = $('<a class="upNav" href="javascript:;" data-dir="up"></a>');
			this.directionNav.append(this.hudUp);
			this.hudDown = $('<a class="downNav" href="javascript:;" data-dir="down"></a>');
			this.directionNav.append(this.hudDown);
			if (this.settings.zoom) {
				this.hudUp.addClass('zoom');
				this.hudDown.addClass('zoom');
			}
		}
		
		$('a', this.directionNav).click(function(e) {
			e.preventDefault();

			_this.move($(this));
		});
		
		//En el esperma todo esta invertido
		this.currentFrame.h = this.settings.initH;
		this.currentFrame.v = this.settings.initV;

		this.settings.start = $.proxy(function() {
			this.preloader.remove();
			this.isLoaded = true;
			this.start();
			this.show();
		}, this);
		loadImgs(this.settings);
	},

	createBackground : function() {
		this.background = new createjs.Shape();
		var g = this.background.graphics;

		if (this.settings.imgs.backgroundImg) {
			this.drawBackground();
		} else {
			g.beginFill("rgba(0,0,0)").drawRect(0, 0, this.settings.width, this.settings.height).endFill();
		}

		this.stage.addChild(this.background);
	},

	drawBackground : function() {
		var g = this.background.graphics;
		g.beginBitmapFill(this.settings.imgs.backgroundImg).drawRect(-this.settings.width, -this.settings.height, this.settings.width * 3, this.settings.height * 3).endFill();
	},
	
	createCanvas : function(width, height, container) {
		var mainObj = this;
		var canvas = document.createElement("canvas");
		
		if (container) {
			container.append(canvas);
		} else {
			var tmpParent = $('<div style="visibility:hidden;"></div>');
			$(document).append(tmpParent);
			tmpParent.append(canvas);
		}
		
		var w = width ? width : 10;
		var h = height ? height : 10;
		
		if ( typeof G_vmlCanvasManager != 'undefined') {
			//IE 8 se modifican antes de inicializar
			canvas.setAttribute("width", w);
			canvas.setAttribute("height", h);
			//$('#debug').append('IE excanvas<br/>');
			canvas = G_vmlCanvasManager.initElement(canvas);
		} else {
			$(canvas).attr('width', w);
			$(canvas).attr('height', h);
			//estas lineas son para el IE
			$(canvas).width(w);
			$(canvas).height(h);
		}
		
		return canvas;		
	},
	
	start : function() {
		_this = this;

		this.createBackground();
		this.stage.addChild(this.sprite);
		this.stage.onPress = $.proxy(this.startDrag, this);
	},
	
	show : function() {
		this.gotoCurrentFrame();
		this.stage.update();
		if (this.settings.animBackground || this.settings.animH || this.settings.animV) {
			createjs.Ticker.setPaused(false);
		}
	},

	debugAnimations : function() {
		var btn

		for (p in this.json.animations) {
			btn = $('<input type="submit" value="' + p + '"/>');

			btn.click(function() {
				_this.sprite.gotoAndPlay($(this).val());
			});
			this.context.append(btn);
		}
	},

	printjson : function(json) {
		var txt = '';

		txt += ('<ul>');
		for (p in json) {
			txt += ('<li>');
			txt += (p);

			if (json[p].length > 0) {
				txt += ' : [';
				for (var i = 0; i < json[p].length; i++) {
					txt += i != 0 ? ', ' : '';
					txt += json[p][i];
				}
				txt += ']';
			} else if (json[p] >= 0 || json[p] < 0) {
				txt += ' : ' + json[p];
			} else {
				txt += this.printjson(json[p])
			}

			txt += ('</li>');
		}
		txt += ('</ul>');

		return txt;
	},

	tick : function() {
		if (this.settings.animV) {
			this.currentFrame.h = (this.currentFrame.h + 1) % this.settings.vSlices;
		} else {
			if (this.hudLeft && this.hudRight && !this.settings.cicloV) {
				if (this.currentFrame.h == (this.settings.vSlices - 1)) {
					this.hudRight.hide();
				} else if (this.currentFrame.h == 0) {
					this.hudLeft.hide();
				} else {
					this.hudRight.show();
					this.hudLeft.show();
				}
			}
		}

		if (this.settings.animH) {
			this.currentFrame.v = (this.currentFrame.v + 1) % this.settings.hSlices;
		} else {
			if (this.hudUp && this.hudDown && !this.settings.cicloH) {
				if (this.currentFrame.v == (this.settings.hSlices - 1)) {
					this.hudUp.hide();
				} else if (this.currentFrame.v == 0) {
					this.hudDown.hide();
				} else {
					this.hudUp.show();
					this.hudDown.show();
				}
			}
		}

		this.gotoCurrentFrame();
		if (this.settings.animBackground && this.background) {
			if (this.settings.animBackHnotV) {
				this.background.x = (this.background.x - this.settings.bgvel) % this.settings.width;
			} else {
				this.background.y = (this.background.y - this.settings.bgvel) % this.settings.height;
			}
		}

		this.stage.update();
	},
	
	gotoCurrentFrame : function() {
		this.sprite.gotoAndStop(this.currentFrame.h + this.currentFrame.v * this.settings.vSlices);
	},
	
	move : function(obj) {
		var dir = obj.data('dir');

		this.startFrame.h = this.currentFrame.h;
		this.startFrame.v = this.currentFrame.v;

		if (dir == 'next') {
			this.changeFrames(1, 0);
		} else if (dir == 'prev') {
			this.changeFrames(-1, 0);
		} else if (dir == 'up') {
			this.changeFrames(0, 1);
		} else if (dir == 'down') {
			this.changeFrames(0, -1);
		} else {
			return;
		}
	},

	startDrag : function(event) {
		this.currentTarget = event.target;
		this.dragOffset.initX = event.stageX;
		this.dragOffset.initY = event.stageY;

		this.startFrame.h = this.currentFrame.h;
		this.startFrame.v = this.currentFrame.v;

		this.stage.onMouseMove = $.proxy(this.drag, this);
		this.stage.onMouseUp = $.proxy(this.stopDrag, this);
	},
	
	drag : function(event) {
		if (this.currentTarget != null) {
			this.dragOffset.currentX = event.stageX;
			this.dragOffset.currentY = event.stageY;
			this.dragOffset.x = this.dragOffset.currentX - this.dragOffset.initX;
			this.dragOffset.y = this.dragOffset.currentY - this.dragOffset.initY;

			this.changeFrames(this.settings.velH * this.dragOffset.x * this.settings.vSlices / this.settings.width, this.settings.velV * this.dragOffset.y * this.settings.hSlices / this.settings.height)
		}
	},

	stopDrag : function(event) {
		this.stage.onMouseMove = null;
		this.currentTarget = null;
	},

	changeFrames : function(deltaH, deltaV) {
		deltaH = parseInt(deltaH);
		deltaV = parseInt(deltaV);
		
		if (!this.settings.animV) {
			if (!this.settings.cicloV) {
				this.currentFrame.h = Math.min(Math.max(0, (this.startFrame.h + deltaH)), this.settings.vSlices - 1);
			} else {
				this.currentFrame.h = (this.startFrame.h + deltaH) % this.settings.vSlices;
				if (this.currentFrame.h < 0) {
					this.currentFrame.h = (this.settings.vSlices ) + this.currentFrame.h;
				}
			}
		}

		if (!this.settings.animH) {

			if (!this.settings.cicloH) {
				this.currentFrame.v = Math.min(Math.max(0, (this.startFrame.v + deltaV)), this.settings.hSlices - 1);

			} else {

				this.currentFrame.v = (this.startFrame.v + deltaV) % this.settings.hSlices;
				if (this.currentFrame.v < 0) {
					this.currentFrame.v = (this.settings.hSlices ) + this.currentFrame.v;
				}
			}
		}

		if (createjs.Ticker.getPaused()) {
			this.gotoCurrentFrame();
			this.stage.update();
		}
	},

	clear : function() {
		createjs.Ticker.removeEventListener(this);
	}
}
