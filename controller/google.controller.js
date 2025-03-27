require("dotenv").config();
const { google } = require("googleapis");
const dayjs = require("dayjs");
const Todo = require('../models/todos.model');
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT
);

let tokens = {};

// Redirect user to Google login page
function getGoogleCalender(req, res) {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/calendar",
  });
  res.redirect(url);
}

// Handle Google OAuth callback
function getCallbackUrl(req, res) {
  const code = req.query.code;
  oauth2Client.getToken(code, (err, newTokens) => {
    if (err) {
      console.error("Couldn't get token", err);
      res.send("Error");
      return;
    }
    tokens = newTokens;
    oauth2Client.setCredentials(newTokens);
    res.redirect("/event-form");
  });
}

// Render the event creation form
function renderEventForm(req, res) {
  res.render("calendar/calendar");
}

// Handle form submission and create event in Google Calendar
async function makeEvents(req, res) {
  oauth2Client.setCredentials(tokens);

  oauth2Client.on("tokens", (newTokens) => {
    if (newTokens.refresh_token) {
      tokens.refresh_token = newTokens.refresh_token;
    }
    tokens.access_token = newTokens.access_token;
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const { summary, description, startDateTime, endDateTime } = req.body;

    const event = {
      summary: summary,
      description: description,
      start: {
        dateTime: dayjs(startDateTime).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: dayjs(endDateTime).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: "email",
            minutes: 15,
          },
          {
            method: "email",
            minutes: 60,
          },
          {
            method: "popup",
            minutes: 10,
          },
        ],
      },
    };

    await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    res.redirect("/event-form");
  } catch (error) {
    console.error("Error creating event: ", error);
    res
      .status(500).redirect('/dashboard/calendar')
  }
}

async function addTaskToCalendar(req,res){
  const todoId = req.params.id;
  const todo = await Todo.findTodoById(todoId);
  res.render('calendar/addToCalendar',{todo:todo});
}

module.exports = {
  getGoogleCalender:getGoogleCalender,
  getCallbackUrl:getCallbackUrl,
  renderEventForm:renderEventForm,
  makeEvents:makeEvents,
  addTaskToCalendar:addTaskToCalendar,
};
