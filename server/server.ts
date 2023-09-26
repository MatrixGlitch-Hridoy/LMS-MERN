import { app } from "./app";
import connectDB from "./db/db";
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Create Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
