import classNames from "classnames";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  name?: string;
}

export const Input = (props: Props) => {
  const { className, placeholder, ...rest } = props;
  const classes = classNames("border border-black rounded-md p-2", className);
  return (
    <input
      {...rest}
      placeholder={placeholder}
      type="text"
      className={classes}
    ></input>
  );
};
