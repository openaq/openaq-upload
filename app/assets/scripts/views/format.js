import React from 'react';

import Gist from 'react-gist';

import { gist } from '../config'

import Header from '../components/header';
import PageFooter from '../components/page-footer';

class Format extends React.Component {
  constructor(props) {
    super(props);
  }

  downloadFile() {
    const url = window.URL.createObjectURL(new Blob(['hello']));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template.csv');
    document.body.appendChild(link);
    link.click();
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
                        <p>View a <a target="_blank" href={gist.sampleCSV}>sample CSV</a> or <a onClick={() => {this.downloadFile()}}>template CSV</a>.</p>
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
