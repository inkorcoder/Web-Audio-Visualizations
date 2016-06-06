
/* ======================================================= */

/* vk audio visualizer */

/* inkor, 2016 */

/* ======================================================= */
var ANALYZER, analyser, interval, j, len, lines, radio, random, randomColor, ref, svgHeight, vu, vu2, vu3;

svgHeight = 40;

lines = [];

interval = 30;

analyser = null;

window.requestAnimFrame = (function() {
  return function(callback, element) {
    return window.setTimeout(callback, 1000 / interval);
  };
})();

random = function(min, max) {
  return Math.random() * (max - min) + min;
};

randomColor = function() {
  var color, i, letters;
  letters = '0123456789ABCDEF'.split('');
  color = '#';
  i = 0;
  while (i < 6) {
    color += letters[Math.floor(Math.random() * 16)];
    i++;
  }
  return color;
};


/* ======================================================== */

vu = new VU(document.getElementById('type1'), {
  parentPadding: 15,
  sectors: 15,
  height: 22,
  gutter: 6,
  offset: 0.3,
  colors: {
    normal: '#00362C',
    normalDark: '#6BEAD2',
    danger: '#23100C',
    dangerDark: '#f75'
  },
  font: 19
});

vu2 = new VU(document.getElementById('type2'), {
  parentPadding: 15,
  sectors: 15,
  height: 14,
  gutter: 2,
  offset: 0.3,
  type231: true,
  colors: {
    normal: '#020',
    normalDark: '#0f0',
    danger: '#200',
    dangerDark: '#f00'
  },
  font: 18
});

vu3 = new VU(document.getElementById('type3'), {
  parentPadding: 15,
  sectors: 1000,
  height: 14,
  gutter: 0,
  offset: 0.3,
  type231: true,
  single: true,
  colors: {
    normal: '#333',
    normalDark: '#eee',
    danger: '#222',
    dangerDark: '#bbb'
  },
  font: 18
});

ANALYZER = new Analyzer('html5_audio', function(data, db, audio) {
  vu.set(db, parseInt(audio.currentTime.toFixed(0)));
  vu2.set(db, parseInt(audio.currentTime.toFixed(0)));
  return vu3.set(db, parseInt(audio.currentTime.toFixed(0)));
});

ref = document.querySelectorAll('input[type="radio"]');
for (j = 0, len = ref.length; j < len; j++) {
  radio = ref[j];
  radio.addEventListener('click', function(e) {
    return document.getElementById('html5_audio').setAttribute('src', "audio/" + (this.getAttribute('data-track')));
  });
}

document.getElementById('fps').innerHTML = interval;

document.getElementById('plus').addEventListener('click', function(e) {
  if (interval < 100) {
    interval += 10;
  }
  return document.getElementById('fps').innerHTML = interval;
});

document.getElementById('minus').addEventListener('click', function(e) {
  if (interval > 10) {
    interval -= 10;
  }
  return document.getElementById('fps').innerHTML = interval;
});

window.onresize = function() {
  vu._calc();
  vu2._calc();
  return vu3._calc();
};
