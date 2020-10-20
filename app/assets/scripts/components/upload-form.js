import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import Dropzone from 'react-dropzone';
import fileReaderStream from 'filereader-stream';

import Loader from './loader';
import auth from '../services/auth'
import verifyCsv from '../services/verify'
import { downloadFile } from '../services/download-link'
import { exampleCsv, templateCsv } from '../templates/csvs'
import { uploadData, uploadNewFile } from '../state/upload/actions'

class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*
        menuStates:
        0 = Upload form
        1 = Status 
      */
      menuState: 0,
      failureType: -1,
      formFile: 'Choose File to Upload',
      errors: []
    };
    this.csvFile = undefined
  }

  verifyData(failures) {
    if (failures.length) {
      this.setState({
        status: 'verifyErr',
        errors: failures,
        menuState: 1
      });
    } else {
      this.setState({
        status: 'verifySucc',
        errors: failures,
        menuState: 1
      });
    }
    return;
  }

  handleUploadClick() {
    const profile = auth.getProfile()
    this.props.uploadData({
      csvFile: this.state.csvOutput,
      profile: profile.name
    })
  }

  handleVerifyClick() {
    if (this.csvFile) {
      verifyCsv(fileReaderStream(this.csvFile))
        .then(data => {
          this.setState({
            csvOutput: data.csvOutput,
            errors: data.failures,
            menuState: 1
          });
        })
        .catch(error => {
          this.setState({
            errors: error.failures,
            failureType: error.failureType,
            menuState: 1
          });
        })
    }
  }

  getFile(files) {
    this.csvFile = files[0];
    this.setState({
      formFile: files[0].name,
      status: 'initial',
      errors: [],
    });
  }

  render() {
    const errors = this.state.errors;
    let errorText = '';
    errors.forEach((error) => {
      errorText += `${error.details ? error.details : ''}\n`;
    });
    const errorMsg = errors.length
      ? <div className='form__group'>
        <p className='error'>Details: <b>{`${errors.length} error${errors.length === 1 ? '' : 's'} `}</b>found.</p>
        <textarea readOnly className='form__control' id='form-textarea' rows='7' defaultValue={errorText}></textarea>
      </div>
      : '';

    return (
      <div className="inner">
        <div className="form-content">
          <div className="form-wrapper">
            {
              this.state.menuState === 0 ?
                <section className="section-wrapper">
                  <h2>Format your data</h2>
                  <p>To see what data attributes we require, check out our data <Link to={{ pathname: '/format' }}>format guide</Link>. Or view a <a onClick={() => { downloadFile('openaq_upload_tool_sample.csv', exampleCsv) }}>sample CSV</a> or <a onClick={() => { downloadFile('openaq_upload_tool_template.csv', templateCsv) }}>template CSV</a>. We only accept csv files at this time.</p>
                  <fieldset className='form__fieldset'>
                    <Dropzone
                      accept='text/*, application/vnd.ms-excel,'
                      onDropAccepted={acceptedFile => {
                        this.getFile(acceptedFile)
                      }}
                      onDropRejected={rejectedFile => {
                        console.log(rejectedFile)
                      }}
                      multiple={false}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div className="upload-drop-area" {...getRootProps()}>
                            <input {...getInputProps()} />
                            {this.csvFile ?
                              <p><strong>File: {this.csvFile.name}</strong> or select a different file.</p>
                              :
                              <p><strong>Choose a CSV file</strong> or drag and drop here</p>
                            }
                          </div>
                        </section>
                      )}
                    </Dropzone>
                    <p>Note: Without logging in, your data will not be uploaded to the platform. The site just checks that the data is formatted correctly.</p>
                    <div>
                      <button disabled={!this.csvFile} className='button button--primary button--verify' type='button' onClick={this.handleVerifyClick.bind(this)}>
                        <span>Verify</span>
                      </button>
                    </div>
                  </fieldset>
                </section>
                :
                <div>
                  {
                    this.props.uploading ?
                      <div>
                        <p>Uploading your data... please wait</p>
                        <Loader />
                      </div>
                      :
                      <section className="section-wrapper">
                        <h2>Format your data</h2>
                        {
                          this.state.errors.length > 0 ?
                            <div className="upload-status upload-status-error">
                              <h5>Status: Some changes necessary</h5>
                              <p>Please review notes below. After reformatting your data, you can check the formatting again. </p>
                            <p>Guide for formatting your data <Link to={{ pathname: '/format' }}>here</Link> and you can download a template CSV <a onClick={() => { downloadFile('openaq_upload_tool_template.csv', templateCsv) }}>here</a> or a sample <a onClick={() => { downloadFile('openaq_upload_tool_example.csv', exampleCsv) }}>here</a>.</p>
                            </div>
                            : this.props.uploadSuccess ?
                              <div className="upload-status upload-status-success">
                                <h5>Status: Data Uploaded successfully!</h5>
                                <p>The fetch process runs every 10 minutes and your data will be ingested onto the platform very soon.</p>
                              </div>
                              : this.props.uploadFailed ?
                                <div className="upload-status upload-status-success">
                                  <h5>Status: Data upload failed.</h5>
                                  <p>View errors below</p>
                                </div>
                                :
                                <div className="upload-status upload-status-success">
                                  <h5>Status: Data formatted correctly!</h5>
                                  <p>You can review your data below to make changes, or you can continue uploading your data.</p>
                                  {
                                    this.props.userProfile ?
                                      <div></div>
                                      :
                                      <p><strong>Note:</strong> you will need to <Link to={{ pathname: '/account' }}>apply for an account</Link> to upload data.</p>
                                  }
                                </div>
                        }
                        <p>File processed: <strong>{this.csvFile.name}</strong></p>
                        <fieldset className='form__fieldset'>
                          {
                            this.state.errors.length > 0 ?
                              <div>
                                <p>Summary: <strong>{this.state.errors[0].text}</strong></p>
                                {errorMsg}
                              </div>
                              :
                              <div></div>
                          }
                          <button
                            className='button button--primary button--verify'
                            type='button'
                            onClick={() => {
                              this.setState({
                                menuState: 0,
                              })
                              if (this.props.uploadSuccess) {
                                this.props.uploadNewFile()
                              }
                            }}
                          >
                            <span>{this.props.uploadSuccess ? 'Upload another file' : 'Change file'}</span>
                          </button>
                        </fieldset>
                        {
                          this.state.errors.length === 0 ?
                            <div>
                              {
                                this.props.userProfile ?
                                  <div>
                                    {
                                      this.props.uploadSuccess ?
                                        <div>
                                          <p>Uploaded {this.csvFile.name} successfully!</p>
                                        </div>
                                        : this.props.uploadFailed ?
                                          <div>
                                            <p>Error: {this.csvFile.name} was not able to upload successfully.</p>
                                            <p>Upload error:</p>
                                            <pre>
                                              {JSON.stringify(this.props.uploadError)}
                                            </pre>
                                          </div>
                                          :
                                          <div>
                                            <p>Upload the data from the <strong>{this.csvFile.name}</strong> file.</p>
                                            <button className='button button--primary button--verify' type='button' onClick={this.handleUploadClick.bind(this)}>
                                              <span>Upload</span>
                                            </button>
                                          </div>
                                    }
                                  </div>
                                  :
                                  <div>
                                    <p>Please <a onClick={auth.login}>log in</a>, or <Link to={{ pathname: '/account' }}>apply for an account</Link> if you would like to upload your data.</p>
                                    <button disabled={true} className='button button--primary button--verify' type='button'>
                                      <span>Upload</span>
                                    </button>
                                  </div>
                              }
                            </div>
                            :
                            <div></div>
                        }
                      </section>
                  }
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    uploading: state.uploadData.uploading,
    uploadSuccess: state.uploadData.uploadSuccess,
    uploadFailed: state.uploadData.uploadFailed,
    uploadResponse: state.uploadData.success,
    uploadError: state.uploadData.error,
    userProfile: state.user.userProfile
  };
};

const mapDispatchToProps = {
  uploadData,
  uploadNewFile
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadForm);