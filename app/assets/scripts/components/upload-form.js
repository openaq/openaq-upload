'use strict';
import React from 'react';

var UploadForm = React.createClass({
  displayName: 'Uploader',

  render: function () {
    return (
      <section className='fold' id='status__api'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>OpenAQ Uploader</h1>
            <div className='fold__introduction prose prose--responsive'>
              <p>Use this form to upload CSV data to OpenAQ</p>
            </div>
          </header>
          <div className='fold__body'>
            The CSV parser is able to recognize the following attribute names and characteristics:
          </div>
        </div>
      </section>
    );
  }
});

module.exports = UploadForm;
