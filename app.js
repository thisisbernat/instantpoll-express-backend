require("dotenv/config");
require("./db");
const express = require("express");
const cors = require('cors');
const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();
require("./config")(app);

app.use(cors({
    origin: '*'
}));

const allRoutes = require("./routes");
app.use("/api", allRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/api/auth", authRouter);

const publicRouter = require("./routes/public.routes");
app.use("/api/public", publicRouter);

const pollRouter = require("./routes/poll.routes");
app.use("/api", isAuthenticated, pollRouter);

const questionRouter = require("./routes/question.routes");
app.use("/api", isAuthenticated, questionRouter);

const answerRouter = require("./routes/answer.routes");
app.use("/api", isAuthenticated, answerRouter);



// app.use((req, res, next) => {
//     // If no routes match, send them the React HTML.
//     res.sendFile(__dirname + "/public/index.html");
//   });

// require("./error-handling")(app);

module.exports = app;
