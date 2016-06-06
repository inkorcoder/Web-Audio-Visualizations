var generateSVGLines, getAudioContext;

window.requestAnimFrame = (function() {
  return function(callback, element) {
    return window.setTimeout(callback, 1000 / 30);
  };
})();

generateSVGLines = function() {
  var bodySelection, d, i, line, svgSelection;
  bodySelection = d3.select(".visualizer-container");
  svgSelection = bodySelection.append("svg").attr("width", 200).attr("height", svgHeight);
  for (d = i = 0; i < 50; d = ++i) {
    line = svgSelection.append('svg:line').attr('x1', 0).attr('x2', 0).attr('y1', svgHeight / 2).attr('y2', svgHeight / 2).attr('stroke', '#fff').attr('stroke-width', 2);
    lines.push(line);
  }
};

getAudioContext = function() {
  var analyser, audioCtx, audioElement, audioSrc;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioElement = document.getElementById('html5_audio');
  audioElement.setAttribute('crossorigin', "anonymous");
  audioSrc = audioCtx.createMediaElementSource(audioElement);
  analyser = audioCtx.createAnalyser();
  audioSrc.connect(analyser);
  return audioSrc.connect(audioCtx.destination);
};
