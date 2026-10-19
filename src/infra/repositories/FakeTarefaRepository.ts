import {
  AtualizarTarefaInput,
  CriarTarefaInput,
  Tarefa,
} from '../../model/entities/Tarefa';
import { TarefaRepository } from '../../model/repositories/TarefaRepository';
import { IdGenerator, IdGeneratorAleatorio } from '../id/IdGenerator';

export interface DepsFakeTarefaRepository {
  idGenerator?: IdGenerator;
  relogio?: () => string;
}

export class FakeTarefaRepository implements TarefaRepository {
  private readonly tarefas = new Map<string, Tarefa>();
  private readonly idGenerator: IdGenerator;
  private readonly relogio: () => string;

  constructor(deps: DepsFakeTarefaRepository = {}) {
    this.idGenerator = deps.idGenerator ?? new IdGeneratorAleatorio();
    this.relogio = deps.relogio ?? (() => new Date().toISOString());
  }

  async listar(): Promise<Tarefa[]> {
    return this.clonarTodas();
  }

  async buscarPorId(id: string): Promise<Tarefa | null> {
    const tarefa = this.tarefas.get(id);
    return tarefa ? { ...tarefa } : null;
  }

  async criar(input: CriarTarefaInput): Promise<Tarefa> {
    const agora = this.relogio();
    const tarefa: Tarefa = {
      id: this.idGenerator.gerar(),
      titulo: input.titulo,
      descricao: input.descricao ?? null,
      status: 'pendente',
      dataLimite: input.dataLimite ?? null,
      criadaEm: agora,
      atualizadaEm: agora,
    };
    this.tarefas.set(tarefa.id, tarefa);
    return { ...tarefa };
  }

  async atualizar(id: string, input: AtualizarTarefaInput): Promise<Tarefa> {
    const atual = this.obterOuFalhar(id);
    const tarefa: Tarefa = {
      ...atual,
      titulo: input.titulo ?? atual.titulo,
      descricao: input.descricao !== undefined ? input.descricao : atual.descricao,
      dataLimite: input.dataLimite !== undefined ? input.dataLimite : atual.dataLimite,
      atualizadaEm: this.relogio(),
    };
    this.tarefas.set(id, tarefa);
    return { ...tarefa };
  }

  async concluir(id: string): Promise<Tarefa> {
    return this.alterarStatus(id, 'concluida');
  }

  async reabrir(id: string): Promise<Tarefa> {
    return this.alterarStatus(id, 'pendente');
  }

  async excluir(id: string): Promise<void> {
    if (!this.tarefas.has(id)) {
      throw new Error(`Tarefa ${id} não encontrada.`);
    }
    this.tarefas.delete(id);
  }

  private alterarStatus(id: string, status: Tarefa['status']): Tarefa {
    const atual = this.obterOuFalhar(id);
    const tarefa: Tarefa = { ...atual, status, atualizadaEm: this.relogio() };
    this.tarefas.set(id, tarefa);
    return { ...tarefa };
  }

  private obterOuFalhar(id: string): Tarefa {
    const tarefa = this.tarefas.get(id);
    if (!tarefa) {
      throw new Error(`Tarefa ${id} não encontrada.`);
    }
    return tarefa;
  }

  private clonarTodas(): Tarefa[] {
    return Array.from(this.tarefas.values()).map((tarefa) => ({ ...tarefa }));
  }
}
