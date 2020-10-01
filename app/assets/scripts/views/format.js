import React from 'react';

import Gist from 'react-gist';

import { gist } from '../config'

import Header from '../components/header';
import PageFooter from '../components/page-footer';

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
            <p>Please email us at <b>upload@openaq.org</b> if you have any questions.</p>
          </div>
        </Header>        
        <div className="inner">
                <div className="form-content">
                    <div className="form-wrapper">
                        <p>Download a <a target="_blank"  href={gist.sampleCSV}>sample CSV</a> or <a target="_blank" href={gist.templateCSV}>template CSV</a>.</p>
                        <Gist id={gist.formatId}/>
                    </div>
                </div>
        </div>
        <PageFooter></PageFooter>
      </div>
    );
  }
}

export default Format
