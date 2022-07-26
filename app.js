require("dotenv/config");
require("./db");
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware"); // <== IMPORT


const app = express();
require("./config")(app);


// 👇 MIDDLEWARE MISSING
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/api/auth", authRouter);

const projectRouter = require("./routes/project.routes");
app.use("/api", isAuthenticated, projectRouter);
// app.use("/api", projectRouter);

const taskRouter = require("./routes/task.routes");
app.use("/api",isAuthenticated, taskRouter);
// app.use("/api", taskRouter);

const pollRouter = require("./routes/poll.routes");
app.use("/api",isAuthenticated, pollRouter);       
// app.use("/api", pollRouter);

const questionRouter = require("./routes/question.routes");
app.use("/api",isAuthenticated, questionRouter);      
// app.use("/api", questionRouter);

const answerRouter = require("./routes/answer.routes");
app.use("/api",isAuthenticated, answerRouter);           
// app.use("/api", answerRouter);


// app.use((req, res, next) => {
//     // If no routes match, send them the React HTML.
//     res.sendFile(__dirname + "/public/index.html");
//   });

// require("./error-handling")(app);

module.exports = app;
