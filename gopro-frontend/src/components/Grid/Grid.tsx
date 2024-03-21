import classNames from "classnames";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  columns: 12 | 24;
  children: React.ReactNode;
}

export const Grid = (props: Props) => {
  const { columns, children, className, ...rest } = props;
  const classes = classNames(
    "grid w-screen h-screen",
    {
      [`grid-cols-24`]: columns == 24,
      [`grid-cols-12`]: columns == 12,
    },
    className
  );

  return (
    <div {...rest} className={classes}>
      {children}
    </div>
  );
};
