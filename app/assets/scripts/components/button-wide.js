import React from 'react';
import { Link } from 'react-router-dom';

class ButtonWide extends React.Component {
  render () {
    const { url, text } = this.props;

    return (
      <div className='button-wide'>
        <Link to={url}>
          {text}
        </Link>
      </div>
    );
  }
}

export default ButtonWide;
