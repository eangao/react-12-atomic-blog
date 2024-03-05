import { Children, useState } from "react";

function SlowComponent() {
  // If this is too slow on your maching, reduce the `length`
  const words = Array.from({ length: 100_000 }, () => "WORD");
  return (
    <ul>
      {words.map((word, i) => (
        <li key={i}>
          {i}: {word}
        </li>
      ))}
    </ul>
  );
}

function Counter({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Slow counter?!?</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increase: {count}</button>
      {children}
    </div>
  );
}

export default function Test() {
  // const [count, setCount] = useState(0);
  // return (
  //   <div>
  //     <h1>Slow counter?!?</h1>
  //     <button onClick={() => setCount((c) => c + 1)}>Increase: {count}</button>
  //     <SlowComponent />
  //   </div>
  // );

  return (
    <div>
      {/* So again, as React sees this piece of JSX here, it will basically
      immediately create the SlowComponent right here and then pass it into the
      Counter. So all while rendering. And then as we click here on this button,
      the Counter is of course re-rendered, but this component again has already
      been pressed in as a prop, So it has already been created before and so it
      cannot be affected by that state update. It already exists. And so that is
      the reason why React then bails out of re-rendering this children
      component because nothing could have changed inside of the SlowComponent.
      So React is smart enough like this and can therefore decide not to
      re-render this. */}
      <Counter>
        <SlowComponent />
      </Counter>
    </div>
  );
}
