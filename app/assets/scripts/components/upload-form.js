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

          <fieldset className='form__fieldset'>

            <div className='form__group'>
              <label className='form__label' htmlFor='form-input'>API Token</label>
              <div className='form__input-group'>
                <input type='text' className='form__control form__control--medium' id='form-input' placeholder='Please enter your uploader API token' />
              </div>
            </div>

            <div className='form__group'>
              <label className='form__label' htmlFor='form-file'>Please select a CSV file</label>
              <input type='file' className='form__control' id='form-file' />
            </div>

            <div className='form__group'>
              <label className='form__label' htmlFor='form-textarea'>Error messages</label>
              <textarea className='form__control' id='form-textarea' rows='4' placeholder='Error messages will appear here, if applicable'></textarea>
            </div>

            <button className='button button--base' type='button'><span>Submit CSV</span></button>

          </fieldset>
        </div>
      </section>
    );
  }
});

module.exports = UploadForm;
