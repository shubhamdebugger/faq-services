import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import UserRoutes from "./routes/userRoutes.js";
import AdminRoutes from "./routes/adminRoutes.js";
import FaqLogsRoutes from "./routes/faqLogsRoutes.js";
import FaqRoutes from "./routes/faqRoutes.js";
import CategoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

app.use("/api/users", UserRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/faqlogs", FaqLogsRoutes);
app.use("/api/faq-section", FaqRoutes);
app.use("/api/category", CategoryRoutes);

app.get("/", (req, res) => {
  res.send("FAQ microservices is running....");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
