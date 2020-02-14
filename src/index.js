import "./styles.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "./button";
import { Button as XButton } from "./xbutton";

function App() {
  const [data, setData] = useState(null);

  async function submitWithChance() {
    return new Promise((resolve, reject) =>
      setTimeout(() => (Math.random() < 0.5 ? reject() : resolve()), 1000)
    );
  }
  return (
    <div className="App">
      <div className="header">
        <h1>React+XState vs React - Round 1</h1>
        <p>
          <b>Scenario:</b> Lets see one simple case when dealing with a button
          with transitions based on a side effect.
        </p>
        <p>
          The button goes through transitions covering
          <br />
          disabled => active => hovered/focused => pressed, clicked =>
          submitting => retry or done
        </p>
        <p>
          The state diagram can be found{" "}
          <a
            href="https://xstate.js.org/viz/?gist=cac6c89460b34a3ea2373da3db856b02"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
        </p>
      </div>
      <hr />
      <div className="poc">
        <label>
          <span>Type something to enable the buttons </span>
          <input
            type="text"
            name="username"
            onChange={evt => setData(evt.target.value)}
          />
        </label>
        <div>
          <XButton
            className="button-disabled"
            submit={submitWithChance}
            disabled={data === null || data === ""}
          >
            Xsubmit
          </XButton>
          <Button
            submit={submitWithChance}
            disabled={data === null || data === ""}
          >
            Submit
          </Button>
          <p>
            Both buttons carry out a promise that has 50/50 chances of being
            succesful or not.
            <br /> In the case of failure, you will be able to retry.
            <br />
          </p>
        </div>
      </div>
      <hr />
      {/* <div className="conclusions">
        <h2>Conclusions</h2>
        <p>
          Note 1: While coding the regular react component consumed less time,
          it required juggling two booleans to make them fit all the
          requirements. Without following TDD , it felt I was hacking guard
          flags until I had found the right combination. Many times doubting
          whether I needed a third boolean to cover certain state.
        </p>
        <p>
          Note 2: Designing the transitions in the Viz tool forced me to think
          many more scenarios than I would have thought otherwise. TDD usually
          covers some of these but with a visual tool allowing me to test the
          flows, I believe it actually helped me cover more scenarios. Having
          done this first, it was easier to know all the scenarios I need to
          fulffil on both React+Xstate or React alone.
        </p>
        <p>
          Note 3: The diagram became my user story/requirements. This could be a
          great source for discussions between a product owner, a QA and a dev.
        </p>
        <p>
          Note 4: in Xstate when the state did not have further transitions, the
          button simply would not change. On the React version, this required me
          removing the onClick after manually testing out I had missed an
          scenario
        </p>
        <p>
          Note 5: While Xstate version seems to carry out more coding and plenty
          of designing, I can see how fragile my hand react only coding could be
          compared to the state/transitions definition done in the state machine
        </p>
        <p>
          Note 6: in Xstate I had defined certain states I ended up ignoring
          such as hover and focus. CSS already has its own state machine and
          defines those states for me.
        </p>
      </div> */}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
