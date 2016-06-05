### ======================================================= ###
### vk audio visualizer 																		###
### inkor, 2016 																						###
### ======================================================= ###

# settings / variables
svgHeight = 40
lines = []

frequencyData = new Uint8Array 50
analyser = null


# functions
window.requestAnimFrame = (->
	window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback, element) ->
		window.setTimeout callback, 1000 / 60
)()
# random
random = (min, max)->
	Math.random() * (max - min) + min

### ======================================================== ###
# script

# add container
container = document.createElement 'div'
container.className = 'visualizer-container'
document.body.insertBefore container, document.body.firstChild

# hack the origin
# meta = document.createElement('meta');
# meta.httpEquiv = "Access-Control-Allow-Origin";
# meta.content = "*";
# document.getElementsByTagName('head')[0].appendChild(meta);

if location.pathname is "/index.html" or location.pathname is ""
	vu = new VU document.getElementById('html5_audio'),
		gutter: 2
		sectors: 70
		sectorHeight: 0.15
		colors:
			normal: '#0f0'
			normalDarken: '#040'
			danger: '#f00'
			dangerDarken: '#400'
		smooth: on
		offset: 20
		font: 9
	vu.render()

if location.pathname is "/mode2.html"
	vu = new VU document.getElementById('html5_audio'),
		gutter: 2
		sectors: 15
		sectorHeight: 0.13
		colors:
			normal: '#0f0'
			normalDarken: '#040'
			danger: '#f00'
			dangerDarken: '#400'
		smooth: on
		offset: 20
		font: 10
	vu.render()

if location.pathname is '/analog.html'
	vu = new ANALOG document.getElementById('html5_audio'),
		gutter: 2
		sectors: 15
		sectorHeight: 0.13
		colors:
			normal: '#0f0'
			normalDarken: '#040'
			danger: '#f00'
			dangerDarken: '#400'
		smooth: on
		offset: 20
		font: 10
	vu.render()


for radio in document.querySelectorAll 'input[type="radio"]'
	radio.addEventListener 'click', (e)->
		document.getElementById('html5_audio').setAttribute 'src', "audio/#{this.getAttribute 'data-track'}"

document.getElementById('start').addEventListener 'click', (e)->
	vu.startRender()

document.getElementById('pause').addEventListener 'click', (e)->
	vu.pauseRender()

document.getElementById('stop').addEventListener 'click', (e)->
	vu.stopRender()