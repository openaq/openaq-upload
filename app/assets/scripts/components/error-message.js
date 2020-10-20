import React from 'react';

const ErrorMessage = props => {
  return (
    <div className={props.style}>
      {props.message}
      {props.retry ? (
        <button
          type='button'
          className='button button--primary-bounded message-button'
          onClick={(e) => props.retry()}>
          Retry
        </button>
      ) : null}
    </div>
  );
};

export default ErrorMessage;
