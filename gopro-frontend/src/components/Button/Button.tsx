import classNames from "classnames";
import Progress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";

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
      {!isLoading && (
        <motion.span
          initial={{ opacity: 1, y: 5 }}
          exit={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className=""
        >
          {text}
        </motion.span>
      )}
      {isLoading && (
        <motion.span
          className=""
          initial={{ opacity: 1, y: 5 }}
          exit={{ opacity: 0, y: -5 }}
          animate={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isLoadingText}
        </motion.span>
      )}
      {isLoading && (
        <div className="absolute top-0 bottom-0 right-2 flex items-center justify-center">
          <Progress size={20} />
        </div>
      )}
    </button>
  );
};
