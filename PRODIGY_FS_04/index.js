const express = require("express");
const User = require("./model/user");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");
const cors = require("cors");

const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
require("dotenv").config();

/* mongoose connection */
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const mongoString = "mongodb://localhost:27017/chat";
const connect = mongoose.connect(mongoString);
const db = mongoose.connection;

connect
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
    console.log("Database cannot be Connected");
  });

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your secret key",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongoUrl: db.client.s.url }),
  })
);

// Initialize passport
const strategy = new LocalStrategy(User.authenticate());
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

/* Routes */

// Direct access to chat page without authentication
app.get("/", (req, res) => {
  res.render("chatpage.ejs");
});

/* Logout */
app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/* Appointment and Chat Routes */
app.get("/appointment", (req, res) => {
  res.render("chatpage");
});

app.post("/appointment", (req, res) => {
  const { username, room } = req.body;
  res.redirect(`/chat?username=${username}&room=${room}`);
});

app.get("/chat", (req, res) => {
  res.render("chatroom", {
    username: req.query.username,
    room: req.query.room,
  });
});

/* Chat Functionality */
const botName = "LiveChat";
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to LiveChat!"));

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat!`));

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chat messages
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat!`));

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

/* Start the Server */
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`🎯 Server is running on PORT: ${PORT}`);
});
