'use strict';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

var SuccessModal = React.createClass({
  displayName: 'SuccessModal',
  propTypes: {
    visible: React.PropTypes.bool,
    errors: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      visible: false
    };
  },

  toggleModal: function (event) {
    this.setState({visible: !this.state.visible});
  },

  componentDidMount: function () {
    if (!this.props.errors && this.props.visible) this.toggleModal();
  },

  modal: function () {
    if (!this.state.visible) return null;
    return (
      <section className='modal modal--large modal--about'>
        <div className='modal__inner'>
          <header className='modal__header'>
            <div className='modal__headline'>
              <h1 className='modal__title'>Validation Success!</h1>
              <button className='modal__button-dismiss' title='Close' onClick={() => this.toggleModal()}><span>Dismiss</span></button>
            </div>
          </header>
          <section className='modal__body'>
            <div className='modal__body--about'>
              <h3>Lorem Ipsum</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce scelerisque
              libero vitae odio fringilla, et consequat magna auctor. Ut accumsan quam in velit
              consequat, sit amet sodales sapien auctor.</p>
            </div>
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
