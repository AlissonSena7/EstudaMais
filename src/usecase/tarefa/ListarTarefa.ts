import { Tarefa } from '../../model/entities/Tarefa';
import { TarefaRepository } from '../../model/repositories/TarefaRepository';

export class ListarTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(): Promise<Tarefa[]> {
    const tarefas = await this.repository.listar();
    return [...tarefas].sort((a, b) => a.criadaEm.localeCompare(b.criadaEm));
  }
}
