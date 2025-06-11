// index.ts
// API para o Simulador de Transporte Urbano em TypeScript
// Grupo 11 - por Ryan Ferreira (com assistência da IA)

// 1. IMPORTAÇÕES
import express, { Request, Response } from 'express';
import crypto from 'crypto';

// 2. DEFINIÇÃO DE TIPOS (INTERFACES)
// Interfaces para os nossos dados principais
interface Passageiro {
    id: string;
    nome: string;
    documento: string;
}

interface Linha {
    id: string;
    numero: string;
    nome: string;
    tipo: 'Normal' | 'Executiva';
    capacidade: number;
    trajeto: string[];
    passageiros: string[];
}


interface CreateLinhaBody {
    numero: string;
    nome: string;
    tipo?: 'Normal' | 'Executiva';
    capacidade: number;
    trajeto: string[];
}

interface CreatePassageiroBody {
    nome: string;
    documento: string;
}

interface LinhaParams {
    id: string;
}

interface AddPassageiroBody {
    passageiroId: string;
}

interface PassageiroLinhaParams {
    linhaId: string;
    passageiroId: string;
}


const app = express();
app.use(express.json());


let linhas: Linha[] = [];
let passageiros: Passageiro[] = [];



// [POST] /linhas - Cadastrar uma nova linha
app.post('/linhas', (req: Request<{}, {}, CreateLinhaBody>, res: Response) => {
    const { numero, nome, tipo = 'Normal', capacidade, trajeto } = req.body;

    if (!numero || !nome || !capacidade || !trajeto) {
        res.status(400).json({ message: "Dados incompletos. É necessário: numero, nome, capacidade e trajeto." });
        return ;
    }

    const novaLinha: Linha = {
        id: crypto.randomUUID(),
        numero,
        nome,
        tipo,
        capacidade,
        trajeto,
        passageiros: []
    };

    linhas.push(novaLinha);
    res.status(201).json(novaLinha);
});

// [GET] /linhas - Listar todas as linhas ativas
app.get('/linhas', (req: Request, res: Response) => {
    const linhasInfo = linhas.map(linha => ({
        ...linha,
        lotacaoAtual: linha.passageiros.length
    }));
    res.status(200).json(linhasInfo);
});


// =================================================================
//  ROTAS DE PASSAGEIROS
// =================================================================

// [POST] /passageiros - Cadastrar um novo passageiro
app.post('/passageiros', (req: Request<{}, {}, CreatePassageiroBody>, res: Response) => {
    const { nome, documento } = req.body;

    if (!nome || !documento) {
        res.status(400).json({ message: "Dados incompletos. É necessário: nome e documento." });
        return ;
    }

    if (passageiros.some(p => p.documento === documento)) {
        res.status(409).json({ message: "Passageiro com este documento já cadastrado." });
        return;
    }

    const novoPassageiro: Passageiro = {
        id: crypto.randomUUID(),
        nome,
        documento
    };

    passageiros.push(novoPassageiro);
    res.status(201).json(novoPassageiro);
});

// [GET] /passageiros - Listar todos os passageiros
app.get('/passageiros', (req: Request, res: Response) => {
    res.status(200).json(passageiros);
});


// =================================================================
//  ROTAS DE INTERAÇÃO (PASSAGEIROS <-> LINHAS)
// =================================================================

// [POST] /linhas/:id/passageiros - Atribuir um passageiro a uma linha
app.post('/linhas/:id/passageiros', (req: Request<LinhaParams, {}, AddPassageiroBody>, res: Response) => {
    const { id: linhaId } = req.params;
    const { passageiroId } = req.body;

    const linha = linhas.find(l => l.id === linhaId);
    const passageiro = passageiros.find(p => p.id === passageiroId);

    if (!linha){ 
        res.status(404).json({ message: "Linha não encontrada." });
        return ;
    }
    if (!passageiro){
        res.status(404).json({ message: "Passageiro não encontrado." });
        return;
    } 

    if (linha.passageiros.length >= linha.capacidade) {
        res.status(409).json({ message: `Linha ${linha.numero} está lotada.` });
        return ;
    }

    if (linha.passageiros.includes(passageiroId)) {
        res.status(409).json({ message: `Passageiro ${passageiro.nome} já está na linha ${linha.numero}.` });
        return;
    }

    linha.passageiros.push(passageiroId);
    res.status(200).json({ message: `Passageiro ${passageiro.nome} adicionado à linha ${linha.numero}.` });
});

// [GET] /linhas/:id/passageiros - Visualizar todos os passageiros de uma linha
app.get('/linhas/:id/passageiros', (req: Request<LinhaParams>, res: Response) => {
    const { id: linhaId } = req.params;
    const linha = linhas.find(l => l.id === linhaId);

    if (!linha) {
        res.status(404).json({ message: "Linha não encontrada." });
        return ;
    }
    
    const passageirosDaLinha: Passageiro[] = linha.passageiros
        .map(pId => passageiros.find(p => p.id === pId))
        .filter((p): p is Passageiro => p !== undefined);

    res.status(200).json(passageirosDaLinha);
});

// [DELETE] /linhas/:linhaId/passageiros/:passageiroId - Remover um passageiro de uma linha
app.delete('/linhas/:linhaId/passageiros/:passageiroId', (req: Request<PassageiroLinhaParams>, res: Response) => {
    const { linhaId, passageiroId } = req.params;

    const linha = linhas.find(l => l.id === linhaId);

    if (!linha) {
        res.status(404).json({ message: "Linha não encontrada." });
        return ;
    }

    const passageiroIndex = linha.passageiros.findIndex(pId => pId === passageiroId);

    if (passageiroIndex === -1) {
        res.status(404).json({ message: "Passageiro não está nesta linha." });
        return;
    }

    linha.passageiros.splice(passageiroIndex, 1);
    res.status(200).json({ message: "Passageiro removido da linha com sucesso." });
});


// =================================================================
//  INICIALIZAÇÃO DO SERVIDOR
// =================================================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor TS do Simulador de Transporte rodando na porta ${PORT}`);
    console.log(`Acesse em http://localhost:${PORT}`);
});