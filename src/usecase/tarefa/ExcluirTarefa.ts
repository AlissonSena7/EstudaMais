import { TarefaRepository } from '../../model/repositories/TarefaRepository';

export class ExcluirTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(id: string): Promise<void> {
    await this.repository.excluir(id);
  }
}
