### ======================================================= ###
### vk audio visualizer 																		###
### inkor, 2016 																						###
### ======================================================= ###

# settings / variables
svgHeight = 40
lines = []

interval = 30
analyser = null


# functions
window.requestAnimFrame = (->
	# window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback, element) ->
	(callback, element) ->
		window.setTimeout callback, 1000 / interval
)()
# random
random = (min, max)->
	Math.random() * (max - min) + min

randomColor = ->
	letters = '0123456789ABCDEF'.split ''
	color = '#'
	i = 0
	while (i < 6)
		color += letters[Math.floor(Math.random() * 16)];
		i++
	color


### ======================================================== ###
# script


vu = new VU document.getElementById('type1'),
	parentPadding: 15
	sectors: 15
	height: 22
	gutter: 6
	offset: 0.3
	colors:
		normal: '#00362C'
		normalDark: '#6BEAD2'
		danger: '#23100C'
		dangerDark: '#f75'
	font: 19

vu2 = new VU document.getElementById('type2'),
	parentPadding: 15
	sectors: 15
	height: 14
	gutter: 2
	offset: 0.3
	type231: on
	colors:
		normal: '#020'
		normalDark: '#0f0'
		danger: '#200'
		dangerDark: '#f00'
	font: 18

vu3 = new VU document.getElementById('type3'),
	parentPadding: 15
	sectors: 1000
	height: 14
	gutter: 0
	offset: 0.3
	type231: on
	single: on
	colors:
		normal: '#333'
		normalDark: '#eee'
		danger: '#222'
		dangerDark: '#bbb'
	font: 18




ANALYZER = new Analyzer 'html5_audio', (data, db, audio)->
	vu.set db, parseInt audio.currentTime.toFixed 0
	vu2.set db, parseInt audio.currentTime.toFixed 0
	vu3.set db, parseInt audio.currentTime.toFixed 0



for radio in document.querySelectorAll 'input[type="radio"]'
	radio.addEventListener 'click', (e)->
		document.getElementById('html5_audio').setAttribute 'src', "audio/#{this.getAttribute 'data-track'}"

document.getElementById('fps').innerHTML = interval
document.getElementById('plus').addEventListener 'click', (e)->
	interval += 10 if interval < 100
	document.getElementById('fps').innerHTML = interval
document.getElementById('minus').addEventListener 'click', (e)->
	interval -= 10 if interval > 10
	document.getElementById('fps').innerHTML = interval

window.onresize = ->
	vu._calc()
	vu2._calc()
	vu3._calc()
