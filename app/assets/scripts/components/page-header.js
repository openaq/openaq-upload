'use strict';
import React from 'react';
import InstructionModal from './instruction-modal';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  getInitialState: function () {
    return {
      open: false
    };
  },

  openModal: function () {
    this.setState({open: true});
  },

  closeModal: function () {
    this.setState({open: false});
  },

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
              <a className='button button--primary button--large' role='button' onClick={this.openModal}><span>View Instructions</span></a>
            </div>
          </header>
          <InstructionModal open={this.state.open} closeModal={this.closeModal}/>
        </div>
    );
  }
});

module.exports = PageHeader;
