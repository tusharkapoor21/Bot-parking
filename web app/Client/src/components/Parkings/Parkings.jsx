import { React, useState, useEffect } from "react";
import Modal from "./Modal/Modal";
import "./Parkings.css";

// isAvailable:true,isReserved:false,latitude:"not yet",longitude:"not yet",org_id:1,parking_id:0,x_brc:159,x_tlc:35,y_brc:239,y_tlc:37

const Parkings = (props) => {
    const [parkings, setParkings] = useState([]);
    const [modal, setModal] = useState({ show: false, parking: null });
    const [showMsg, setShowMsg] = useState(false);
    // fetch all the parkings here

    //below hook fetches all the parkings with particular org_id
    const fetchData = () => {
        fetch(`http://localhost:4000/api/parkings/${props.org.org_id}`)
            .then((response) => response.json())
            .then((data) => {
                setParkings(data);
                // console.log("data is fetched");
            });
    };
    useEffect(() => {
        if (props.org.org_id) {
            fetchData();
            const interval = setInterval(() => {
                fetchData();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, []);

    // total_p, available_p, busy_p, reserved_p
    let total_p = parkings.length;
    let available_p = 0;
    // let busy_p = total_p - available_p;
    let reserved_p = 0;
    parkings.forEach((parking) => {
        if (parking.isAvailable) available_p++;
        if (parking.isReserved) reserved_p++;
    });

    const editParking = (parking) => {
        //for now this is just used to set parking as reserved or not
        setModal({ show: true, parking: parking });
    };

    return (
        <>
            <div className="mainComponent">
                {modal.show && (
                    <Modal parking={modal.parking} close={setModal} />
                )}
                <div className="btnsContainer">
                    <button className="back" onClick={() => props.back(false)}>
                        back
                    </button>
                    <div className="msg">
                        {showMsg && <p style={{ color: "red" }}>The message</p>}
                    </div>
                </div>
                <div className="sectionContainer">
                    <section className="parkingsContainer">
                        {parkings.map((parking, index) => {
                            const ps_styles = {
                                position: "absolute",
                                top: `${parking.y_tlc}px`,
                                left: `${parking.x_tlc}px`,
                                height: `${
                                    (parking.y_brc - parking.y_tlc) / 1.5
                                }px`,
                                width: `${
                                    (parking.x_brc - parking.x_tlc) / 1.5
                                }px`,
                                backgroundColor: parking.isAvailable
                                    ? "rgba(129, 233, 129, 0.315)" //green color
                                    : "rgba(233, 129, 129, 0.315)", //red color
                                border: parking.isAvailable
                                    ? "1px solid rgb(129, 233, 129)"
                                    : "1px solid rgb(233, 129, 129)",
                                // outline: parking.isReserved
                                //     ? "3px solid rgb(255, 215, 0)"
                                //     : "1px solid white",
                            };
                            return (
                                <div
                                    key={index}
                                    className={`parking ${
                                        parking.isReserved
                                            ? "reservedParking"
                                            : null
                                    }`}
                                    style={ps_styles}
                                    onClick={() => editParking(parking)}
                                >
                                    <h4>{parking.parking_id}</h4>
                                </div>
                            );
                        })}
                    </section>
                    <section className="parking_info">
                        {/* details */}
                        {/* dh = details header, dc = details content */}
                        {/* {props.orgToPass[0].org_name} */}
                        <div className="status_counters">
                            <div className="counters total_parkings">
                                {total_p}
                            </div>
                            <div className="counters available_parkings">
                                {available_p}
                            </div>
                            <div className="counters busy">
                                {total_p - available_p}
                            </div>
                            <div className="counters reserved">
                                {reserved_p}
                            </div>
                        </div>
                        <div className="org_details">
                            <b>Organisation name : </b>
                            {props.org.org_name}
                            <br />
                            <br />
                            <b>Organisation id : </b>
                            {props.org.org_id}
                            <br />
                            <br />
                            <b>Parking address : </b>
                            {props.org.parking_add}
                            <br />
                            <br />
                            <b>Cam IP address : </b>
                            {props.org.vid_src}
                        </div>
                        <div className="map">
                            <b>Map here</b>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Parkings;
