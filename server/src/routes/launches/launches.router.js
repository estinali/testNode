const express = require('express');
const launchesRouter = express.Router();

const { 
    httpGetAllLaunches, 
    httpAddNewLaunch,
    httpAbortLaunch
 } = require('./launches.controller');
//const { httpAbortLaunch } = require('../../../../client/src/hooks/requests');

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;