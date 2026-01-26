import { Outlet, Link } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="app-container">
      <nav>
        <Link to="/">Home</Link>
        | <Link to="/availability">Availability</Link>
        | <Link to="/calendar">Calendar</Link>
        | <Link to="/options">Options</Link>
        | <Link to="/cart">Cart</Link>
        | <Link to="/appointments">Appointments</Link>
        | <Link to="/canceled appointments">Canceled Appointments</Link>
      </nav>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;