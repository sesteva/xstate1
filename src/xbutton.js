import React from "react";
import { useMachine } from "@xstate/react";
import { buttonMachine } from "./button-machine";

export const Button = ({ children, submit, disabled, ...rest }) => {
  const machine = buttonMachine(submit);
  const [current, send] = useMachine(machine);
  if (!disabled) send("ENABLE");
  return (
    <button
      onClick={() => send("PRESS")}
      className={`button-${current.value}`}
      disabled={disabled || current.matches("success")}
    >
      {current.matches("clicked") && <span>submitting</span>}
      {current.matches("success") && <span>done</span>}
      {current.matches("retry") && <span>try again</span>}
      {current.matches("disabled") && children}
      {current.matches("active") && children}
    </button>
  );
};
