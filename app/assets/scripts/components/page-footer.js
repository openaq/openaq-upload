'use strict';
import React from 'react';
import fetch from 'isomorphic-fetch';

var PageFooter = React.createClass({
  displayName: 'PageFooter',

  getInitialState: function () {
    return {
      measurements: 0
    };
  },

  componentDidMount: function () {
    fetch('https://api.openaq.org/v1/measurements?limit=0')
    .then((response) => response.json())
    .then((json) => this.setState({measurements: json.meta.found.toLocaleString()}));
  },

  render: function () {
    return (
      <footer className='page__footer' role='contentinfo'>
        <p className='copyright'>
          {this.state.measurements} measurements captured with <span className='heart'></span> by <a href='https://developmentseed.org' title='Visit Development Seed website'>Development Seed</a> and the <a href='https://openaq.org/' title='Visit the OpenAQ website'>OpenAQ</a> team.
        </p>
      </footer>
    );
  }
});

module.exports = PageFooter;
