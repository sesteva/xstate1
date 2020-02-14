import React, { useState } from "react";

export const Button = ({ children, submit, ...rest }) => {
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(null);
  const submitHandler = async () => {
    try {
      setLoading(true);
      await submit();
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      setSuccess(false);
    }
  };
  if (isLoading)
    return (
      <button {...rest} onClick={submitHandler} data-testid="loading-button">
        submitting
      </button>
    );
  if (isSuccess)
    return (
      <button {...rest} disabled data-testid="success-button">
        done
      </button>
    );
  if (isSuccess != null && !isSuccess)
    return (
      <button {...rest} onClick={submitHandler} data-testid="retry-button">
        try again
      </button>
    );
  return (
    <button {...rest} onClick={submitHandler} data-testid="default-button">
      {children}
    </button>
  );
};
