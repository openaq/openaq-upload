'use strict';
import React from 'react';

var InstructionModal = React.createClass({
  displayName: 'InstructionModal',

  render: function () {
    return (
      <section className='modal modal--medium'>
        <div className='modal__inner'>
          <header className='modal__header'>
            <div className='modal__headline'>
              <p className='modal__subtitle'>Submission Guidelines</p>
              <h1 className='modal__title'>OpenAQ CSV Schema</h1>
            </div>
          </header>
          <div className='modal__body'>
            <div className='prose'>
            <p>The OpenAQ uploader tool provides an ingestion point for bulk air quality sensor readings in Comma-Separated-Values (CSV) format.
            In order to pass validation and enter the system, the data must adhere to the specific schema described below.</p>
            <p>We'll try to tell you where things went wrong in the event that a submission doesn't pass validation, but please don't hesitate to
            <a href='mailto:info@openaq.org'>contact us</a> for help if there is still confusion.</p>
            <p>Thanks for sharing!</p>
              <h3 className='heading-deco'>Required Columns</h3>
              <dl>
                <dt>parameter</dt>
                <dd><b>Only the following values are permitted:</b> pm25, pm10, no2, so2, o3, co, bc</dd>
                <dt>unit</dt>
                <dd><b>Only the following values are permitted:</b> ug/m^3, ppm</dd>
                <dt>value</dt>
                <dd>A number representing the particle count</dd>
                <dt>sourceName</dt>
                <dd>A text string representing the source's name</dd>
                <dt>sourceType</dt>
                <dd><b>Only the following values are permitted:</b> government, research, other</dd>
                <dt>attribution/name</dt>
                <dd>A list of 1 or more strings, separated by the | character</dd>
                <dt>date/utc</dt>
                <dd>UTC time, in the format 2016-11-29T17:30:00</dd>
                <dt>date/local</dt>
                <dd>UTC time, in the format 2016-11-29T17:30:00-05:00, where -05:00 represents the local timezone's offset</dd>
                <dt>mobile</dt>
                <dd><b>Only the following values are permitted:</b> true, false</dd>
                <dt>location</dt>
                <dd>A string of text describing the measurement's location</dd>
                <dt>city</dt>
                <dd>A string of text describing the measurement's city</dd>
                <dt>country</dt>
                <dd>The two-character ISO Alpha-2 country code describing the measurement's country</dd>
              </dl>
              <h3 className='heading-deco'>Optional Columns:</h3>
              <dl>
                <dt>averagingPeriod/value</dt>
                <dd>If applicable, a number representing the averaging period of the measurement in hours</dd>
                <dt>averagingPeriod/unit</dt>
                <dd><b>Only the following value is permitted:</b> hours</dd>
                <dt>attribution/url</dt>
                <dd>If applicable, a list of 1 or more URLS associated with the values in attribution/name, separated by the | character. If a particular attribution name is missing a URL, the association can be skipped by inserting another | character</dd>
                <dt>coordinates/latitude</dt>
                <dd>A number between -90 and 90 representing the latitude of the measurement's location</dd>
                <dt>coordinates/longitude</dt>
                <dd>A number between -180 and 180 representing the longitude of the measurement's location</dd>
              </dl>
            </div>
          </div>
          <footer className='modal__footer'>
            <a className='button button--primary button--large' role='button'><span>Dismiss</span></a>
          </footer>
        </div><button className='modal__button-dismiss' title='Close'><span>Dismiss</span></button>
      </section>
    );
  }
});

module.exports = InstructionModal;
