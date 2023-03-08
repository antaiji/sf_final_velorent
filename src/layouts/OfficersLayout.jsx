import { Fragment } from "react";
import { Outlet } from "react-router-dom";

const OfficersLayout = () => {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};

export default OfficersLayout;
