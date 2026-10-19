import { Tarefa } from '../../model/entities/Tarefa';
import { TarefaRepository } from '../../model/repositories/TarefaRepository';

export class ConcluirTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(id: string): Promise<Tarefa> {
    return this.repository.concluir(id);
  }

  async reabrir(id: string): Promise<Tarefa> {
    return this.repository.reabrir(id);
  }
}
