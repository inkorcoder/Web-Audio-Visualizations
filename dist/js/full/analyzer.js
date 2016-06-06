var Analyzer;

Analyzer = (function() {
  function Analyzer(id, callback) {
    this.callback = callback;
    this.element = document.getElementById(id);
    this.data = new Uint8Array(50);
    this.db = 0;
    this.fps = 30;
    this._create();
    this.launch();
  }

  Analyzer.prototype._create = function() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.audioSrc = this.audioCtx.createMediaElementSource(this.element);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.audioSrc.connect(this.analyser);
    return this.audioSrc.connect(this.audioCtx.destination);
  };

  Analyzer.prototype._getDB = function() {
    var freqs, res;
    res = 0;
    freqs = {
      low: this.data[5] * ((this.data[1] / 10) * (this.data[1] / 10)) * 0.0008,
      mid: this.data[20]
    };
    return this.db = (freqs.low * 2 + freqs.mid) / 2 * 0.55;
  };

  Analyzer.prototype.launch = function() {
    var update;
    return (update = (function(_this) {
      return function() {
        requestAnimFrame(update);
        _this.analyser.getByteFrequencyData(_this.data);
        _this._getDB();
        if (_this.callback) {
          return _this.callback(_this.data, _this.db, _this.element);
        }
      };
    })(this))();
  };

  Analyzer;

  return Analyzer;

})();