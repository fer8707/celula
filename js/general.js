/****
 * Copyright (c) 2013 UNAM
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @author Pablo Zenil
 *
 */

/*funcion para simular overriding en metodo de clases extendidas y el objeto super
 * @param subClass clase que extiende
 * @param funcName nombre de la funcion a extender
 * @param func funcion que extiende
 */
function _override(subClass, funcName, func) {
	var _super = subClass._superClass;
	subClass.prototype[funcName] = (function(name, fn) {
		return function() {

			var tmp = this._super;
			// Add a new ._super() method that is the same method
			// but on the super-class
			this._super = _super;
			//[name];
			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret = fn.apply(this, arguments);
			this._super = tmp;
			return ret;
		};
	})(funcName, func);

	$('#debug').append('<br/>Overriding: ' + (subClass).toString().substring(0, (subClass).toString().indexOf('(')) + ': ' + funcName);

}

/*funcion para simular herencia y el objeto super
 * @param subClass subclase
 * @param superClass  superclase
 * @param subClassDefinition  definicion de subclase
 */
function _extends(subClass, superClass, subClassDefinition) {

	// Define sub-class
	subClass.prototype = new superClass;
	subClass.prototype.constructor = subClass;
	subClass._superClass = new superClass;

	if (subClassDefinition != null) {
		for (var funcName in subClassDefinition) {
			if ( typeof subClassDefinition[funcName] == "function" && typeof subClass._superClass[funcName] == "function") {
				_override(subClass, funcName, subClassDefinition[funcName]);
			} else {
				subClass.prototype[funcName] = subClassDefinition[funcName];
			}
		}
	}
}

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
		}
	};
}

function parseQueryString() {

	var params = {};
	var qs = window.location.search.replace('?', '');
	var pairs = qs.split('&');
	$.each(pairs, function(i, v) {
		var pair = v.split('=');
		params[pair[0]] = pair[1];
	});

	return params;
}

/**
 *
 */
function OAPhases(settings, context) {

	//Definicion de variables de clase (instancia)

	this.context = context;
	this.settings = settings;
	this.isLoaded = false;

	this.phaseDiv
	this.currentPhase = 0;
	this.totalPhases = 0;

	this.qsParams = parseQueryString();

}

/*
 * Definicion de funciones de clase
 * y variables "estaticas"
 */
