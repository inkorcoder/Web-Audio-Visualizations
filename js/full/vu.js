var VU;

VU = (function() {
  function VU(element, options) {
    this.element = element;
    this.options = options;
    this.canvas = this.element;
    this.is231 = this.options && this.options.type231;
    this.single = this.options && this.options.single;
    this._calc();
  }


  /*
  		private methods
   */

  VU.prototype._calc = function() {
    this.parentRect = this.canvas.parentNode.getBoundingClientRect();
    this.parentPadding = this.options ? this.options.parentPadding : 0;
    this.sectors = this.options ? this.options.sectors : 15;
    this.gutter = this.options ? this.options.gutter : 5;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.parentRect.width - (this.parentPadding * 2);
    this.canvas.height = this.parentRect.height - (this.parentPadding * 2);
    this.rect = this.canvas.getBoundingClientRect();
    this.o = this.rect.width * (!this.is231 && this.options && this.options.offset ? this.options.offset : 0);
    this.w = (this.rect.width - (this.o || 0)) / this.sectors;
    this.a = this.rect.width - (this.o || 0);
    this.h = !this.single ? (this.options ? this.options.height : 10) : this.rect.height;
    this.c = this.options.colors;
    return this.f = this.options && this.options.font ? this.options.font : 16;
  };

  VU.prototype._shape = function(x1, y1, w, h, fill) {
    var half;
    this.ctx.fillStyle = fill || '#000';
    if (this.is231) {
      return this.ctx.fillRect(x1, y1, w, h);
    } else {
      half = (w - w * 0.2) / 2;
      this.ctx.fillRect(x1, y1, half, h);
      return this.ctx.fillRect(x1 + half + w * 0.2, y1, half, h);
    }
  };

  VU.prototype._text = function(text, x, y, align, large, bottom) {
    this.ctx.font = (!large ? this.f : this.f * 2.5) + "px " + (!this.is231 ? 'Digital' : 'arial');
    this.ctx.textBaseline = !bottom ? 'middle' : 'bottom';
    this.ctx.textAlign = align;
    return this.ctx.fillText(text, x, y);
  };

  VU.prototype._createTime = function(val) {
    if (val < 10) {
      return "00" + val;
    } else if (val < 100) {
      return "0" + val;
    } else {
      return val;
    }
  };

  VU.prototype._drawHints = function(time) {
    var bot, mid, top;
    this.ctx.fillStyle = this.c.normalDark;
    top = this.h / 2;
    mid = this.rect.height / 2;
    bot = this.rect.height - this.h / 2;
    if (!this.is231) {
      this._text('Counter', this.o - this.f * 2, top, 'right');
      this._text(this._createTime(time), this.o - this.f * 2, bot, 'right', true, true);
    }
    this._text('dB', this.o - this.f / 2, mid, 'right');
    this._text('L', this.o - this.f / 2, top, 'right');
    this._text('R', this.o - this.f / 2, bot, 'right');
    this._text('-20', this.o + this.a * 0.05, mid, 'center');
    this._text('10', this.o + this.a * 0.17, mid, 'center');
    this._text('5', this.o + this.a * 0.3, mid, 'center');
    this._text('3', this.o + this.a * 0.47, mid, 'center');
    this._text('1', this.o + this.a * 0.59, mid, 'center');
    this._text('0', this.o + this.a * 0.69, mid, 'center');
    this._text('+1', this.o + this.a * 0.75, mid, 'center');
    this._text('3', this.o + this.a * 0.87, mid, 'center');
    return this._text('6', this.o + this.a * 0.95, mid, 'center');
  };

  VU.prototype.set = function(val, time) {
    var color1, color2, i, j, ref, v, v1, v2;
    v = val * (this.sectors / 150 * 10) / 10;
    v1 = v * random(1, 1.02);
    v2 = v * random(1, 1.02);
    this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);
    for (i = j = 0, ref = this.sectors; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      color1 = (i < this.sectors * 0.7 ? i > v1 ? this.c.normal : this.c.normalDark : i > v1 ? this.c.danger : this.c.dangerDark);
      color2 = (i < this.sectors * 0.7 ? i > v2 ? this.c.normal : this.c.normalDark : i > v2 ? this.c.danger : this.c.dangerDark);
      this._shape(i * this.w + this.o, 0, this.w - this.gutter, this.h, color1);
      if (!this.single) {
        this._shape(i * this.w + this.o, this.rect.height - this.h, this.w - this.gutter, this.h, color2);
      }
    }
    if (!this.single) {
      return this._drawHints(time);
    }
  };


  /*
  		public methods
   */

  VU;

  return VU;

})();