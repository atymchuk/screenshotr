import React from 'react';
import ReactDOMServer from 'react-dom/server';
import renderer from 'react-test-renderer';
import App from './App';

describe('test App component', () => {

  it('renders correctly, matching the snapshot', () => {
    const tree = renderer
      .create(<App />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders with SSR', () => {
    const html = ReactDOMServer.renderToStaticMarkup(<App />);
    console.log(html);
  });

});
