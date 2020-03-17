import React from 'react';
import { App } from './app.js'
import { Machine } from 'xstate';
import { render, fireEvent, waitForElement } from '@testing-library/react';
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
        }
      },
      clicked: {  
        on: {
          "": [
            {
              target: 'success',
              cond: (_, event, __) => {     
                // Need to get the button to see if the right one has been rendered
                // but there is no access to the DOM                                                                
                return true
              }
            },
            { target: 'retry' }
            
          ]
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
            await waitForElement(()=> getByTestId(/final/), {container})            
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
    HOVEROFF: ({getByTestId})=>{
      const input = getByTestId("username-input")
      fireEvent.mouseOver(input)
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
    return testModel.testCoverage({
      filter: stateNode => !!stateNode.meta
    });
  });
})