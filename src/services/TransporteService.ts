import { Linha, TipoLinha } from "../models/Linha";
import { Passageiro } from "../models/Passageiro";

export class TransporteService {
  private linhas: Linha[] = [];
  private passageiros: Passageiro[] = [];

  cadastrarLinha(numero: string, trajeto: string, tipo: TipoLinha = "normal") {
    const linha = new Linha(numero, trajeto, tipo);
    this.linhas.push(linha);
    return linha;
  }

  listarLinhas() {
    return this.linhas;
  }

  cadastrarPassageiro(nome: string, cpf: string) {
    const passageiro = new Passageiro(nome, cpf);
    this.passageiros.push(passageiro);
    return passageiro;
  }

  atribuirPassageiroALinha(cpf: string, numeroLinha: string) {
    const passageiro = this.passageiros.find(p => p.cpf === cpf);
    const linha = this.linhas.find(l => l.numero === numeroLinha);
    if (passageiro && linha) {
      linha.adicionarPassageiro(passageiro);
      return true;
    }
    return false;
  }

  listarPassageiros(numeroLinha: string) {
    const linha = this.linhas.find(l => l.numero === numeroLinha);
    return linha?.passageiros || [];
  }

  removerPassageiroDaLinha(cpf: string, numeroLinha: string) {
    const linha = this.linhas.find(l => l.numero === numeroLinha);
    if (linha) {
      linha.removerPassageiro(cpf);
      return true;
    }
    return false;
  }
}
