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


//logger
//var log = log4javascript.getDefaultLogger("oalog");

$(document).ready(function() {
	var contexto = $('.oacontext');
	mainInit(contexto);
	
	$('.ventana').addClass('oculto');
});

function mainInit(contexto) {
	var settings = {
		imgsPath : 'img/',
		imgs:{},
		imgsToLoad  : [],
		imgsLoaded : 0,
		config : {},
		onShow : null,
		closeWindowsOnExit : true
	};
	
	var main = new Main(settings, contexto);
	main._control();
}

function Main(settings, context) {
	// Call super-class constructor
	OAPhases.apply(this, arguments);
}

//metodos de las pantalla de ejercicios
_extends(Main, OAPhases, {
	//este metodo se ejecuta UNA sola VEZ y sirve para inicializar los eventos 
	start : function() {
		var _this = this;
		//alert('start: se ejecuta sólo una vez al entrar al objeto')

		var idobj = "";
		var idfija = "";
		var titulo = "";
		var info = "";
		var imagen = "";
		
		$("#radio_a").prop( "checked", true );
		
		$( ".opcionradio" ).change(function() {
			_this.gotoPhase($('input.opcionradio:checked').val());
		});
		
		$('.simBtn').click(function(event) {
			event.preventDefault();
			
			$('.ventana.content3D').removeClass('oculto');
			$('.opciones').hide();
			
			titulo = $(this).data('tit');
			idobj = $(this).data('obj');
			idfija = $(this).data('imgfija');
			info = $('.todaInformacion .' + idobj + ' p').html();
			$('.contenedor_3D .titulo').html(titulo);
			$('.contenedor_texto p').html($('.todaInformacion .' + idobj + ' p').html());
			
			$('.contenedor_3D .imgFija').hide();
			$('.contenedor_3D .celula3d').hide();
			
			if (idfija == "1") {
				imagen = 'img/sprites/' + idobj + '/' + idobj + '.jpg';
				$('.contenedor_3D .imgFija').css('backgroundImage', 'url('+imagen+')');
				$('.contenedor_3D .imgFija').show();
			} else {
				var opts = _this.config()[idobj];
				r3d = new Rotacion3D(opts, $('.celula3d'));
				r3d.init();
				$('.celula3d').show();
			}
		});
		
		$('.ventana.content3D .btn-close').click(function(event) {
			event.preventDefault();
			
			$('.opciones').show();
		});
	},

	config:function(ctx) {
		return {
			
			centrosoma_animal : {
				imgsPath : 'img/sprites/centrosoma_animal/',
				imgPrefix : 'centrosoma',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},

			cilios : {
				imgsPath : 'img/sprites/cilios/',
				imgPrefix : 'cilios',
				imgExt : '.png',
				hSlices : 2, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},
			
			citoesqueleto : {
				imgsPath : 'img/sprites/citoesqueleto/',
				imgPrefix : 'citoesqueleto',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},

			citoplasma : {
				imgsPath : 'img/sprites/citoplasma/',
				imgPrefix : 'citoplasma',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},

			cloroplasto : {
				imgsPath : 'img/sprites/cloroplasto/',
				imgPrefix : 'cloroplasto',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 535,
				height : 344
			},

			cromatina : {
				imgsPath : 'img/sprites/cromatina/',
				imgPrefix : 'cromatina',
				imgExt : '.png',
				hSlices : 8, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},
			
			envoltura : {
				imgsPath : 'img/sprites/envoltura/',
				imgPrefix : 'envoltura',
				imgExt : '.png',
				hSlices : 9, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},

			flagelo : {
				imgsPath : 'img/sprites/flagelo/',
				imgPrefix : 'flagelo',
				imgExt : '.png',
				hSlices : 2, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},
			
			golgi : {
				imgsPath : 'img/sprites/golgi/',
				imgPrefix : 'golgi',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},
			
			liso : {
				imgsPath : 'img/sprites/liso/',
				imgPrefix : 'liso',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},

			lisosomas : {
				imgsPath : 'img/sprites/lisosomas/',
				imgPrefix : 'lisosoma',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},

			membrana_plasmatica_eucariota : {
				imgsPath : 'img/sprites/membrana_plasmatica_eucariota/',
				imgPrefix : 'membrana_plasmatica_eucariota',
				imgExt : '.png',
				hSlices : 19, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},
			
			mitocondrias : {
				imgsPath : 'img/sprites/mitocondrias/',
				imgPrefix : 'mitocondria',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},
			
			nucleo : {
				imgsPath : 'img/sprites/nucleo/',
				imgPrefix : 'nucleo',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},
			
			nucleolo : {
				imgsPath : 'img/sprites/nucleolo/',
				imgPrefix : 'nucleolo',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},

			pared_celular_vegetal : {
				imgsPath : 'img/sprites/pared_celular_vegetal/',
				imgPrefix : 'pared_celular',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},
			
			ribosomas : {
				imgsPath : 'img/sprites/ribosomas/',
				imgPrefix : 'ribosoma',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},
			
			rugoso : {
				imgsPath : 'img/sprites/rugoso/',
				imgPrefix : 'rugoso',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 579,
				height : 420
			},
			
			vacuola : {
				imgsPath : 'img/sprites/vacuola/',
				imgPrefix : 'vacuola',
				imgExt : '.png',
				hSlices : 18, //rebanadas de giro sobre la horizontal
				vSlices : 10, //rebanadas de giro sobre la vertical
				cicloH : true,
				width : 580,
				height : 420
			},			
		}
	},
});
