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
      <button {...rest} onClick={submitHandler}>
        submitting
      </button>
    );
  if (isSuccess)
    return (
      <button {...rest} disabled>
        done
      </button>
    );
  if (isSuccess != null && !isSuccess)
    return (
      <button {...rest} onClick={submitHandler}>
        try again
      </button>
    );
  return (
    <button {...rest} onClick={submitHandler}>
      {children}
    </button>
  );
};
