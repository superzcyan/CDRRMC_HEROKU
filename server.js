const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectToMongodb = require("./utils/connectToMongodb");
const app = express();
const bodyParser = require("body-parser");
const { PORT } = require("./config");
const path = require("path");

connectToMongodb();

app.use(express.json());
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Images middleware
app.use(express.static(path.join(__dirname, "/app_data")));

app.use(express.static("client/build"));

// app.get('*', (req, res) => {
// 	res.sendFile(path.resolve__dirname, 'client', 'build', 'index.html');
// });

//Route to evacuees
const evacueesRouter = require("./routers/evacuees");
app.use("/evacuees", evacueesRouter);

//Route to baranggay
const brgyRouter = require("./routers/baranggays");
app.use("/brgy", brgyRouter);

//Route to municipality
const municipalityRouter = require("./routers/municipality");
app.use("/municipality", municipalityRouter);

//Route to users
const userRouter = require("./routers/user");
app.use("/users", userRouter);

//Route to login
const loginRouter = require("./routers/login");
app.use("/login", loginRouter);

app.listen(PORT, () => {
	console.log("Server Started");
});
