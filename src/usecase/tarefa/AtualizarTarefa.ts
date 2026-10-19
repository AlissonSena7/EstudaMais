import { AtualizarTarefaInput, Tarefa } from '../../model/entities/Tarefa';
import { TarefaRepository } from '../../model/repositories/TarefaRepository';
import { validarAtualizarTarefa } from '../../model/services/ValidarTarefa';

export class AtualizarTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(id: string, input: AtualizarTarefaInput): Promise<Tarefa> {
    const dados = validarAtualizarTarefa(input);
    return this.repository.atualizar(id, dados);
  }
}
