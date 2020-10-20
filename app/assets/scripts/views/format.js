import React from 'react';

import Gist from 'react-gist';

import { Link } from 'react-router-dom'

import { gist } from '../config'

import Header from '../components/header';
import PageFooter from '../components/page-footer';

import { exampleCsv, templateCsv } from '../templates/csvs'
import { downloadFile } from '../services/download-link'

class Format extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='page page--homepage'>
        <Header>
          <div className='header-wrapper'>
            <h1 className='page__title'>Upload Data Format</h1>
            <p>This is the following format for uploading your CSV data.</p>
            <p>Please email us at <b>info@openaq.org</b> if you have any questions.</p>
          </div>
        </Header>
        <div className="inner">
          <div className="form-content">
            <div className="form-wrapper">
              <p>View a <a onClick={() => { downloadFile('openaq_upload_tool_sample.csv', exampleCsv) }}>sample CSV</a> or <a onClick={() => { downloadFile('openaq_upload_tool_template.csv', templateCsv) }}>template CSV</a>.
                <br />
                <br />
                <Link to={{ pathname: '/' }}>Upload page</Link>
              </p>
              <Gist id={gist} />
            </div>
          </div>
        </div>
        <PageFooter></PageFooter>
      </div>
    );
  }
}

export default Format
