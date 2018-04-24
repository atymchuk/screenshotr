const animationOffCss = `
  *, *::after, *::before {
    transition-delay: 0s !important;
    transition-duration: 0s !important;
  }
  *, *::after, *::before {
    animation-delay: -0.0001s !important;
    animation-duration: 0s !important;
    animation-play-state: paused !important;
  }
  *, *::after, *::before {
    caret-color: transparent !important;
  }  
`;

module.exports = function prependCSS(data, filename) {
  return animationOffCss;
};
