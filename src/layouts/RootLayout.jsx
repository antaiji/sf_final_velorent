import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <Fragment>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </Fragment>
  );
};

export default RootLayout;
