import { Fragment } from "react";
import { Outlet } from "react-router-dom";

const ReportsLayout = () => {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};

export default ReportsLayout;
