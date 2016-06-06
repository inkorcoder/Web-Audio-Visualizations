# VU
class VU

	constructor: (@element, @options) ->
		@canvas = @element
		@is231 = @options and @options.type231
		@single = @options and @options.single
		do @_calc

	###
		private methods
	###

	_calc: ->
		@parentRect = @canvas.parentNode.getBoundingClientRect()
		@parentPadding = if @options then @options.parentPadding else 0
		@sectors = if @options then @options.sectors else 15
		@gutter = if @options then @options.gutter else 5
		@ctx = @canvas.getContext '2d'
		@canvas.width = @parentRect.width - (@parentPadding*2)
		@canvas.height = @parentRect.height - (@parentPadding*2)
		@rect = @canvas.getBoundingClientRect()
		@o = @rect.width * (
			if !@is231 and @options and @options.offset then @options.offset else 0
		)
		@w = (@rect.width - (@o || 0)) / @.sectors
		@a = @rect.width - (@o || 0)
		@h = if !@single then (
			if @options then @options.height else 10
		) else @rect.height
		@c = @options.colors
		@f = if @options and @options.font then @options.font else 16


	_shape: (x1, y1, w, h, fill)->

		@ctx.fillStyle = fill || '#000'
		if @is231
			@ctx.fillRect x1, y1, w, h
		else
			half = (w-w*0.2)/2
			@ctx.fillRect x1, y1, half, h
			@ctx.fillRect x1+half+w*0.2, y1, half, h

	_text: (text, x, y, align, large, bottom)->
		@ctx.font = "#{if !large then @f else @f*2.5}px #{if !@is231 then 'Digital' else 'arial'}"
		@ctx.textBaseline = if !bottom then 'middle' else 'bottom'
		@ctx.textAlign = align
		@ctx.fillText text, x, y

	_createTime: (val)->
		if val < 10 then "00#{val}" else if val < 100 then "0#{val}" else val

	_drawHints: (time)->

		@ctx.fillStyle = @c.normalDark
		top = @h/2
		mid = @rect.height/2
		bot = @rect.height-@h/2

		if !@is231
			@_text 'Counter', @o-@f*2, top, 'right'
			@_text @_createTime(time), @o-@f*2, bot, 'right', on, on

		@_text 'dB', @o-@f/2, mid, 'right'
		@_text 'L', @o-@f/2, top, 'right'
		@_text 'R', @o-@f/2, bot, 'right'

		@_text '-20', @o+@a*0.05, mid, 'center'
		@_text '10', @o+@a*0.17, mid, 'center'
		@_text '5', @o+@a*0.3, mid, 'center'
		@_text '3', @o+@a*0.47, mid, 'center'
		@_text '1', @o+@a*0.59, mid, 'center'
		@_text '0', @o+@a*0.69, mid, 'center'
		@_text '+1', @o+@a*0.75, mid, 'center'
		@_text '3', @o+@a*0.87, mid, 'center'
		@_text '6', @o+@a*0.95, mid, 'center'

	set: (val, time)->

		v = val*(@sectors / 150*10) / 10
		v1 = v*random 1, 1.02
		v2 = v*random 1, 1.02
		@ctx.clearRect 0, 0, @rect.width, @rect.height

		for i in [0...@sectors]
			color1 = (
				if i < @sectors*0.7
					if i > v1 then @c.normal else @c.normalDark
				else if i > v1 then @c.danger else @c.dangerDark
			)
			color2 = (
				if i < @sectors*0.7
					if i > v2 then @c.normal else @c.normalDark
				else if i > v2 then @c.danger else @c.dangerDark
			)
			@_shape i*@w+@o, 0, @w-@gutter, @h, color1
			if !@single
				@_shape i*@w+@o, @rect.height-@h, @w-@gutter, @h, color2

		if !@single then @_drawHints time

	###
		public methods
	###

	@