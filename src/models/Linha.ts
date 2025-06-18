import { Passageiro } from "./Passageiro";

export type TipoLinha = "normal" | "executiva";

export class Linha {
  public passageiros: Passageiro[] = [];

  constructor(
    public numero: string,
    public trajeto: string,
    public tipo: TipoLinha = "normal"
  ) {}

  adicionarPassageiro(p: Passageiro): void {
    this.passageiros.push(p);
  }

  removerPassageiro(cpf: string): void {
    this.passageiros = this.passageiros.filter(p => p.cpf !== cpf);
  }

}