OAPhases.prototype = {
	_control : function() {
		if (this.isLoaded) {
			this.gotoCurrentPhase();
		} else {
			this.settings.start = $.proxy(function() {
				this.isLoaded = true;
				this.init();
				this.start();
				this.gotoCurrentPhase();
			}, this);
			loadImgs(this.settings);
		}
	},

	init : function() {
		var _this = this;

		$('.fases .fase', this.context).each(function(idx) {
			$(this).attr('data-idx', idx);
			_this.totalPhases++;

			var name = $(this).data('name');
			if (name) {
				$(this).data('onEnterPhase', _this['_' + name + 'Enter']);
				$(this).data('onExitPhase', _this['_' + name + 'Exit']);
				$(this).data('initPhase', _this['_' + name + 'Init']);
			}

		});
		this._initPhases('.fase');
		this._initMainMenu('[data-type="mainMenu"]');
		this._initWindows('.ventana');
		this._initButtons('[data-action], [data-type="button"]');

		if (this.qsParams["ipadApp"] != null) {
			this._initAppFooter();
		}

	},

	_initMainMenu : function(jqselector) {
		$(jqselector, this.context).each(function(idx) {

			var target = $(this).attr('data-idx', idx);

			if (target.data('mode') == 'hide') {
				var innerMenu = $('<div class="innerMenu"  ></div>');
				innerMenu.append(target.html());
				target.html('');
				target.append(innerMenu);

				var btn = $('<a href="javascript:;" class="ocultar-btn"  data-action="hideMainMenu" title="Mostrar"><span>@</span></a>	');

				target.append(btn);

				btn.click(function() {
					innerMenu.toggleClass('oculto');
				});
			}

		});

	},

	_initAppFooter : function() {
		var $appFooter = $("[data-appfooter]");
		$("body").addClass("appMode");
		$appFooter.removeAttr("class");
		$('[data-action="hideMainMenu"]', $appFooter).hide();
		$appFooter.addClass("footer ipa");
		$(".fases").addClass("ipa");

	},

	_initPhases : function(jqselector) {

		var target = $(jqselector, this.context).addClass('oculto');

	},

	_initWindows : function(jqselector) {
		var _this = this;
		var wins = $(jqselector, this.context);

		wins.each(function() {
			var target = $(this);
			// buscar solo los hijos directos
			if (!target.has('> [data-action="close"]').length) {
				target.append('<a class="btn-close"  data-action="close" href="javascript:;" title="Cerrar">X</a>');
			}
		});

	},

	_initButtons : function(jqselector) {
		var _this = this;
		$(jqselector, this.context).click(function(event) {
			event.preventDefault();
			var action = $(this).data('action');
			var target = $(this).data('target');
			var targetctx = $(this).data('targetctx');
			var ctx = targetctx ? $(targetctx) : _this.phaseDiv;

			switch(action) {
				case 'nextPhase':
					_this.gotoNextPhase();
					break;
				case 'prevPhase':
					_this.gotoPreviousPhase();
					break;
				case 'gotoHome':
					_this.gotoPhase('home');
					break;
				case 'gotoPhase':
					_this.gotoPhase(target);
					break;
				case 'hideTransition':
				case 'close':
					var optgt;
					if (target) {
						optgt = $('[data-name="' + target + '"]', ctx);
						if (!optgt[0]) {
							optgt = $('.' + target, ctx);
						}
					} else {
						optgt = $(this).parent();
					}
					optgt.addClass('oculto');
					break;
				case 'hide':
					var optgt;
					if (target) {
						optgt = $('[data-name="' + target + '"]', ctx);
						if (!optgt[0]) {
							optgt = $('.' + target, ctx);
						}
					} else {
						optgt = $(this).parent();
					}
					optgt.fadeOut();
					break;
				case 'showTransition':
				case 'open':
					var optgt;
					if (target) {
						optgt = $('[data-name="' + target + '"]', ctx);
						if (!optgt[0]) {
							optgt = $('.' + target, ctx);
						}
					} else {
						optgt = $(this).parent();
					}

					//Verify data-close-others attributte
					var dataClose = $(this).data("close");
					if (dataClose) {
						_this._closeWindow(dataClose);
					}

					optgt.removeClass('oculto');
					break;
				case 'show':
					var optgt;
					if (target) {
						optgt = $('[data-name="' + target + '"]', ctx);
						if (!optgt[0]) {
							optgt = $('.' + target, ctx);
						}
					} else {
						optgt = $(this).parent();
					}
					optgt.fadeIn();
					break;
				default:
					break;
			}

		});

	},

	_displayHeaderFooter : function() {
		if (this.currentPhase == 0) {
			$('.header').addClass('enportada');
			$('.footer').addClass('enportada');
		} else {
			$('.header').removeClass('enportada');
			$('.footer').removeClass('enportada');
		}
	},

	_displayMainMenu : function() {
		var _this = this;
		var cidx = this.phaseDiv.data('idx');
		var cname = this.phaseDiv.data('name');

		$('[data-type="mainMenu"]', this.context).each(function() {
			var target = $(this);
			var hidelst = (target.data('hideon') + '');
			var idx = target.data('idx');
			hidelst = hidelst.split(',');

			var spl;
			for (var i = 0; i < hidelst.length; i++) {
				spl = hidelst[i].split('-');
				if ((spl.length > 1 && cidx >= spl[0] && cidx <= spl[1]) || (spl.length == 1 && (cidx == spl[0] || cname == spl[0]))) {
					target.addClass('oculto');
					_this.phaseDiv.removeClass('conmenu conmenu_' + idx);
					return;
				}
			}
			target.removeClass('oculto');
			_this.phaseDiv.addClass('conmenu conmenu_' + idx);
		});

		//Hide home button on phase 0
		var $homeButton = $('[data-type="mainMenu"] .btn-icono.inicio', this.context);
		if (cidx == 0) {
			$homeButton.addClass("oculto");
		} else {
			$homeButton.removeClass("oculto");
		}

	},

	_closeWindow : function(targetList, context) {

		if (targetList == "all") {
			$(".ventana", context).addClass("oculto");
		}

		var splittedList = targetList.split(",");
		for (var i = 0; i < splittedList.length; i++) {
			$('[data-name="' + splittedList[i] + '"]', context).addClass("oculto");
		}

	},

	start : function() {

	},

	onEnterPhase : function() {

	},

	onExitPhase : function() {

		if (this.settings.closeWindowsOnExit && this.settings.closeWindowsOnExit == true) {
			//Close all windows
			this._closeWindow("all", this.context);
		}
		return true;
	},

	gotoCurrentPhase : function() {
		var prevPhase = this.phaseDiv;
		if (prevPhase) {
			var exit = true;
			if (prevPhase.data('onExitPhase')) {
				exit = prevPhase.data('onExitPhase').apply(this, prevPhase.data('onExitPhaseArguments'));
			}
			exit = exit && this.onExitPhase();
			if (!exit)
				return;
		}
		this.phaseDiv = $('.fase[data-idx="' + this.currentPhase + '"]', this.context);
		if (!this.phaseDiv[0])
			return;

		$('.preloader', this.context).show();
		if (this.phaseDiv.data('initPhase') && !this.phaseDiv.data('initialized')) {
			this.phaseDiv.data('initPhase').apply(this, this.phaseDiv.data('initPhaseArguments'));
			this.phaseDiv.data('initialized', 'initialized');
		}
		$('.preloader', this.context).hide();

		this.phaseTransition(prevPhase);
		this._displayMainMenu();
		this.onEnterPhase();
		if (this.phaseDiv.data('onEnterPhase')) {
			this.phaseDiv.data('onEnterPhase').apply(this, this.phaseDiv.data('onEnterPhaseArguments'));
		}

		this._displayHeaderFooter();
	},

	phaseTransition : function(prevPhase) {
		if (prevPhase) {
			prevPhase.addClass('oculto');
		}
		this.phaseDiv.removeClass('oculto');
	},

	gotoNextPhase : function() {
		this.currentPhase = (this.currentPhase + 1) % this.totalPhases;
		this.gotoCurrentPhase();
	},

	gotoPreviousPhase : function() {
		this.currentPhase--;
		if (this.currentPhase < 0)
			this.currentPhase = this.totalPhases - 1;

		this.gotoCurrentPhase();
	},

	gotoPhase : function(phase) {
		var prevPhase = this.currentPhase;
		var fidx = parseInt(phase);
		if (fidx >= 0) {
			this.currentPhase = Math.max(Math.min(fidx, this.totalPhases - 1), 0);
		} else {
			this.currentPhase = parseInt($('.fase[data-name="' + phase + '"]', this.context).data('idx'));
		}

		if (prevPhase != this.currentPhase)
			this.gotoCurrentPhase();
	},

	toString : function() {
		return 'Phase: ' + this.currentPhase;
	}
};

