const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

require("dotenv").config();
const app = express();

const authRouter = require('./routes/auth.router');
const userRouter = require('./routes/user.router');
const bandRouter = require('./routes/band.router');
const gigRouter = require('./routes/gig.router');

// const router = require('./routes/index');

// MONGOOSE CONNECTION

mongoose
  .connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

app.use(
    session({
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 30 * 24 * 60 * 60, // 30 days
      }),
      secret: process.env.SECRET_SESSION,
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    }),
);

// MIDDLEWARE SETUP

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS SETTINGS (MIDDLEWARE) TO ALLOW CROSS-ORIGIN INTERACTION:

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'] // <== this will be the URL of our React app (it will be running on port 3000)
}));

// ROUTES MIDDLEWARE:

app.use('/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/bands', bandRouter);
app.use('/api/gigs', gigRouter);

module.exports = app;