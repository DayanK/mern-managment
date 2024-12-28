import React from 'react';

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="alert alert-danger" role="alert">
      <h4 className="alert-heading">Oops!</h4>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
