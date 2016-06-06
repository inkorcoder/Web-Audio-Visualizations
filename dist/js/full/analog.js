var ANALOG;

ANALOG = (function() {
  function ANALOG(element, options) {
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
    this.svg = [];
    this.svg[0] = d3.select(".visualizer-container").append("svg").attr('class', 'analog');
    this.svg[1] = d3.select(".visualizer-container").append("svg").attr('class', 'analog');
    this.arrows = [];
    this.points = [[-30, -29.5], [-26.5, -27], [-13.5, -14], [-3.5, -4], [2.5, 3], [9.5, 10], [16.5, 17], [29.5, 30]];
    this.over = [];
    this._getAudioContext();
    this._calculateRects();
    this._createAnalog();
    this._describeText();
  }


  /*
  		private methods
   */

  ANALOG.prototype._calculateRects = function() {
    this.rect = this.svg[0][0][0].getBoundingClientRect();
    return this.sectorsHeight = this.rect.height * (this.options.sectorHeight || 0.1);
  };

  ANALOG.prototype._getAudioContext = function() {
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

  ANALOG.prototype._getDB = function() {
    var freqs, res;
    res = 0;
    freqs = {
      low: frequencyData[5] * ((frequencyData[1] / 10) * (frequencyData[1] / 10)) * 0.0008,
      mid: frequencyData[20]
    };
    return (freqs.low * 2 + freqs.mid) / 2 * 0.55;
  };

  ANALOG.prototype._polarToCartesian = function(cx, cy, r, angle) {
    angle = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  ANALOG.prototype._point = function(start, end, a, small) {
    return this.svg[a].append('path').attr('d', "" + (this._describeSector(this.rect.width / 2, this.rect.height * 2, 104, (small ? 106 : 110), start, end))).attr('fill', start < 9.5 ? this.colors.normal : this.colors.danger);
  };

  ANALOG.prototype._createAnalog = function() {
    var a, i, j, len, len1, p, ref, ref1, results;
    ref = [0, 1];
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      a = ref[i];
      ref1 = this.points;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        p = ref1[j];
        this._point(p[0], p[1], a);
      }
      this._point(this.points[0][0], this.points[4][1], a, true);
      this._point(this.points[5][0], this.points[7][1], a, true);
      this.arrows[a] = this.svg[a].append('path').attr('d', "M" + (this.rect.width / 2 - 1) + ",25 L" + (this.rect.width / 2 + 0.1) + ",25 L" + (this.rect.width / 2 + 0.1) + "," + (this.rect.height - this.sectorsHeight) + " L" + (this.rect.width / 2 - 1) + "," + (this.rect.height - this.sectorsHeight) + " Z").attr('fill', '#fff').attr('transform', "rotate(-30, " + (this.rect.width / 2) + ", " + (this.rect.height * 2) + ")");
      results.push(this.over[a] = this.svg[a].append('circle').attr('cx', this.rect.width - 15).attr('cy', 15).attr('r', 5).attr('fill', this.colors.dangerDarken));
    }
    return results;
  };

  ANALOG.prototype._describeArc = function(x, y, r, startAngle, endAngle, continueLine) {
    var alter, end, large, start;
    start = this._polarToCartesian(x, y, r, startAngle %= 360);
    end = this._polarToCartesian(x, y, r, endAngle %= 360);
    large = Math.abs(endAngle - startAngle) >= 180;
    alter = endAngle > startAngle;
    return '' + (continueLine ? 'L' : 'M') + start.x + ',' + start.y + ' A' + r + ',' + r + ',0, ' + (large ? 1 : 0) + ', ' + (alter ? 1 : 0) + ',' + end.x + ',' + end.y;
  };

  ANALOG.prototype._describeSector = function(x, y, r, r2, startAngle, endAngle) {
    return '' + this._describeArc(x, y, r, startAngle, endAngle) + ' ' + this._describeArc(x, y, r2, endAngle, startAngle, true) + 'Z';
  };

  ANALOG.prototype._text = function(group, text, pos, isEnd, align) {
    return group.append('svg:text').text(text).attr("x", pos.x).attr("y", pos.y).attr("text-anchor", (isEnd === true ? 'end' : (isEnd === false ? 'middle' : ''))).attr('alignment-baseline', align ? align : '').attr('fill', isEnd ? this.colors.danger : this.colors.normal).attr("font-family", "sans-serif").attr("font-size", this.font + "px");
  };

  ANALOG.prototype._describeText = function() {
    var a, g, i, len, ref, results;
    ref = [0, 1];
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      a = ref[i];
      g = this.svg[a].append('svg:g');
      this._text(g, '20', {
        x: 10,
        y: 25 + 10
      }, false, 'central');
      this._text(g, '10', {
        x: 40,
        y: 13 + 10
      }, false, 'central');
      this._text(g, '3', {
        x: 63,
        y: 10 + 10
      }, false, 'central');
      this._text(g, '1', {
        x: 76,
        y: 10 + 10
      }, false, 'central');
      this._text(g, '0', {
        x: 96,
        y: 11 + 10
      }, true, 'central');
      this._text(g, '1', {
        x: 111,
        y: 15 + 10
      }, true, 'central');
      this._text(g, '3', {
        x: 130,
        y: 25 + 10
      }, true, 'central');
      this._text(g, '+', {
        x: 135,
        y: 50 + 5
      }, true, 'central');
      this._text(g, '-', {
        x: 10,
        y: 50 + 5
      }, false, 'central');
      results.push(this._text(g, 'dB', {
        x: this.rect.width / 2,
        y: 50 + 5
      }, false, 'central'));
    }
    return results;
  };


  /*
  		public methods
   */

  ANALOG.prototype.startRender = function() {
    return this.isRendering = true;
  };

  ANALOG.prototype.pauseRender = function() {
    return this.isRendering = false;
  };

  ANALOG.prototype.stopRender = function() {
    this.isRendering = false;
    return this.set(0);
  };

  ANALOG.prototype.set = function(val) {
    var g, i, len, r, ref, results, sectors, v;
    v = val / 2.3;
    sectors = this.sectorsCount;
    ref = [0, 1];
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      g = ref[i];
      r = v * random(1, 1.1);
      this.arrows[g].attr('transform', "rotate(" + (-30 + v) + ", " + (this.rect.width / 2) + ", " + (this.rect.height * 2) + ")");
      results.push(this.over[g].attr('fill', v < 55 ? this.colors.dangerDarken : this.colors.danger));
    }
    return results;
  };

  ANALOG.prototype.render = function() {
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

  ANALOG;

  return ANALOG;

})();
