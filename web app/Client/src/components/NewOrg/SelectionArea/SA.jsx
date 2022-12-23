import { React, useState, useEffect, useRef } from "react";
import "./SA.css";

const SA = (props) => {
    const [pts, setPts] = useState(props.parkingArr);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [parking, setParking] = useState({
        tlc: null,
        brc: null,
        parking_id: null,
    });
    // parking_id, org_id, x_tlc, y_tlc, x_brc, y_brc, 'latitude', 'longitude', isReserved, isAvailable
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (props.clear) {
            ctx.clearRect(0, 0, canvas.height, canvas.width);
            props.setClearCanvas(false);
        }
    };
    useEffect(() => {
        // alert("UE called");
        // alert("use Effect called");
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.height, canvas.width);
        // if (props.clear) {
        //     props.setClearCanvas(false);
        // }
        ctx.drawImage(props.img.imgObj, 0, 0);
        ctx.lineCap = "round";
        ctx.strokeStyle = "rgb(52, 232, 32)";
        ctx.lineWidth = 3;
        ctxRef.current = ctx;

        props.parkingArr.map((parking) => {
            let w = parking.brc[0] - parking.tlc[0];
            let h = parking.brc[1] - parking.tlc[1];
            ctxRef.current.setLineDash([5]);
            ctxRef.current.strokeRect(parking.tlc[0], parking.tlc[1], w, h);
        });
    }, [props.parkingArr]);

    const clickHandler = (e) => {
        let rect = e.target.getBoundingClientRect();
        let x = Math.floor(e.clientX - rect.left);
        let y = Math.floor(e.clientY - rect.top);
        if (parking.tlc === null) {
            const tlc = [x, y];
            setParking({ ...parking, tlc });
            return;
        }
        if (parking.brc === null) {
            const brc = [x, y];
            setParking({ ...parking, brc });
            props.setParkingArr([
                ...props.parkingArr,
                { ...parking, brc, parking_id: props.parkingArr.length },
            ]);
        }
        setParking({
            tlc: null,
            brc: null,
            parking_id: null,
        });
    };

    return (
        <>
            <div className="canvasContainer">
                <canvas
                    height={props.img.height}
                    width={props.img.width}
                    id="parkingSelectorCanvas"
                    ref={canvasRef}
                    onClick={clickHandler}
                />
            </div>
        </>
    );
};

export default SA;
