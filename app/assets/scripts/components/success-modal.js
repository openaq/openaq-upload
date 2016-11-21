'use strict';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { s3Upload } from '../utils/s3-upload';

var SuccessModal = React.createClass({
  displayName: 'SuccessModal',
  propTypes: {
    visible: React.PropTypes.bool,
    errors: React.PropTypes.string,
    csvFile: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      visible: false,
      title: 'Validation Success!',
      message: <div className='modal__body--about'>
        <h3>Congratulations, your data passed validation!</h3>
        <p>Click below to upload the CSV file to OpenAQ. New data will typically
        be integrated with the public results within 30 minutes of submission.</p>
        <p>Thank you for your contribution.</p>
      </div>,
      button: <button className='button button--primary-bounded button--xlarge' type='button' onClick={this.uploadData}><span>Submit Data</span></button>
    };
  },

  toggleModal: function (event) {
    this.setState({visible: !this.state.visible});
  },

  componentDidMount: function () {
    if (!this.props.errors && this.props.visible) this.toggleModal();
  },

  uploadData: function () {
    s3Upload(this.props.csvFile).then((response) => {
      if (response.status === 201) {
        this.setState({
          title: 'Upload Success!',
          message: <div className='modal__body--about'>
            <h3>Congratulations, your data has been uploaded!</h3>
            <p>New data will typically become available within 30 minutes of
            submission.</p>
            <p>Thank you for your contribution.</p>
          </div>,
          button: <button className='button button--primary-bounded button--xlarge' type='button' onClick={() => this.toggleModal()}><span>Dismiss</span></button>
        });
      } else {
        this.setState({
          title: 'Upload Failure',
          message: <div className='modal__body--about'>
            <h3>Upload Error</h3>
            <p>There was an error when uploading the file. The server returned
            Error {status}: {response.statusText}.</p>
          </div>,
          button: <button className='button button--primary-bounded button--xlarge' type='button' onClick={() => this.toggleModal()}><span>Dismiss</span></button>
        });
      }
    });
  },

  modal: function () {
    if (!this.state.visible) return null;
    return (
      <section className='modal modal--large modal--about'>
        <div className='modal__inner'>
          <header className='modal__header'>
            <div className='modal__headline'>
              <h1 className='modal__title'>{this.title}</h1>
              <button className='modal__button-dismiss' title='Close' onClick={() => this.toggleModal()}><span>Dismiss</span></button>
            </div>
          </header>
          <section className='modal__body'>
            {this.state.message}
            {this.state.button}
          </section>
        </div>
      </section>
    );
  },

  render: function () {
    return (
      <ReactCSSTransitionGroup
        component='div'
        transitionName='modal'
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300} >
          {this.modal()}
      </ReactCSSTransitionGroup>
    );
  }
});

module.exports = SuccessModal;
