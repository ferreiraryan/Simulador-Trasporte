import express from "express";
import transporteRoutes from "./routes/TransporteRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", transporteRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
