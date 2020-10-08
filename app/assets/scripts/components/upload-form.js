import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { uploadData } from '../state/upload/actions'

import { gist } from '../config'
import auth from '../services/auth'

import { Link } from 'react-router-dom'

import Loader from './loader';

import Dropzone from 'react-dropzone';
import measurementSchema from '../schemas/measurement-schema.json';

import { failureTypes, parseCsv } from '../services/verify'


class UploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /*
              menuStates:
              0 = Upload form
              1 = Status 
              2 = Loading
              3 = Uploaded / Error
            */
            menuState: 0,
            failureType: -1,
            status: 'initial',
            formFile: 'Choose File to Upload',
            errors: [],
            fileWarning: false
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
        console.log('uploading data')
        console.log(this.csvOutput)
        this.props.uploadData(this.state.csvOutput)
    }

    handleVerifyClick() {
        if (this.csvFile) {
            parseCsv(this.csvFile).then(data => {
                this.setState({
                    csvOutput: data.csvOutput,
                    errors: data.failures,
                    menuState: 1
                });
            }).catch(err => {
                this.setState({
                    errors: err.failures,
                    failureType: err.failureType,
                    menuState: 1
                });
                console.log('error', err)
            });
        } else {
            console.log('please upload CSV file')
        }
    }

    getFile(files) {
        this.csvFile = files[0];
        this.setState({
            formFile: files[0].name,
            status: 'initial',
            errors: [],
            fileWarning: false
        });
    }

    render() {
        const errors = this.state.errors;
        let errorText = '';
        errors.forEach((error) => {
            errorText += `${error}\n`;
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
                                    <h2>Validate your data</h2>
                                    <p>View the <Link to={{pathname: '/format'}}>guide for formatting your data</Link>. Or view a <a target="_blank"  href={gist.sampleCSV}>sample CSV</a> or <a target="_blank" href={gist.templateCSV}>template CSV</a>. Note: we only accept csv files at this time.</p>
                                    <fieldset className='form__fieldset'>
                                        <Dropzone
                                            accept='text/*, application/vnd.ms-excel,'
                                            onDropAccepted={acceptedFile => {
                                                console.log(acceptedFile)
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
                                        <p>Verifying your data will all be performed in the browser. No data will be uploaded at this point.</p>
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
                                            <Loader/>
                                        </div>
                                        :
                                        <section className="section-wrapper">
                                            <h2>Validate your data</h2>
                                            {
                                                this.state.errors.length > 0 ?
                                                    <div className="upload-status upload-status-error">
                                                        <h5>Status: Some changes necessary</h5>
                                                        <p>Please review notes below. After reformatting your data, you can check the formatting again. </p>
                                                        <p>Guide for formatting your data <Link to={{pathname: '/format'}}>here</Link>, or download a <a target="_blank"  href="https://gist.githubusercontent.com/dqgorelick/2812154e78816b7246fd3ee336048232/raw/25274d5890a8ccad4a356bd58c3ab2d0301c285e/openaq_upload_tool_sample_csv.csv">CSV sample</a> or a <a target="_blank"  href="https://gist.githubusercontent.com/dqgorelick/07104a91fc92705f6e5f67d75de8d3fc/raw/a37b83868bb0a4c9ce535138316c2d9c1399b629/openaq_upload_tool_csv_template.csv">CSV template</a>.</p>
                                                    </div>
                                                    : this.props.uploadSuccess ?
                                                        <div className="upload-status upload-status-success">
                                                            <h5>Status: Data Uploaded succesfully!</h5>
                                                            <p>Your data will appear in the OpenAQ databases in the next <strong>15 minutes.</strong></p>
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
                                                            <p><strong>Note:</strong> you will need to <Link to={{pathname: '/account'}}>apply for an account</Link> to upload data.</p>
                                                        }
                                                    </div>
                                            }
                                            <p>File processed: <strong>{this.csvFile.name}</strong></p>
                                            <fieldset className='form__fieldset'>
                                                {
                                                    this.state.errors.length > 0 ?
                                                        <div>
                                                            <p>Summary: <strong>{failureTypes[this.state.failureType]}</strong></p>
                                                            {errorMsg}
                                                        </div>
                                                        :
                                                        <div></div>
                                                }
                                                <button className='button button--primary button--verify' type='button' onClick={() => { this.setState({ menuState: 0 }) }}>
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
                                                                <p>Please <a onClick={auth.login}>log in</a>, or <a>apply for an account</a> if you would like to upload your data.</p>
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
    uploadData
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UploadForm);