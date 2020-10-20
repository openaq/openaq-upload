import React from 'react';

import UserAuth from './user-auth';

class Header extends React.Component {
  render() {
    return (
      <header className='page__header' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
            <h1 className='site__title'>
              <a href='/' title='Visit homepage'>
                <img src='/assets/graphics/layout/logo.svg' alt='OpenAQ logotype' height='48' />
                <span className='visually-hidden'>OpenAQ</span>
              </a>
            </h1>
            <div className='site__actions'>
              <UserAuth />
            </div>
          </div>
          <div className='header__content'>
            {this.props.children}
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
