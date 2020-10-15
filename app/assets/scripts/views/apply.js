import React from 'react';

import Header from '../components/header';
import PageFooter from '../components/page-footer';

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='page page--homepage'>
        <Header>
          <div className='header-wrapper'>
            <h1 className='page__title'>Create account</h1>
            <p>Please email us at info <b>info@openaq.org</b> and include the following information. We will create an account for you so you can upload data.</p>
          </div>
        </Header>
        <script src="https://gist.github.com/dqgorelick/c98a8721d2ec59d6242d714018e2a0e7.js"></script>
        <div className="inner">
          <div className="form-content">
            <div className="form-wrapper">
              <p><b>Name:</b> First and Last name, and however you would like us to refer to you.</p>
              <p><b>Associated institution:</b> While we do not require an association with an academic, government, or organization it is helpful for us to maintain a certain standard of data.</p>
              <p><b>Email address:</b> If you are partnered with an institution, please email us from your associated email address.</p>
              <p><b>Data Details:</b> Any information you would like to share about the data you would like to upload.</p>
              <hr></hr>
              <p>We will get back to you soon with details about your account. Feel free to reach out any time with any questions you may have. We are excited for you to join the community!</p>
              <p>Learn more about our community on our <a href="https://openaq.org/#/community">OpenAQ community page</a>.</p>
            </div>
          </div>
        </div>
        <PageFooter></PageFooter>
      </div>
    );
  }
}

export default CreateAccount
