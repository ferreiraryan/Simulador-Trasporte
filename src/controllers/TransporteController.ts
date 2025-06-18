import { Request, Response } from "express";
import { TransporteService } from "../services/TransporteService";

const transporte = new TransporteService();

export const TransporteController = {
  criarLinha(req: Request, res: Response) {
    const { numero, trajeto, tipo } = req.body;
    const linha = transporte.cadastrarLinha(numero, trajeto, tipo);
    res.status(201).json(linha);
  },

  listarLinhas(req: Request, res: Response) {
    res.json(transporte.listarLinhas());
  },

  ListarTodosPassageiros(req: Request, res: Response) {
    res.json(transporte.listarTodosPassageiros());
  },

  criarPassageiro(req: Request, res: Response) {
    const { nome, cpf } = req.body;
    const passageiro = transporte.cadastrarPassageiro(nome, cpf);
    res.status(201).json(passageiro);
  },

  atribuirPassageiro(req: Request, res: Response) {
    const { cpf, numeroLinha } = req.body;
    const ok = transporte.atribuirPassageiroALinha(cpf, numeroLinha);
    res.status(ok ? 200 : 404).json({ sucesso: ok });
  },

  listarPassageiros(req: Request, res: Response) {
    const { numeroLinha } = req.params;
    const passageiros = transporte.listarPassageiros(numeroLinha);
    res.json(passageiros);
  },

  removerPassageiro(req: Request, res: Response) {
    const { numeroLinha, cpf } = req.body;
    const ok = transporte.removerPassageiroDaLinha(cpf, numeroLinha);
    res.status(ok ? 200 : 404).json({ sucesso: ok });
  }
};
