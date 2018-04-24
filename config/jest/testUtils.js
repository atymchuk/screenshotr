import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';

import * as pkg from '../../package.json';
const { TMP_STYLES_FILE } = pkg.jest.globals;

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

const htmlTemplate = (html, styles) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${animationOffCss}</style>
      <style>${styles}</style>
    </head>
    <body>${html}</body>
  </html> 
`;

export function getStaticMarkup(serializedCss, Component) {
  const html = ReactDOMServer.renderToStaticMarkup(<Component />);
  const css = global.includedCssModules
    .reduce((acc, path) => acc + (serializedCss[path] || ''), '');

  return htmlTemplate(html, css);
}

export function getStyles() {
  let serializedCss;

  try {
    serializedCss = JSON.parse(fs.readFileSync(TMP_STYLES_FILE, 'utf8'));
  } catch (error) {
    serializedCss = {};
  }

  return serializedCss;
}