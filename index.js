import express from "express";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import { connectDB } from "./src/config/db.js";
import blogRoutes from "./src/blog/blog.route.js";

const app = express();
const PORT = process.env.PORT || 3000;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const isVercel = process.env.VERCEL === "1";

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(currentDirectory, "views"));
app.use(express.static(path.join(currentDirectory, "src", "public")));

app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      return next();
    }
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", blogRoutes);
app.use("/blogs", blogRoutes);
app.get("/about", (req, res) => {
  res.render("about");
});
app.use((req, res) => {
  res.status(404).render("404");
});
app.use((error, req, res, next) => {
  console.error("Request failed:", error.message);
  if (res.headersSent) {
    return next(error);
  }
  res.status(500).render("error");
});

const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

if (!isVercel) {
  startServer();
}

export { app };
export default app;
