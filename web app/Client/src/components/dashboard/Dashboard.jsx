import { React, useEffect, useState } from "react";
import "./Dashboard.css";
import Parkings from "../Parkings/Parkings";
import Bot from "../../assets/logo.png";
// {org_name: 'home parking', org_id: 1, parking_add: 'on my black board', vid_src: 'system'}

const Dashboard = (props) => {
    // const [org_id, setOrg_id] = useState();
    const [showParkings, setShowParkings] = useState(false);
    const [org, setOrg] = useState({});
    const [orgs, setOrgs] = useState([]);

    // below hook fetches all the organisations
    useEffect(() => {
        fetch("http://localhost:4000/api/orgs")
            .then((response) => response.json())
            .then((data) => setOrgs(data));
    }, []);

    const clickHandler = (org_id) => {
        // alert(org_id);
        // setOrg_id(org_id);
        setShowParkings(true);
        const arr = orgs.filter((org) => {
            return org.org_id === org_id;
        });
        setOrg(arr[0]);
    };

    return (
        <>
            <section className="dashboard">
                {showParkings ? (
                    <>
                        <Parkings org={org} back={setShowParkings} />
                    </>
                ) : (
                    <Organisations
                        setNewOrg={props.setNewOrg}
                        handleClick={clickHandler}
                        orgs={orgs}
                        setOrgs={setOrgs}
                    />
                )}
            </section>
        </>
    );
};

const Organisations = (props) => {
    const delOrg = (e, org_id) => {
        e.stopPropagation();

        // here we'll make a
        fetch(`http://localhost:4000/api/deleteOrg/${org_id}`, {
            method: "DELETE",
        });

        const remaining_orgs = props.orgs.filter(
            (org) => org.org_id !== org_id
        );
        console.log(remaining_orgs);
        props.setOrgs(remaining_orgs);
    };

    return (
        <div className="org_container">
            {props.orgs.length < 1 ? (
                <>
                    <div id="noOrg">
                        <img src={Bot} alt="bot img" />
                        <h1 style={{ color: "gray" }}>
                            Sorry! No Organizations found
                        </h1>
                    </div>
                </>
            ) : (
                <table id="organisations">
                    <thead>
                        <tr>
                            <th>Org id</th>
                            <th>Org Name</th>
                            <th>Parking's address</th>
                            <th>cam IP</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.orgs.map((org) => {
                            return (
                                <tr
                                    className="row"
                                    key={org.org_id}
                                    onClick={() =>
                                        props.handleClick(org.org_id)
                                    }
                                >
                                    <td>{org.org_id}</td>
                                    <td>{org.org_name}</td>
                                    <td>{org.parking_add}</td>
                                    <td>{org.vid_src}</td>
                                    <td>
                                        <div>
                                            <button
                                                onClick={(event) =>
                                                    delOrg(event, org.org_id)
                                                }
                                                className="btn_in_table dlt"
                                            >
                                                delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {/* buttons below */}
            <div className="buttons">
                <button
                    className="btn"
                    onClick={() => {
                        props.setNewOrg({
                            show: true,
                            no_of_orgs: props.orgs.length,
                        });
                    }}
                >
                    Add new Organisation
                </button>
            </div>
        </div>
    );
};
export default Dashboard;
