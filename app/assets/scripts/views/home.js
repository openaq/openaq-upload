import React from 'react';

import { Link } from 'react-router-dom'
import Header from '../components/header';
import PageFooter from '../components/page-footer';
import UploadForm from '../components/upload-form';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('hello')
  }

  render() {
    return (
      <div className='page page--homepage'>
        <Header>
          <div className='header-wrapper'>
            <h1 className='page__title'>OpenAQ Upload Tool</h1>
            <p>Have data to contribute to the platform? Apply for an account to share your government-level or research-grade data with the world.</p>
            <p><Link to={{pathname: '/account'}}>Apply for an account</Link> or test your data below</p>
          </div>
        </Header>
        <UploadForm></UploadForm>
        <PageFooter></PageFooter>
      </div>
    );
  }
}

export default Home
