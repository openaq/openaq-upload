'use strict';
import React from 'react';
import fileReaderStream from 'filereader-stream';
import validator from 'jsonschema';
import csv from 'csv-stream';

import measurementSchema from '../utils/measurement-schema';
import { getSignedUrl } from '../utils/s3-upload';
import { calcDateRange, uniqueValues, mostFrequentString } from '../utils/calculations';

var UploadForm = React.createClass({
  displayName: 'UploadForm',

  getInitialState: function () {
    return {
      status: 'initial',
      token: '',
      formFile: 'Choose File to Upload',
      metadata: {},
      errors: [],
      response: {
        code: '',
        text: ''
      }
    };
  },

  setErrorState: function (failures, metadata) {
    if (failures.length) {
      this.setState({
        status: 'verifyErr',
        metadata: metadata,
        errors: failures});
    } else {
      this.setState({
        status: 'verifySucc',
        metadata: metadata,
        errors: failures});
    }
    return;
  },

  checkHeader: function (header) {
    const required = [
      'parameter', 'unit', 'value', 'sourceName', 'sourceType',
      'date/utc', 'date/local', 'mobile', 'location', 'city', 'country'
    ];
    let failures = [];
    required.forEach((prop) => {
      if (!(prop in header)) failures.push(`Dataset is missing "${prop}" column.`);
    });
    return failures;
  },

  parseCsv: function () {
    if (this.csvFile) {
      const csvStream = csv.createStream({delimiter: ',', endLine: '\n'});
      let metadata = {};
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
            this.setErrorState(failures);
          }
          // Check header on first line
          if (line === 0 && !failures.length) {
            failures = failures.concat(this.checkHeader(data));
            if (failures.length) this.setErrorState(failures);
          }
          // Parse CSV
          if (!failures.length) {
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
            if (line === 0) {
              // Initialize metadata object on first line
              metadata.location = [];
              metadata.city = [];
              metadata.country = [];
              metadata.dates = {};
              metadata.values = {};
            }
            // Add array information to metadata
            metadata.location.push(record.location);
            metadata.city.push(record.city);
            metadata.country.push(record.country);
            metadata.dates[record.date.local] = true;
            metadata.values[record.parameter] = true;

            line++;
          }
        })
        .on('end', () => {
          metadata.measurements = line;
          this.setErrorState(failures, metadata);
        });
    }
  },

  getFile: function (event) {
    // Store file reference
    this.csvFile = event.target.files[0];
    this.setState({
      formFile: this.csvFile.name,
      status: 'initial',
      metadata: {},
      errors: []
    });
  },

  setToken: function (event) {
    this.setState({token: event.target.value});
  },

  renderInitial: function () {
    const errors = this.state.errors;
    let errorText = '';
    errors.forEach((error) => {
      errorText += `${error}\n`;
    });
    const errorMsg = errors.length
      ? <div className='form__group'>
          <p className='error'><b>{errors.length}</b> errors found in {this.csvFile.name}</p>
          <textarea className='form__control' id='form-textarea' rows='7' defaultValue={errorText}></textarea>
        </div>
      : '';
    return (
      <div className='inner'>
        <fieldset className='form__fieldset'>

          <div className='form__group form__group--token'>
            <label className='form__label' htmlFor='key-input'>Please enter your API token</label>
            <p><a href='mailto:info@openaq.org'>Don't have a key? Email us to request one.</a></p>
            <div className='form__input-group'>
              <input type='text' required className='form__control form__control--medium' id='key-input' placeholder='Enter Key' onChange={((e) => this.setToken(e))} />
            </div>
          </div>

          <div className='form__group form__group--upload'>
            <label className='form__label' htmlFor='file-input'>Upload Data</label>
            <p>We only accept CSV files at this time.</p>
            <input type='file' className='form__control--upload' id='form-file' ref='file' accept='text/plain' onChange={this.getFile} />
            <div className='form__input-group'>
              <span className='form__input-group-button'>
                <button type='submit' className='button button--base button--text-hidden button--medium button--arrow-up-icon' onClick={() => this.refs.file.click()}></button>
              </span>
              <input type='text' readOnly className='form__control form__control--medium' value={this.state.formFile} />
            </div>
          </div>

          {errorMsg}
          <button className='button button--primary button--verify' type='button' onClick={this.parseCsv}><span>Verify</span></button>

        </fieldset>
      </div>
    );
  },

  submit: function () {
    const component = this;
    getSignedUrl(component.state.formFile, component.state.token).then(function (credentials) {
      let url = credentials.results.presignedURL;
      console.log(url);
      fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'text/csv'},
        preambleCRLF: true,
        postambleCRLF: true,
        body: component.csvFile
      }).then((response) => {
        response.status === 200
          ? component.setState({status: 'finished'})
          : component.setState({
            status: 'serverErr',
            response: {
              code: response.status,
              text: response.statusText
            }
          });
      });
    });
  },

  cancel: function () {
    this.setState({status: 'initial'});
  },

  renderVerifySuccess: function () {
    const metadata = this.state.metadata;
    return (
      <section className='inner'>
        <div>
          <h2>Upload Verification</h2>
        </div>
        <ul className='form__ul--col1'>
          <li><b>Location:</b> {mostFrequentString(metadata.location)}</li>
          <li><b>City:</b> {mostFrequentString(metadata.city)}</li>
          <li><b>Country:</b> {mostFrequentString(metadata.country)}</li>
          </ul>
        <ul className='form__ul--col2'>
          <li><b>Measurements:</b> {metadata.measurements}</li>
          <li><b>Values:</b> {uniqueValues(metadata.values)}</li>
          <li><b>Collection Dates:</b> {calcDateRange(metadata.dates)}</li>
        </ul>
        <div className='form__buttons'>
          <button className='button button--primary button--submit' onClick={(() => this.submit())} type='submit'><span>Submit</span></button>
          <button className='button button--primary-bounded button--submit' type='button' onClick={(() => this.cancel())}><span>Cancel</span></button>
        </div>
      </section>
    );
  },

  renderSuccess: function () {
    return (
      <section className='inner success'>
        <h2>Thanks for contributing data to OpenAQ.</h2>
        <p className='result__message'>Please check your email for confirmation. This could take up to 15 minutes.</p>
        <p className='result__message--small'>Didn’t get an email? <a href='mailto:info@openaq.org'>Contact Us.</a></p>
        <button className='button button--primary button--submit' onClick={(() => this.cancel())} type='submit'><span>Submit Another Dataset</span></button>
      </section>
    );
  },

  renderServerErr: function () {
    const err = this.state.response;
    return (
      <section className='inner failure'>
        <h2>Uploader Error</h2>
        <p className='result__message'>Your data passed validation, but was rejected by the server.</p>
        <p className='result__message--small'>The server responded with error code {err.code}: {err.text}.</p>
        <p className='result__message--small'>Please <a href='mailto:info@openaq.org'>Contact Us</a> to report the issue.</p>
        <div className='form__buttons'>
          <button className='button button--primary button--submit' onClick={(() => this.submit())} type='submit'><span>Try Again</span></button>
          <button className='button button--primary-bounded button--submit' type='button' onClick={(() => this.cancel())}><span>Cancel</span></button>
        </div>
      </section>
    );
  },

  render: function () {
    let status = this.state.status;
    return (
      <section className='fold' id='uploader'>
        <div className='exhibit'>
          <div className="exhibit__content">
            {status === 'initial' || status === 'verifyErr' ? this.renderInitial() : null}
            {status === 'verifySucc' ? this.renderVerifySuccess() : null}
            {status === 'serverErr' ? this.renderServerErr() : null}
            {status === 'finished' ? this.renderSuccess() : null}
          </div>
        </div>
      </section>
    );
  }
});

module.exports = UploadForm;
