const express = require('express');
const router = express.Router();
const googleController = require('../controller/google.controller')


router.get('/dashboard/calendar',googleController.getGoogleCalender);

router.get('/redirect',googleController.getCallbackUrl);

// router.get('/calendar',googleController.getCalendar);

router.get("/event-form", googleController.renderEventForm);

router.post("/create-event", googleController.makeEvents);

//Add a task to the calendar directly from the dashboard

router.get("/event-form/:id",googleController.addTaskToCalendar);


module.exports = router;