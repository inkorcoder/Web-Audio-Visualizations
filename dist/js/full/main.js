
/* ======================================================= */

/* vk audio visualizer */

/* inkor, 2016 */

/* ======================================================= */
var analyser, container, frequencyData, i, len, lines, radio, random, ref, svgHeight, vu;

svgHeight = 40;

lines = [];

frequencyData = new Uint8Array(50);

analyser = null;

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
    return window.setTimeout(callback, 1000 / 60);
  };
})();

random = function(min, max) {
  return Math.random() * (max - min) + min;
};


/* ======================================================== */

container = document.createElement('div');

container.className = 'visualizer-container';

document.body.insertBefore(container, document.body.firstChild);

if (location.pathname === "/index.html" || location.pathname === "") {
  vu = new VU(document.getElementById('html5_audio'), {
    gutter: 2,
    sectors: 70,
    sectorHeight: 0.15,
    colors: {
      normal: '#0f0',
      normalDarken: '#040',
      danger: '#f00',
      dangerDarken: '#400'
    },
    smooth: true,
    offset: 20,
    font: 9
  });
  vu.render();
}

if (location.pathname === "/mode2.html") {
  vu = new VU(document.getElementById('html5_audio'), {
    gutter: 2,
    sectors: 15,
    sectorHeight: 0.13,
    colors: {
      normal: '#0f0',
      normalDarken: '#040',
      danger: '#f00',
      dangerDarken: '#400'
    },
    smooth: true,
    offset: 20,
    font: 10
  });
  vu.render();
}

if (location.pathname === '/analog.html') {
  vu = new ANALOG(document.getElementById('html5_audio'), {
    gutter: 2,
    sectors: 15,
    sectorHeight: 0.13,
    colors: {
      normal: '#0f0',
      normalDarken: '#040',
      danger: '#f00',
      dangerDarken: '#400'
    },
    smooth: true,
    offset: 20,
    font: 10
  });
  vu.render();
}

ref = document.querySelectorAll('input[type="radio"]');
for (i = 0, len = ref.length; i < len; i++) {
  radio = ref[i];
  radio.addEventListener('click', function(e) {
    return document.getElementById('html5_audio').setAttribute('src', "audio/" + (this.getAttribute('data-track')));
  });
}

document.getElementById('start').addEventListener('click', function(e) {
  return vu.startRender();
});

document.getElementById('pause').addEventListener('click', function(e) {
  return vu.pauseRender();
});

document.getElementById('stop').addEventListener('click', function(e) {
  return vu.stopRender();
});
