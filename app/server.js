import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();


const FRONTEND_PATH = path.resolve(__dirname, "../frontend");


app.use(express.static(FRONTEND_PATH));

app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "login.html"));
});


const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
