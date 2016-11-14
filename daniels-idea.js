var UploadForm = React.createClass({
  renderValErrors: function () {
    return (
      <ul>
        {this.state.valErrors.map(o => <li>line X: error</li>)}
      </ul>
    );
  },

  renderInitial: function () {
    // The initial view
    // and
    // The verify failure, which is basically the same as the initial just with
    // errors displayed.
    return (
      <div>
        <span>Upload</span>
        {this.state.valErrors.length ? this.renderValErrors() : null}
      </div>
    );
  },

  renderVerifySuccess: function () {
    // Verification passed, render summary and submit options
    return (<div><span>120 measurements</span> <button>Submit</button></div>);
  },

  renderSuccess: function () {
    // Data submitted. Render thank you
    return (<div>Thanks</div>);
  },

  render: function () {
    let status = this.state.status;
    return (
      <section className='fold' id='uploader'>
        <div className='exhibit'>
          <div className="exhibit__content">
            {status === 'initial' || status === 'verifyErr' ? this.renderInitial() : null}
            {status === 'verifySucc' ? this.renderVerifySuccess() : null}
            {status === 'finished' ? this.renderSuccess() : null}
          </div>
        </div>
      </section>
    );
  }
});

module.exports = UploadForm;
