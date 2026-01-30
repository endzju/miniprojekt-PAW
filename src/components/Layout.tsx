import { Outlet, Link } from "react-router-dom";
import "./Layout.css";
import AuthNav from "./AuthNav";
import { useAppContext } from "./AppContext";

const Layout = () => {
  const { currentUser } = useAppContext();
  return (
    <div className="app-container">
      <nav className="app-nav">
        <Link to="/">Home</Link>
        | <Link to ="/doctorList">Lekarze</Link> 
        {currentUser?.role  === "doctor" && <>| <Link to="/availability">Grafik</Link></>}
        {(currentUser?.role  === "doctor" || currentUser?.role  === "user") && <>| <Link to="/calendar">Kalendarz</Link></>}
        {currentUser?.role  === "admin" && <>| <Link to="/options">Opcje</Link></>}
        {currentUser?.role  === "user" && <>| <Link to="/cart">Koszyk</Link></>}
        {(currentUser?.role  === "doctor" || currentUser?.role  === "user") && <>| <Link to="/appointments">Wizyty</Link></>}
        {currentUser?.role  === "user" && <>| <Link to="/canceledAppointments">Odwołane wizyty przez lekarza</Link></>}
        {currentUser?.role  === "admin" && <>| <Link to="/registerDoctor">Dodaj lekarza</Link></>}

        <AuthNav />
      </nav>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;