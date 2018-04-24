import React from 'react';
import renderer from 'react-test-renderer';
import puppeteer from 'puppeteer';
import App from '../App';

import { getStyles, getStaticMarkup } from '../../config/jest/testUtils';

let serializedCss;
let browser;
let page;
let errors = [];

beforeAll(async () => {
  serializedCss = getStyles();
  browser = await puppeteer.launch({});
  page = await browser.newPage();
  page.setViewport({
    width: 1280,
    height: 1024
  });
  page.on('pageerror', (e) => errors.push(e.text));
  // await page.goto('http://localhost:3000/');
});

describe('test App component', () => {

  test('render and match the snapshot', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('render full page, matching image screenshot', async () => {
    const markup = getStaticMarkup(serializedCss, App);
    await page.setContent(markup);
    // const html = await page.$eval('[data-testid="h1"]', e => e.innerHTML);
    
    // expect(html).toBe('Welcome to React');

    const image = await page.screenshot({
      fullPage: true,
    });
    expect(image).toMatchImageSnapshot();

  }, 16000);

});

afterAll(() => {
  browser.close();
  if (errors.length) {
    console.table(errors);
  }
});
