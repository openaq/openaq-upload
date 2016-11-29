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
              <p className='modal__subtitle'>Modal subtitle</p>
              <h1 className='modal__title'>This is the modal title</h1>
            </div>
          </header>
          <div className='modal__body'>
            <div className='prose'>
              <h3 className='heading-deco'>Required Columns</h3>
              <ul>
                <li><h4>parameter</h4></li>
                <li className='modal__ul-subvalues'><b>Permitted values:</b> pm25, pm10, no2, so2, o3, co, bc</li>
                <li><h4>unit</h4></li>
                <li className='modal__ul-subvalues'><b>Permitted values:</b> ug/m^3, ppm</li>
                <li><h4>value</h4></li>
                <li className='modal__ul-subvalues'> A number representing the particle count</li>
                <li><h4>sourceName</h4></li>
                <li className='modal__ul-subvalues'> A string of text representing the source's name</li>
                <li><h4>sourceType</h4></li>
                <li className='modal__ul-subvalues'><b>Permitted values:</b> government, research, other</li>
                <li><h4>attribution/name</h4></li>
                <li className='modal__ul-subvalues'> A list of 1 or more strings, separated by the | character</li>
                <li><h4>date/utc</h4></li>
                <li className='modal__ul-subvalues'> UTC time, in the format 2016-11-29T17:30:00</li>
                <li><h4>date/local</h4></li>
                <li className='modal__ul-subvalues'> UTC time, in the format 2016-11-29T17:30:00-05:00, where -05:00 represents the local timezone's offset</li>
                <li><h4>mobile</h4></li>
                <li className='modal__ul-subvalues'><b>Permitted values:</b> true, false</li>
                <li><h4>location</h4></li>
                <li className='modal__ul-subvalues'> A string of text describing the measurement's location</li>
                <li><h4>city</h4></li>
                <li className='modal__ul-subvalues'> A string of text describing the measurement's city</li>
                <li><h4>country</h4></li>
                <li className='modal__ul-subvalues'> The two-character ISO Alpha-2 country code describing the measurement's country</li>
              </ul>
              <h3 className='heading-deco'>Optional Columns:</h3>
              <ul>
                <li><h4>averagingPeriod/value</h4></li>
                <li className='modal__ul-subvalues'>If applicable, a number representing the averaging period of the measurement in hours</li>
                <li><h4>averagingPeriod/unit</h4></li>
                <li className='modal__ul-subvalues'><b>Permitted value:</b> hours</li>
                <li><h4>attribution/url</h4></li>
                <li className='modal__ul-subvalues'><p> If applicable, a list of 1 or more URLS associated with the values in attribution/name, separated by the | character. If a particular attribution name is missing a URL, the association can be skipped by inserting another | character</p></li>
                <li><h4>coordinates/latitude</h4></li>
                <li className='modal__ul-subvalues'> A number between -90 and 90 representing the latitude of the measurement's location</li>
                <li><h4>coordinates/longitude</h4></li>
                <li className='modal__ul-subvalues'> A number between -180 and 180 representing the longitude of the measurement's location</li>
              </ul>
            </div>
          </div>
          <footer className='modal__footer'>
            <button className='button button--achromic' type='button'><span>Dismiss</span></button>
          </footer>
        </div><button className='modal__button-dismiss' title='Close'><span>Dismiss</span></button>
      </section>
    );
  }
});

module.exports = InstructionModal;
