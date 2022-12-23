import { useState } from "react";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/navbar/Navbar";
import NewOrg from "./components/NewOrg/NewOrg";

function App() {
    const [newOrg, setNewOrg] = useState({
        show: false,
        no_of_orgs: null,
    });
    return (
        <>
            <Navbar />
            {newOrg.show ? (
                <NewOrg no_of_orgs={newOrg.no_of_orgs} setNewOrg={setNewOrg} />
            ) : (
                <Dashboard setNewOrg={setNewOrg} />
            )}
        </>
    );
}

export default App;
