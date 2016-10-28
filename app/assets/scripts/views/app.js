'use strict';
import React from 'react';

import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';

import UploadForm from '../components/upload-form';

var App = React.createClass({
  displayName: 'App',

  render: function () {
    return (
      <div className='page'>
        <PageHeader />
        <main className='page__body' role='main'>
          <div className='inpage__body'>

            <UploadForm />

          </div>
        </main>
        <PageFooter />
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

module.exports = App;
