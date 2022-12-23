import { React, useState, useEffect } from "react";
import "./Modal.css";

const Modal = (props) => {
    const [name, setName] = useState(
        props.parking.reservedFor === null ? "" : props.parking.reservedFor
    );
    const [reserved, setReserved] = useState({
        isReserved: props.parking.isReserved,
        reservedFor: props.parking.reservedFor,
    });

    const onSave = (e) => {
        e.preventDefault();
        // checks if the reserve button is pressed
        if (e.target.name === "Reserve") {
            if (!name) {
                alert(`"Reserved For" field can't be empty!!`);
            } else {
                setReserved({ isReserved: true });
                fetch(
                    `http://localhost:4000/api/reserveParking/${props.parking.org_id}/${props.parking.parking_id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            isReserved: true,
                            reservedFor: name,
                        }),
                    }
                );
                setTimeout(() => {
                    props.close({ show: false, parking_id: null });
                }, 1000);
            }
        }
        if (e.target.name === "Remove") {
            setReserved({ isReserved: false });
            fetch(
                `http://localhost:4000/api/reserveParking/${props.parking.org_id}/${props.parking.parking_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        isReserved: false,
                        reservedFor: name,
                    }),
                }
            );
            props.close({ show: false, parking_id: null });
        }
    };

    const parkingStyles = {
        top: `${props.parking.y_tlc}px`,
        left: `${props.parking.x_tlc}px`,
        height: "100px",
        width: "60px",
        backgroundColor: props.parking.isAvailable
            ? "rgba(129, 233, 129, 0.315)" //green color
            : "rgba(233, 129, 129, 0.315)", //red color
        border: props.parking.isAvailable
            ? "1px solid rgb(129, 233, 129)"
            : "1px solid rgb(233, 129, 129)",
        outline: reserved.isReserved
            ? "3px solid rgb(255, 215, 0)"
            : "1px solid white",
    };
    // const onClickHandler = () => {
    //     setReserved(false);
    // };
    return (
        <>
            <div className="modalContainer">
                <div className="modal">
                    <div className="btns">
                        <button
                            className="closeModal"
                            onClick={() =>
                                props.close({ show: false, parking_id: null })
                            }
                        >
                            <p>+</p>
                        </button>
                    </div>
                    <div className="content">
                        <div className="parking_preview">
                            <div
                                className="parking"
                                style={parkingStyles}
                                // onClick={() =>
                                //     setReserved({
                                //         isReserved: !reserved.isReserved,
                                //         reservedFor: "",
                                //     })
                                // }
                            >
                                {props.parking.parking_id}
                            </div>
                        </div>

                        <div className="details">
                            {!reserved.reservedFor ? (
                                <>
                                    <div className="inner_container">
                                        <div className="items">
                                            <h5>Reserved for : </h5>
                                            <input
                                                className="inputField"
                                                type="text"
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                }}
                                                autoComplete="off"
                                                autoCorrect="off"
                                            />
                                        </div>
                                        <div className="items">
                                            <button
                                                name="Reserve"
                                                className="btn_in_table edit"
                                                onClick={(e) => onSave(e)}
                                            >
                                                Reserve
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="inner_container">
                                        <div className="items">
                                            <h5>Reserved for : </h5>
                                            {reserved.reservedFor}
                                        </div>
                                        <div className="items">
                                            <button
                                                name="Remove"
                                                className="btn_in_table dlt"
                                                onClick={(e) => onSave(e)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
