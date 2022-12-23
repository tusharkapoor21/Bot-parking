import React from "react";
import { useState } from "react";
import "./OrgForm.css";

const OrgForm = (props) => {
    const [formData, setFormData] = useState({
        org_name: "",
        org_id: props.no_of_orgs + 1,
        parking_add: "",
        cam_ip: "",
    });
    const onChangeHandler = (e) => {
        if (e.target.name === "orgName") {
            setFormData({ ...formData, org_name: e.target.value });
        }
        if (e.target.name === "orgID") {
            setFormData({ ...formData, org_id: e.target.value });
        }
        if (e.target.name === "prkAdd") {
            setFormData({ ...formData, parking_add: e.target.value });
        }
        if (e.target.name === "camIP") {
            setFormData({ ...formData, cam_ip: e.target.value });
        }
    };
    const onClick = (e) => {
        e.preventDefault();
        // console.log(formData);
        props.setOrgDetails(formData);
        props.closeForm(false);
    };

    return (
        <>
            <form id="organisation_form">
                <div className="form-group">
                    <label>Organisation name</label>
                    <input
                        className="inputField"
                        type="text"
                        onChange={onChangeHandler}
                        name="orgName"
                        value={formData.org_name}
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>Organisation ID</label>
                    <input
                        className="inputField"
                        type="number"
                        onChange={onChangeHandler}
                        name="orgID"
                        value={formData.org_id}
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>Parking Address</label>
                    <input
                        className="inputField"
                        type="text"
                        onChange={onChangeHandler}
                        name="prkAdd"
                        value={formData.parking_add}
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>Camera IP</label>
                    <input
                        className="inputField"
                        type="text"
                        onChange={onChangeHandler}
                        name="camIP"
                        value={formData.cam_ip}
                        autoComplete="off"
                    />
                </div>
                <button className="btn" onClick={onClick}>
                    Save
                </button>
            </form>
        </>
    );
};

export default OrgForm;
