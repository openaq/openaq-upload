'use strict';
import React from 'react';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  render: function () {
    return (
      <div>
        <header className='page__header' role='banner'>
          <div className='inner'>
            <div className='page__headline'>
              <h1 className='page__title'>
                <a href='https://openaq.org' title='Visit homepage'>
                  <img src='assets/graphics/layout/logo.svg' alt='OpenAQ logotype' height='48' />
                  <span>OpenAQ</span>
                </a>
              </h1>
            </div>
          </div>
        </header>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Upload Data</h1>
              </div>
              <div className='inpage__introduction'>
                <p>Have data to contribute to the platform? Reach out to us to get a key and you can share your government-level or research-grade data with the world.</p>
              </div>
            </div>
          </header>
        </div>
    );
  }
});

module.exports = PageHeader;
