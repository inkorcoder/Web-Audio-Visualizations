# functions
window.requestAnimFrame = (->
	# window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback, element) ->
		# window.setTimeout callback, 1000 / 60
	(callback, element) ->
		window.setTimeout callback, 1000 / 30
)()

# lines generation
generateSVGLines = ->
	# append SVG element
	bodySelection = d3.select ".visualizer-container"
	svgSelection = bodySelection.append("svg")
		.attr("width", 200)
		.attr("height", svgHeight)
	# adding lines
	for d in [0...50]
		line = svgSelection
			.append 'svg:line'
			.attr 'x1', 0
			.attr 'x2', 0
			.attr 'y1', svgHeight/2
			.attr 'y2', svgHeight/2
			.attr 'stroke', '#fff'
			.attr 'stroke-width', 2
		lines.push line
	return

getAudioContext = ->
	# get stream
	audioCtx = new (window.AudioContext || window.webkitAudioContext)()
	audioElement = document.getElementById 'html5_audio'
	audioElement.setAttribute 'crossorigin', "anonymous"
	# get context from <audio> element
	audioSrc = audioCtx.createMediaElementSource(audioElement)
	analyser = audioCtx.createAnalyser()
	# analyser connection
	audioSrc.connect(analyser)
	audioSrc.connect(audioCtx.destination)
