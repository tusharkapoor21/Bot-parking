const sql = require('./db')

// function to fetch all parking lots in the database
async function fetchOrganizations() {
    const result = await sql('select * from parking_lots')
    return result
}

// function to fetch all parking lots of a particular organisation with org_id
async function fetchParkings(org_id) {
    const result = await sql(`select * from parking_spaces where org_id = ${org_id}`)
    return result
}

// function to reserve a parking space for someone
async function reserveParking(org_id, parking_id, resDetails) {
    console.log(org_id);
    console.log(parking_id);
    console.log(resDetails);
    if (resDetails.isReserved) {
        sql(`update parking_spaces set isReserved=1, reservedFor='${resDetails.reservedFor}' where org_id=${org_id} and parking_id=${parking_id}`)
    } else {
        sql(`update parking_spaces set isReserved=0, reservedFor=NULL where org_id=${org_id} and parking_id=${parking_id}`)
    }
}


async function deleteOrganization(org_id) {
    sql(`delete from parking_lots where org_id=${org_id}`)
    sql(`delete from parking_spaces where org_id=${org_id}`)
}

// function to add new parking spaces in the parking_spaces table in the database
async function createNewOrg(parkingArr, orgDetails) {
    console.log(parkingArr);
    console.log(orgDetails);

    // deleteOrganization(orgDetails.org_id)

    sql(`insert into parking_lots values('${orgDetails.org_name}', ${orgDetails.org_id}, '${orgDetails.parking_add}', '${orgDetails.cam_ip}')`)

    parkingArr.forEach(parking => {
        sql(`insert into parking_spaces values(
            ${parking.parking_id}, ${orgDetails.org_id}, ${parking.tlc[0]}, ${parking.tlc[1]}, ${parking.brc[0]}, ${parking.brc[1]}, 'latitude', 'longitude', 0, 1,NULL 
            )`)
    });
}


module.exports = { fetchParkings, fetchOrganizations, createNewOrg, deleteOrganization, reserveParking }