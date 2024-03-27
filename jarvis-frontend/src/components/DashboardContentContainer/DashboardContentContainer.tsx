import classNames from "classnames";

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const DashboardContentContainer = (props: Props) => {
  const { children, className, ...rest } = props;
  const classes = classNames("p-8 w-full h-full flex", className);

  return (
    <section className={classes} {...rest}>
      {children}
    </section>
  );
};
