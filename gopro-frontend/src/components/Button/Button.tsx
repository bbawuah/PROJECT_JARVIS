import classNames from "classnames";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
  type?: "button" | "submit" | "reset";
}
export const Button = (props: Props) => {
  const { text, className, ...rest } = props;
  const classes = classNames("rounded-md cursor-pointer p-2", className);

  return (
    <button className={classes} {...rest}>
      {text}
    </button>
  );
};
