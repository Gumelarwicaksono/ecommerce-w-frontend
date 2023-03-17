import React from 'react';

const MessageBox = (props) => {
  return (
    <div className={`alert alert-${props.className || 'info'}`} role="alert">
      {props.children}
    </div>
  );
};

export default MessageBox;
