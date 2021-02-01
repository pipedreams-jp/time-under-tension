import React from "react";

type Props = {
  items: string[];
  onAddItem(item: string): void;
};

export function TagsInput(props: Props) {
  const [text, setText] = React.useState("");

  return (
    <>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="button"
        onClick={() => {
          props.onAddItem(text);
          setText("");
        }}
      >
        Add
      </button>
      {Boolean(props.items.length) && (
        <div>
          {props.items.map((item) => (
            <span
              key={item}
              style={{
                display: "inline-block",
                margin: "4px",
                padding: "4px",
                background: "black",
                color: "white",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
