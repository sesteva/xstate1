import React from 'react';
import { App } from './app.js'
import { Machine } from 'xstate';
import { render, fireEvent, cleanup, getByTestId, waitForElement, waitForDomChange } from '@testing-library/react';
import { createModel } from '@xstate/test';

describe('Button vs XButton', ()=>{
  const buttonMachine = Machine({
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
        },
        meta: {
          test: ({ getByTestId }) => {
            expect(getByTestId('default-button'));
          }
        }
      },
      disabled: {
        on: {
          ENABLE: "active"
        },
        meta: {
          test: ({ getByTestId }) => {
            expect(getByTestId('default-button'));
          }
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
        },
        meta: {
          test: ({ getByTestId }) => {
            expect(getByTestId('loading-button'));
          }
        }
      },
      clicked: {  
        on: {
          "": [
            {
              target: 'success',
              cond: (_, event) => {     
                // Need to get the button to see if the right one has been rendered
                // testId === "success-button"                                                                  
                return true
              }
            },
            { target: 'retry' }
            
          ]
        },      
        meta: {
          test: ({ getByTestId }) => {
            expect(getByTestId('loading-button'));
          }
        }
      },
      focused: {
        on: {
          PRESS: "pressed",
          BLUR: "active"
        }
      },
      success: {
        type: "final",
        meta: {
          test: async ({ getByTestId, container }) => {            
            const button = await waitForElement(()=> getByTestId('success-button'), {container})
            expect(button);            
          }
        }
      },
      retry: {
        on: {
          HOVER: "hovered",
          PRESS: "pressed",
          CLICK: "clicked",
          DISABLE: "disabled",
          FOCUS: "focused"
        },
        meta: {
          test: ({ getByTestId }) => {
            expect(getByTestId('retry-button'));
          }
        }
      }
    }
  });

  const testModel = createModel(buttonMachine).withEvents({
    ENABLE: ({ getByTestId }) => {
      const input = getByTestId('username-input')
      fireEvent.change(input, { target: { value: 'something' } })    
    },
    HOVER: ({getByTestId})=>{
      const button = getByTestId("default-button")
      fireEvent.mouseOver(button)
    },
    PRESS: ({getByTestId})=>{
      const button = getByTestId("default-button")
      fireEvent.click(button)      
    },
    CLICK: ({getByTestId})=>{
      const button = getByTestId("default-button")
      fireEvent.click(button)      
    },
  });
  
  const testPlans = testModel.getSimplePathPlans();

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, async () => {          
          const rendered = render(<App />);
          return path.test(rendered);          
        });
      });
    });
  });

  it('should have full coverage', () => {
    return testModel.testCoverage();
  });
})