const { 
    getAllLaunches, 
    existsLaunchWithID,
    abortLaunchByID,
    scheduleNewLaunch,
} = require('../../models/launches.model');

const {
    getPagination,
} = require('../../services/query');

async function httpGetAllLaunches(req, res) {

    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);

}

async function httpAddNewLaunch(req, res) {

    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(422).json({
            error: 'Missing required launch property',
        });
    }


    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(422).json({
            error: 'Invalid launch date',
        });

    }

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchID = Number(req.params.id);

    const existsLaunch = await existsLaunchWithID(launchID);

    //if launch doesn't exist 
    if (!existsLaunch) {
    return res.status(404).json({
        error: 'Launch not found',
    });
}

    //if exists
    const aborted = await abortLaunchByID(launchID);

    if (!aborted) {
        return res.status(400).json({error: 'Launch not aborted'});
    }


    return res.status(200).json({
        ok: true,
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};