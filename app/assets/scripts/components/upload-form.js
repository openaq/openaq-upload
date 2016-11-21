'use strict';
import React from 'react';
import fileReaderStream from 'filereader-stream';
import validator from 'jsonschema';
import csv from 'csv-stream';

import measurementSchema from '../utils/measurement-schema';

import FailureModal from './failure-modal';
import SuccessModal from './success-modal';

var UploadForm = React.createClass({
  displayName: 'UploadForm',

  getInitialState: function () {
    return {
      errors: [],
      formFile: 'No file chosen',
      showModal: false
    };
  },

  logOutput: function (failures) {
    let errorText = '';
    failures.forEach((failure) => {
      errorText += `${failure}\n`;
    });
    this.setState({
      errors: errorText,
      showModal: true
    });
  },

  checkHeader: function (header, failures) {
    const required = [
      'parameter', 'unit', 'value', 'sourceName', 'sourceType',
      'date/utc', 'date/local', 'mobile', 'location', 'city', 'country'
    ];
    required.forEach((prop) => {
      if (!(prop in header)) failures.push(`Dataset is missing "${prop}" column.`);
    });
    if (failures.length) {
      this.logOutput(failures);
    }
  },

  parseCsv: function () {
    const csvStream = csv.createStream({delimiter: ',', endLine: '\n'});
    let failures = [];
    let line = 0;
    fileReaderStream(this.csvFile).pipe(csvStream)
      .on('error', (failure) => {
        failures.push(failure);
      })
      .on('data', (data) => {
        // Check for data;
        if (!data || data === {}) {
          failures = ['No data provided'];
          this.logOutput(failures);
        }
        // Check header on line 1
        if (line === 0) this.checkHeader(data, failures);
        line++;
        // Parse CSV
        let record = {};
        Object.keys(data).forEach((key) => {
          let value = data[key];
          // Numeric strings should be converted to numbers
          if (!isNaN(value)) value = Number(value);
          // Sub-keys will be indicated by a slash
          const splitKey = key.split('/');
          // Treat values attached to primary keys differently than those with subkeys
          if (splitKey.length === 1) {
            // The "mobile" attribute should be converted to boolean
            if (key === 'mobile' && isNaN(value)) {
              if (value.toLowerCase() === 'true') {
                value = true;
              } else if (value.toLowerCase() === 'false') {
                value = false;
              }
            }
            // Save value to record
            record[key] = value;
          // Treat values attached to subkeys differently than those attached to primary keys
          } else {
            const [key, subkey] = splitKey;
            // Treat attribution differently, as it is an array of name/url pairs
            if (key === 'attribution') {
              if (subkey === 'name' && isNaN(value)) {
                // Attribution arrays will be separated by a space-padded pipe character (|) in the csv.
                // URL order and number must match name order and number (if a URL isn't paired
                // with a name, the user will still need to provide a separator to skip it).
                // This is hard to represent in csv; we may be able to find a better way.
                const urls = data['attribution/url'].split('|');
                value = value.split('|').map((name, i) => {
                  const url = urls[i];
                  if (url.length) {
                    return {name: name, url: url};
                  }
                  return {name: name};
                });
                record[key] = value;
              }
            } else {
              // Add subkeys, if applicable
              if (key === 'date' && !record['date']) record['date'] = {};
              if (key === 'averagingPeriod' && !record['averagingPeriod']) record['averagingPeriod'] = {};
              if (key === 'coordinates' && !record['coordinates']) record['coordinates'] = {};
              // Dates are not a valid JSON type, so enforcing a particular format would be subjective.
              // We may change the schema to a regex string validator.
              if (key === 'date' && subkey === 'utc' && isNaN(value)) {
                value = new Date(value);
              }
              // Save value to record
              record[key][subkey] = value;
            }
          }
        });
        // Perform validation of the compiled object against the JSON schema file
        let v = validator.validate(record, measurementSchema);
        v.errors.forEach((e) => {
          failures.push(`Record ${line}: ${e.stack}`);
        });
      })
      .on('end', () => {
        this.logOutput(failures);
      });
  },

  getFile: function (event) {
    // Store file reference
    this.csvFile = event.target.files[0];
    this.setState({formFile: this.csvFile.name});
  },

  render: function () {
    const errors = this.state.errors;
    const showModal = this.state.showModal;
    return (
      <section className='fold' id='uploader'>
        {showModal ? <FailureModal errors={errors} /> : ''}
        {showModal ? <SuccessModal visible={showModal} errors={errors} csvFile={this.csvFile} /> : ''}
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>OpenAQ Uploader</h1>
            <div className='fold__introduction prose prose--responsive'>
              <p>Use this form to upload CSV data to OpenAQ</p>
            </div>
          </header>
          <div className='fold__body'>
            The CSV parser is able to recognize the following attribute names and characteristics:
            (An example schema should be included, potentially as a hidden-by-default accordian list)
          </div>

          <fieldset className='form__fieldset'>

            <div className='form__group'>
              <label className='form__label' htmlFor='form-input'>Please select a CSV file</label>
              <input type='file' className='form__control' id='form-file' accept='text/plain' onChange={this.getFile} />
              <div className='form__input-group'>
                <span className='form__input-group-button'><button type='submit' className='button button--base button--medium button--example-icon'><label htmlFor='form-file'>Choose File</label></button></span>
                <input type='text' className='form__control form__control--medium' id='form-input' placeholder={this.state.formFile} />
              </div>
            </div>

            <div className='form__group'>
              <label className='form__label' htmlFor='form-input'>Please enter you API token</label>
              <div className='form__input-group'>
                <input type='text' className='form__control form__control--medium' id='form-input' placeholder='Please enter your uploader API token' />
              </div>
            </div>

            <button className='button button--base' type='button' onClick={this.parseCsv}><span>Validate CSV</span></button>

          </fieldset>
        </div>
      </section>
    );
  }
});

module.exports = UploadForm;
