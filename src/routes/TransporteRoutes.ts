import { Router } from "express";
import { TransporteController } from "../controllers/TransporteController";

const router = Router();

router.post("/linhas", TransporteController.criarLinha);
router.get("/linhas", TransporteController.listarLinhas);

router.post("/passageiros", TransporteController.criarPassageiro);
router.get("/passageiros", TransporteController.ListarTodosPassageiros);

router.post("/atribuir", TransporteController.atribuirPassageiro);
router.post("/remover", TransporteController.removerPassageiro);

router.get("/linhas/:numeroLinha/passageiros", TransporteController.listarPassageiros);

export default router;
