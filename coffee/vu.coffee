# VU
class VU

	###
		construcctor [
			{type}:string 		=> '231' ('Маяк - 231')
												=> 'romantica' ('Романтика 222')
			{options}:object	=> {gutter}:number (Indents between two sectors)
												=>
												=>
												=>
		]

	###
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
		@svg = d3.select ".visualizer-container"
			.append("svg")

		do @_getAudioContext
		do @_calculateRects
		do @_describeSectors
		do @_describeText

	###
		private methods
	###

	# calculates
	_calculateRects: ->
		@rect = @svg[0][0].getBoundingClientRect()
		@sectorsHeight = @rect.height*(@options.sectorHeight || 0.1)

	# drawing sectors
	_describeSectors: ->
		@groups = [
			@svg.append 'svg:g'
			@svg.append 'svg:g'
		]
		sector = (@rect.width-@offset) / @sectorsCount
		height = @rect.height - @sectorsHeight*3
		for g in [0,1]
			for i in [0...@sectorsCount]
				@groups[g].append 'svg:path'
					.attr 'd', "
						M#{(i*sector)+@offset},#{@sectorsHeight+height*g}
						L#{(i*sector)+@offset+sector-@gutter},#{@sectorsHeight+height*g}
						L#{(i*sector)+@offset+sector-@gutter},#{@sectorsHeight+height*g+@sectorsHeight}
						L#{(i*sector)+@offset},#{@sectorsHeight+height*g+@sectorsHeight}
						Z
					"
					.attr 'fill', "
						#{if i < 11 then @colors.normalDarken else @colors.dangerDarken}
					"
		return

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
			.attr 'fill', if text.indexOf('+') isnt -1 then @colors.danger else @colors.normal
			.attr "font-family", "sans-serif"
			.attr "font-size", "#{@font}px"

	# writing text
	_describeText: ->
		g = @svg.append 'svg:g'
		o = @offset
		w = @rect.width
		h = @rect.height
		s = @sectorsHeight
		f = @font

		@_text g, 'dB', {x: @offset/2, y: h/2}, off, 'central'
		@_text g, 'L', {x: @offset/2, y: s+s/2}, off, 'central'
		@_text g, 'R', {x: @offset/2, y: h-(s+s/2)}, off, 'central'

		@_text g, '-20', {x: o, y: h/2}, null, 'central'
		@_text g, '-15', {x: o+w*0.13, y: h/2}, null, 'central'
		@_text g, '-10', {x: o+w*0.27, y: h/2}, null, 'central'
		@_text g, '-6', {x: o+w*0.4, y: h/2}, null, 'central'
		@_text g, '-3', {x: o+w*0.5, y: h/2}, null, 'central'
		@_text g, '0', {x: o+w*0.6, y: h/2}, null, 'central'
		@_text g, '+2', {x: o+w*0.76, y: h/2}, on, 'central'
		@_text g, '+4', {x: w-2, y: h/2}, on, 'central'

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
		v = val*(@sectorsCount / 150*10) / 10
		sectors = @sectorsCount
		for g in [0,1]
			r = v * random(1,1.04)
			for p,i in @groups[g][0][0].childNodes
				d3.select(p).attr 'fill', "
					#{
						if i < sectors-sectors/3 then (
							if i < r then @colors.normal else @colors.normalDarken
						) else (
							if i < r then @colors.danger else @colors.dangerDarken
						)
					}
				"

	# render
	render: ->
		(renderChart = =>
			requestAnimFrame(renderChart)
			if @isRendering
				@analyser.getByteFrequencyData frequencyData
				@set @_getDB()
		)()

	# destroy
	destroy: ->
		@audioSrc.disconnect()
		@svg[0][0].parentNode.removeChild @svg[0][0]

	@