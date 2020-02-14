import { Machine } from "xstate";

export const buttonMachine = onSubmit =>
  Machine(
    {
      id: "submitButtonWithTransitions",
      initial: "disabled",
      states: {
        active: {
          on: {
            HOVER: "hovered",
            PRESS: "pressed",
            CLICK: "clicked",
            DISABLE: "disabled",
            FOCUS: "focused"
          }
        },
        disabled: {
          on: {
            ENABLE: "active"
          }
        },
        hovered: {
          on: {
            HOVEROFF: "active",
            PRESS: "pressed"
          }
        },
        pressed: {
          on: {
            "": "clicked"
          }
        },
        clicked: {
          invoke: {
            id: "asyncFn",
            src: "asyncFn",
            onDone: "success",
            onError: "retry"
          }
        },
        focused: {
          on: {
            PRESS: "pressed",
            BLUR: "active"
          }
        },
        success: {
          type: "final"
        },
        retry: {
          on: {
            HOVER: "hovered",
            PRESS: "pressed",
            CLICK: "clicked",
            DISABLE: "disabled",
            FOCUS: "focused"
          }
        }
      }
    },
    {
      services: {
        asyncFn: onSubmit
      }
    }
  );
