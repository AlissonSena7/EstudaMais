import { CriarTarefaInput, Tarefa } from '../../model/entities/Tarefa';
import { TarefaRepository } from '../../model/repositories/TarefaRepository';
import { validarCriarTarefa } from '../../model/services/ValidarTarefa';

export class CriarTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(input: CriarTarefaInput): Promise<Tarefa> {
    const dados = validarCriarTarefa(input);
    return this.repository.criar(dados);
  }
}
