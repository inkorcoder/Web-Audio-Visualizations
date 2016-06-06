# VU
class ANALOG

	constructor: (@element, @options) ->
		@sectorsCount = @options.sectors || 13
		@gutter = @options.gutter || 2
		@isRendering = @options.startRender || on
		@offset = @options.offset || 20
		@colors =
			normal: 			@options.colors.normal 				|| 'rgba(50,250,50,1)'
			normalDarken: @options.colors.normalDarken 	|| 'rgba(50,250,50,.2)'
			danger: 			@options.colors.danger 				|| 'rgba(255,50,50,1)'
			dangerDarken: @options.colors.dangerDarken 	|| 'rgba(255,50,50,.2)'
		@font = @options.font || 9
		@svg = []
		@svg[0] = d3.select ".visualizer-container"
			.append("svg")
			.attr 'class', 'analog'
		@svg[1] = d3.select ".visualizer-container"
			.append("svg")
			.attr 'class', 'analog'

		@arrows = []
		@points = [
			[-30, -29.5]
			[-26.5, -27]
			[-13.5, -14]
			[-3.5, -4]
			[2.5, 3]
			[9.5, 10]
			[16.5, 17]
			[29.5, 30]
		]

		@over = []

		do @_getAudioContext
		do @_calculateRects
		do @_createAnalog
		do @_describeText

	###
		private methods
	###

	# calculates
	_calculateRects: ->
		@rect = @svg[0][0][0].getBoundingClientRect()
		@sectorsHeight = @rect.height*(@options.sectorHeight || 0.1)


	# getting audio context from element
	_getAudioContext: ->
		# get stream
		@audioCtx = new (window.AudioContext || window.webkitAudioContext)()
		# @element.setAttribute 'crossorigin', "anonymous"
		# get context from <audio> element
		@audioSrc = @audioCtx.createMediaElementSource @element
		@analyser = @audioCtx.createAnalyser()
		@analyser.fftSize = 2048
		@analyser.smoothingTimeConstant = off if !@options.smooth
		# analyser connection
		@audioSrc.connect(@analyser)
		@audioSrc.connect(@audioCtx.destination)

	# getting current dB
	_getDB: ->
		res = 0
		freqs =
			low: frequencyData[5] * ((frequencyData[1] / 10) * (frequencyData[1] / 10)) * 0.0008
			mid: frequencyData[20]
		return (freqs.low*2 + freqs.mid)/2 * 0.55

	_polarToCartesian: (cx, cy, r, angle) ->
		angle = (angle - 90) * Math.PI / 180
		{
			x: cx + r * Math.cos(angle)
			y: cy + r * Math.sin(angle)
		}

	_point: (start, end, a, small)->
		@svg[a]
			.append 'path'
				.attr 'd', "#{@_describeSector(@rect.width/2, @rect.height*2, 104, (if small then 106 else 110), start, end)}"
				.attr 'fill', if start < 9.5 then @colors.normal else @colors.danger

	_createAnalog: ->
		for a in [0,1]
			for p in @points
				@_point p[0], p[1], a
			@_point @points[0][0], @points[4][1], a, on
			@_point @points[5][0], @points[7][1], a, on
			@arrows[a] = @svg[a]
				.append 'path'
				.attr 'd', "
					M#{@rect.width/2-1},25
					L#{@rect.width/2+0.1},25
					L#{@rect.width/2+0.1},#{@rect.height-@sectorsHeight}
					L#{@rect.width/2-1},#{@rect.height-@sectorsHeight}
					Z
				"
				.attr 'fill', '#fff'
				.attr 'transform', "rotate(-30, #{@rect.width/2}, #{@rect.height*2})"

			@over[a] = @svg[a].append 'circle'
				.attr 'cx', @rect.width - 15
				.attr 'cy', 15
				.attr 'r', 5
				.attr 'fill', @colors.dangerDarken

	_describeArc: (x, y, r, startAngle, endAngle, continueLine) ->
		start = @_polarToCartesian(x, y, r, startAngle %= 360)
		end = @_polarToCartesian(x, y, r, endAngle %= 360)
		large = Math.abs(endAngle - startAngle) >= 180
		alter = endAngle > startAngle
		'' + (if continueLine then 'L' else 'M') + start.x + ',' + start.y + ' A' + r + ',' + r + ',0, ' + (if large then 1 else 0) + ', ' + (if alter then 1 else 0) + ',' + end.x + ',' + end.y

	_describeSector: (x, y, r, r2, startAngle, endAngle) ->
		'' + @_describeArc(x, y, r, startAngle, endAngle) + ' ' + @_describeArc(x, y, r2, endAngle, startAngle, true) + 'Z'


	# writing text (helper)
	_text: (group, text, pos, isEnd, align)->
		group.append 'svg:text'
			.text text
			.attr "x", pos.x
			.attr "y", pos.y
			.attr "text-anchor", (
					if isEnd is on then 'end' else (
						if isEnd is off then 'middle' else ''
					)
				)
			.attr 'alignment-baseline', if align then align else ''
			.attr 'fill', if isEnd then @colors.danger else @colors.normal
			.attr "font-family", "sans-serif"
			.attr "font-size", "#{@font}px"

	# writing text
	_describeText: ->
		for a in [0,1]
			g = @svg[a].append 'svg:g'
			@_text g, '20', {x: 10, y: 25+10}, off, 'central'
			@_text g, '10', {x: 40, y: 13+10}, off, 'central'
			@_text g, '3', {x: 63, y: 10+10}, off, 'central'
			@_text g, '1', {x: 76, y: 10+10}, off, 'central'
			@_text g, '0', {x: 96, y: 11+10}, on, 'central'
			@_text g, '1', {x: 111, y: 15+10}, on, 'central'
			@_text g, '3', {x: 130, y: 25+10}, on, 'central'
			@_text g, '+', {x: 135, y: 50+5}, on, 'central'
			@_text g, '-', {x: 10, y: 50+5}, off, 'central'
			@_text g, 'dB', {x: @rect.width/2, y: 50+5}, off, 'central'


	###
		public methods
	###

	# starting
	startRender: ->
		@isRendering = on

	# pause
	pauseRender: ->
		@isRendering = off

	# stopping
	stopRender: ->
		@isRendering = off
		@set 0


	# setter
	set: (val)->
		v = val / 2.3
		sectors = @sectorsCount
		for g in [0,1]
			r = v * random(1,1.1)
			@arrows[g]
				.attr 'transform', "rotate(#{-30+v}, #{@rect.width/2}, #{@rect.height*2})"
			@over[g]
				.attr 'fill', if v < 55 then @colors.dangerDarken else @colors.danger

	# render
	render: ->
		(renderChart = =>
			requestAnimFrame(renderChart)
			if @isRendering
				@analyser.getByteFrequencyData frequencyData
				@set @_getDB()
		)()

	@