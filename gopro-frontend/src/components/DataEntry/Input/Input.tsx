import classNames from "classnames";
import React from "react";
import { FieldError } from "react-hook-form";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  name?: string;
  error?: FieldError;
}

export const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, placeholder, error, ...rest } = props;
  const classes = classNames(
    "border border-black rounded-md p-2 outline-none",
    {
      ["border-black focus:ring focus:border-blue-500"]: !error,
      ["border-red-500 focus:ring focus:border-red-500"]: error,
    },
    className
  );
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
