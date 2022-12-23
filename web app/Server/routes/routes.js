const express = require("express");
const router = express.Router();
const db = require('../services/db_methods')

// this is the endpoint to get all the organisations stored in our db
router.get('/orgs', (req, res) => {
    db.fetchOrganizations().then(result => {
        res.json(result.recordset)
    })
})

// this is the endpoint to get all the parkings of a particular organisation with org_id
router.get('/parkings/:org_id', (req, res) => {
    db.fetchParkings(req.params.org_id).then(result => {
        res.json(result.recordset)
    })
})
// this is the endpoint to reserve a parking for someone special(company or person)
router.put('/reserveParking/:org_id/:parking_id/', (req, res) => {
    const org_id = req.params.org_id
    const parking_id = req.params.parking_id
    const reservation_details = req.body
    db.reserveParking(org_id, parking_id, reservation_details)
    res.send("ok")
})

// this is the endpoint to save the parking spaces in the parking_spaces table
router.post('/addParkingSpaces', (req, res) => {
    const parkingArr = req.body[0]
    const orgDetails = req.body[1]
    db.createNewOrg(parkingArr, orgDetails)
    // console.log("this is parking array -->", parkingArr);
    // console.log("this is org details -->", orgDetails);
    res.send("parkings added")

})

// this is the endpoint to delete an organization from both the tables in db
router.delete('/deleteOrg/:org_id', (req, res) => {
    // console.log(req.params.org_id);
    db.deleteOrganization(req.params.org_id)
})
module.exports = router;
