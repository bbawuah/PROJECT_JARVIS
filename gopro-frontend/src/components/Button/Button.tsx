import classNames from "classnames";
import Progress from "@mui/material/CircularProgress";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  isLoadingText?: string;
}
export const Button = (props: Props) => {
  const {
    text,
    isLoading,
    isLoadingText = "Loading",
    className,
    ...rest
  } = props;
  const classes = classNames(
    "rounded-md flex items-center justify-center cursor-pointer p-2 relative",
    className
  );

  return (
    <button className={classes} {...rest}>
      {!isLoading && <span className="">{text}</span>}
      {isLoading && <span className="">{isLoadingText}</span>}
      {isLoading && (
        <div className="absolute top-0 bottom-0 right-2 flex items-center justify-center">
          <Progress size={20} />
        </div>
      )}
    </button>
  );
};
