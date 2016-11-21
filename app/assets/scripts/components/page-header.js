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
                <p>We're building the world's first open platform that provides programmatic
                real-time and historical access to air quality data from around the globe.</p>
              </div>
            </div>
          </header>
        </div>
    );
  }
});

module.exports = PageHeader;
