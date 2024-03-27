import React from "react";

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export const Form = (props: Props) => {
  const { children, ...rest } = props;

  return <form {...rest}>{children}</form>;
};
