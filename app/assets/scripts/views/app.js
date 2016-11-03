'use strict';
import React from 'react';

import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';

import UploadForm from '../components/upload-form';
import FailureModal from '../components/failure-modal';
import SuccessModal from '../components/success-modal';

var App = React.createClass({
  displayName: 'App',

  render: function () {
    return (
      <div className='page'>
        <PageHeader />
        <main className='page__body' role='main'>
          <div className='inpage__body'>

            <UploadForm />
            <FailureModal />
            <SuccessModal />

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
