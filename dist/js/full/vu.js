var VU;

VU = (function() {

  /*
  		construcctor [
  			{type}:string 		=> '231' ('Маяк - 231')
  												=> 'romantica' ('Романтика 222')
  			{options}:object	=> {gutter}:number (Indents between two sectors)
  												=>
  												=>
  												=>
  		]
   */
  function VU(element, options) {
    this.element = element;
    this.options = options;
    this.sectorsCount = this.options.sectors || 13;
    this.gutter = this.options.gutter || 2;
    this.isRendering = this.options.startRender || true;
    this.offset = this.options.offset || 20;
    this.colors = {
      normal: this.options.colors.normal || 'rgba(50,250,50,1)',
      normalDarken: this.options.colors.normalDarken || 'rgba(50,250,50,.2)',
      danger: this.options.colors.danger || 'rgba(255,50,50,1)',
      dangerDarken: this.options.colors.dangerDarken || 'rgba(255,50,50,.2)'
    };
    this.font = this.options.font || 9;
    this.svg = d3.select(".visualizer-container").append("svg");
    this._getAudioContext();
    this._calculateRects();
    this._describeSectors();
    this._describeText();
  }


  /*
  		private methods
   */

  VU.prototype._calculateRects = function() {
    this.rect = this.svg[0][0].getBoundingClientRect();
    return this.sectorsHeight = this.rect.height * (this.options.sectorHeight || 0.1);
  };

  VU.prototype._describeSectors = function() {
    var g, height, i, j, k, len, ref, ref1, sector;
    this.groups = [this.svg.append('svg:g'), this.svg.append('svg:g')];
    sector = (this.rect.width - this.offset) / this.sectorsCount;
    height = this.rect.height - this.sectorsHeight * 3;
    ref = [0, 1];
    for (j = 0, len = ref.length; j < len; j++) {
      g = ref[j];
      for (i = k = 0, ref1 = this.sectorsCount; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        this.groups[g].append('svg:path').attr('d', "M" + ((i * sector) + this.offset) + "," + (this.sectorsHeight + height * g) + " L" + ((i * sector) + this.offset + sector - this.gutter) + "," + (this.sectorsHeight + height * g) + " L" + ((i * sector) + this.offset + sector - this.gutter) + "," + (this.sectorsHeight + height * g + this.sectorsHeight) + " L" + ((i * sector) + this.offset) + "," + (this.sectorsHeight + height * g + this.sectorsHeight) + " Z").attr('fill', "" + (i < 11 ? this.colors.normalDarken : this.colors.dangerDarken));
      }
    }
  };

  VU.prototype._text = function(group, text, pos, isEnd, align) {
    return group.append('svg:text').text(text).attr("x", pos.x).attr("y", pos.y).attr("text-anchor", (isEnd === true ? 'end' : (isEnd === false ? 'middle' : ''))).attr('alignment-baseline', align ? align : '').attr('fill', text.indexOf('+') !== -1 ? this.colors.danger : this.colors.normal).attr("font-family", "sans-serif").attr("font-size", this.font + "px");
  };

  VU.prototype._describeText = function() {
    var f, g, h, o, s, w;
    g = this.svg.append('svg:g');
    o = this.offset;
    w = this.rect.width;
    h = this.rect.height;
    s = this.sectorsHeight;
    f = this.font;
    this._text(g, 'dB', {
      x: this.offset / 2,
      y: h / 2
    }, false, 'central');
    this._text(g, 'L', {
      x: this.offset / 2,
      y: s + s / 2
    }, false, 'central');
    this._text(g, 'R', {
      x: this.offset / 2,
      y: h - (s + s / 2)
    }, false, 'central');
    this._text(g, '-20', {
      x: o,
      y: h / 2
    }, null, 'central');
    this._text(g, '-15', {
      x: o + w * 0.13,
      y: h / 2
    }, null, 'central');
    this._text(g, '-10', {
      x: o + w * 0.27,
      y: h / 2
    }, null, 'central');
    this._text(g, '-6', {
      x: o + w * 0.4,
      y: h / 2
    }, null, 'central');
    this._text(g, '-3', {
      x: o + w * 0.5,
      y: h / 2
    }, null, 'central');
    this._text(g, '0', {
      x: o + w * 0.6,
      y: h / 2
    }, null, 'central');
    this._text(g, '+2', {
      x: o + w * 0.76,
      y: h / 2
    }, true, 'central');
    return this._text(g, '+4', {
      x: w - 2,
      y: h / 2
    }, true, 'central');
  };

  VU.prototype._getAudioContext = function() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.audioSrc = this.audioCtx.createMediaElementSource(this.element);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    if (!this.options.smooth) {
      this.analyser.smoothingTimeConstant = false;
    }
    this.audioSrc.connect(this.analyser);
    return this.audioSrc.connect(this.audioCtx.destination);
  };

  VU.prototype._getDB = function() {
    var freqs, res;
    res = 0;
    freqs = {
      low: frequencyData[5] * ((frequencyData[1] / 10) * (frequencyData[1] / 10)) * 0.0008,
      mid: frequencyData[20]
    };
    return (freqs.low * 2 + freqs.mid) / 2 * 0.55;
  };


  /*
  		public methods
   */

  VU.prototype.startRender = function() {
    return this.isRendering = true;
  };

  VU.prototype.pauseRender = function() {
    return this.isRendering = false;
  };

  VU.prototype.stopRender = function() {
    this.isRendering = false;
    return this.set(0);
  };

  VU.prototype.set = function(val) {
    var g, i, j, len, p, r, ref, results, sectors, v;
    v = val * (this.sectorsCount / 150 * 10) / 10;
    sectors = this.sectorsCount;
    ref = [0, 1];
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      g = ref[j];
      r = v * random(1, 1.04);
      results.push((function() {
        var k, len1, ref1, results1;
        ref1 = this.groups[g][0][0].childNodes;
        results1 = [];
        for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
          p = ref1[i];
          results1.push(d3.select(p).attr('fill', "" + (i < sectors - sectors / 3 ? (i < r ? this.colors.normal : this.colors.normalDarken) : (i < r ? this.colors.danger : this.colors.dangerDarken))));
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  VU.prototype.render = function() {
    var renderChart;
    return (renderChart = (function(_this) {
      return function() {
        requestAnimFrame(renderChart);
        if (_this.isRendering) {
          _this.analyser.getByteFrequencyData(frequencyData);
          return _this.set(_this._getDB());
        }
      };
    })(this))();
  };

  VU.prototype.destroy = function() {
    this.audioSrc.disconnect();
    return this.svg[0][0].parentNode.removeChild(this.svg[0][0]);
  };

  VU;

  return VU;

})();
