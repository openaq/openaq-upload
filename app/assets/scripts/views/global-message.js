import React from 'react';

import Header from '../components/header';

class GlobalError extends React.Component {
  render () {
    return (
      <div className='page page--global-msg'>
        <Header />
        <main role='main'>
          <div className='inner'>
            <div className='global-message'>
              {this.props.children}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default GlobalError;
