import { useState } from "react";
import "./NewOrg.css";
import SA from "./SelectionArea/SA";
import OrgForm from "./SelectionArea/OrgForm";

const NewOrg = (props) => {
    const [orgDetails, setOrgDetails] = useState({
        org_name: "",
        org_id: "",
        parking_add: "",
        cam_ip: "",
    });
    const [show, setShow] = useState({ sa: false, form: true });
    const [img, setImg] = useState({ imgObj: null, height: 0, width: 0 });
    const [mouse, setMouse] = useState({ x: null, y: null });
    const [parkingArr, setParkingArr] = useState([]);
    const [clearCanvas, setClearCanvas] = useState(false);

    const imgHandler = (e) => {
        const imgFile = e.target.files[0];
        const img = new Image();
        img.src = URL.createObjectURL(imgFile);
        img.onload = () => {
            setImg({ imgObj: img, height: img.height, width: img.width });
            setShow({ ...show, sa: true });
        };
    };

    const onDelete = (parking_id) => {
        if (parking_id === -1) setParkingArr([]);
        else {
            const remaining_parkings = parkingArr.filter(
                (parking) => parking.parking_id !== parking_id
            );
            setParkingArr(remaining_parkings);
        }
    };
    const onEdit = () => {};

    const onSave = () => {
        fetch("http://localhost:4000/api/addParkingSpaces", {
            method: "POST",
            body: JSON.stringify([parkingArr, orgDetails]),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
        props.setNewOrg({ show: false });
    };

    return (
        <>
            <div className="container">
                <div className="btnsContainer">
                    <button
                        className="back"
                        onClick={() => props.setNewOrg(false)}
                    >
                        back
                    </button>
                </div>
                <div className="sectionContainer">
                    <section className="imgContainer">
                        {show.sa ? (
                            <SA
                                img={img}
                                parkingArr={parkingArr}
                                setParkingArr={setParkingArr}
                                clear={clearCanvas}
                                setClearCanvas={setClearCanvas}
                            />
                        ) : (
                            <>
                                {show.form ? (
                                    <OrgForm
                                        no_of_orgs={props.no_of_orgs}
                                        closeForm={setShow}
                                        setOrgDetails={setOrgDetails}
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        name="myImage"
                                        accept="image/jpg"
                                        onInput={imgHandler}
                                    />
                                )}
                            </>
                        )}
                    </section>
                    <section className="listContainer">
                        {parkingArr.length > 0 ? (
                            <>
                                <table id="parkings">
                                    <thead>
                                        <tr>
                                            <th>TLC</th>
                                            <th>BRC</th>
                                            <th>Parking id</th>
                                            <th>
                                                <button
                                                    className="btn_in_table dlt"
                                                    onClick={() => onDelete(-1)}
                                                >
                                                    clear all
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parkingArr.map((parking, index) => {
                                            return (
                                                <tr className="row" key={index}>
                                                    <td>
                                                        [{parking.tlc[0]} ,{" "}
                                                        {parking.tlc[1]}]
                                                    </td>
                                                    <td>
                                                        [{parking.brc[0]} ,{" "}
                                                        {parking.brc[1]}]
                                                    </td>
                                                    <td>
                                                        {parking.parking_id}
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button
                                                                className="btn_in_table dlt"
                                                                onClick={() =>
                                                                    onDelete(
                                                                        parking.parking_id
                                                                    )
                                                                }
                                                            >
                                                                delete
                                                            </button>
                                                            <button className="btn_in_table edit">
                                                                edit
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div className="btnContainer">
                                    <button className="btn" onClick={onSave}>
                                        save
                                    </button>
                                </div>
                            </>
                        ) : null}
                    </section>
                </div>
            </div>
        </>
    );
};
export default NewOrg;
