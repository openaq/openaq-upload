import React from 'react';
import { calcDateRange, uniqueValues } from '../utils/calculations';

var SubmissionForm = React.createClass({
  displayName: 'SubmissionForm',

  propTypes: {
    metadata: React.PropTypes.object
  },

  submit: function () {

  },

  render: function () {
    const metadata = this.props.metadata;
    return (
      <section className='inner'>
        <div>
          <h3>Congratulations, your data passed validation!</h3>
          <p>Click below to upload the CSV file to OpenAQ. New data will typically
          be integrated with the public results within 30 minutes of submission.</p>
          <p>Thank you for your contribution.</p>
        </div>
        <ul className='modal__ul--col1'>
          <li className='modal__li--col1'>Location: {metadata.location}</li>
          <li className='modal__li--col1'>City: {metadata.city}</li>
          <li className='modal__li--col1'>Country: {metadata.country}</li>
          </ul>
        <ul className='modal__ul--col2'>
          <li className='modal__li--col2'>Measurements: {metadata.measurements}</li>
          <li className='modal__li--col2'>Values: {uniqueValues(metadata.values)}</li>
          <li className='modal__li--col2'>Collection Dates: {calcDateRange(metadata.dates)}</li>
        </ul>
        <div className='form__buttons'>
          <button className='button button--primary button--submit' type='submit'><span>Submit</span></button>
          <button className='button button--primary-bounded button--submit' type='button'><span>Cancel</span></button>
        </div>
      </section>
    );
  }
});

module.exports = SubmissionForm;
