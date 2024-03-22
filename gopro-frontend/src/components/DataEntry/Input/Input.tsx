import classNames from "classnames";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  name?: string;
}

export const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, placeholder, ...rest } = props;
  const classes = classNames("border border-black rounded-md p-2", className);
  return (
    <input
      ref={ref}
      {...rest}
      placeholder={placeholder}
      type="text"
      className={classes}
    ></input>
  );
});
