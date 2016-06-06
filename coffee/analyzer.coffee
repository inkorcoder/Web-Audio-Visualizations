class Analyzer

	constructor: (id, @callback)->

		@element = document.getElementById id
		@data = new Uint8Array 50
		@db = 0
		@fps = 30
		do @_create
		do @launch

	#  creating
	_create: ->

		@audioCtx = new (window.AudioContext || window.webkitAudioContext)()
		# get context from <audio> element
		@audioSrc = @audioCtx.createMediaElementSource @element
		@analyser = @audioCtx.createAnalyser()
		@analyser.fftSize = 2048
		# analyser connection
		@audioSrc.connect(@analyser)
		@audioSrc.connect(@audioCtx.destination)

	# getting current dB
	_getDB: ->

		res = 0
		freqs =
			low: @data[5] * ((@data[1] / 10) * (@data[1] / 10)) * 0.0008
			mid: @data[20]
		@db = (freqs.low*2 + freqs.mid)/2 * 0.55

	launch: ->

		(update = =>
			requestAnimFrame update
			@analyser.getByteFrequencyData @data
			do @_getDB
			@callback @data, @db, @element if @callback
		)()

	@