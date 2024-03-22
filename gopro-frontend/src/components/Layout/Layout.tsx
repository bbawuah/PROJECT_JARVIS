import { Outlet } from "react-router-dom";
import { Grid } from "../Grid/Grid";
import { Menu } from "../Menu/Menu";

export const Layout = () => {
  return (
    <Grid columns={24}>
      <Menu
        className="col-start-1 col-end-5"
        menuOptions={[
          {
            key: "home",
            lable: "Home",
            to: "/",
          },
          {
            key: "about",
            lable: "About",
            to: "/about",
          },
        ]}
      />
      <div className="col-start-5 col-end-[25] flex relative">
        <Outlet />
      </div>
    </Grid>
  );
};
