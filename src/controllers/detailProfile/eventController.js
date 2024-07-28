const webResponses = require('../../helpers/web/webResponses');
const eventService = require('../../services/detailProfile/eventService');

async function getEvents(req, res) {
    const { userId } = req.params;
    const requesterId = req.user.userId;
    const requesterRole = req.user.role;

    if (requesterId !== parseInt(userId) && requesterRole !== 'ADMIN' && requesterRole !== 'SUPER_ADMIN') {
        return res.status(403).json(webResponses.errorResponse('Access denied. Insufficient permissions.'));
    }

    try {
        const events = await eventService.getEventsByUserId(parseInt(userId));
        const results = events.map(event => ({
            eventName: event.trainingName,
            eventTime: event.eventTime,
            purchaseStatus: event.materials[0]?.type // Assuming one material per event
        }));
        res.status(200).json(webResponses.successResponse('Events fetched successfully', results));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch events'));
    }
}

async function getEventsByToken(req, res) {
    const requesterId = req.user.userId;
    const requesterRole = req.user.role;

    try {
        const events = await eventService.getEventsByUserId(requesterId);
        const results = events.map(event => ({
            eventName: event.trainingName,
            eventTime: event.eventTime,
            purchaseStatus: event.materials[0]?.type // Assuming one material per event
        }));
        res.status(200).json(webResponses.successResponse('Events fetched successfully', results));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch events'));
    }
}

async function getEventDetails(req, res) {
    const requesterId = req.user.userId;
    const requesterRole = req.user.role;

    try {
        const eventDetails = await eventService.getEventDetailsByUserId(requesterId);
        res.status(200).json(webResponses.successResponse('Event details fetched successfully', eventDetails));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch event details'));
    }
}

module.exports = {
    getEvents,
    getEventsByToken,
    getEventDetails
};
