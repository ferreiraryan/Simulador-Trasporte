import { Router } from "express";
import { TransporteController } from "../controllers/TransporteController";

const router = Router();

router.post("/linhas", TransporteController.criarLinha);
router.get("/linhas", TransporteController.listarLinhas);

router.post("/passageiros", TransporteController.criarPassageiro);
router.post("/atribuir", TransporteController.atribuirPassageiro);
router.get("/linhas/:numeroLinha/passageiros", TransporteController.listarPassageiros);
router.post("/remover", TransporteController.removerPassageiro);

export default router;
