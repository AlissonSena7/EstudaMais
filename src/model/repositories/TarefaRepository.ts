import { AtualizarTarefaInput, CriarTarefaInput, Tarefa } from '../entities/Tarefa';

export interface TarefaRepository {
  listar(): Promise<Tarefa[]>;
  buscarPorId(id: string): Promise<Tarefa | null>;
  criar(input: CriarTarefaInput): Promise<Tarefa>;
  atualizar(id: string, input: AtualizarTarefaInput): Promise<Tarefa>;
  concluir(id: string): Promise<Tarefa>;
  reabrir(id: string): Promise<Tarefa>;
  excluir(id: string): Promise<void>;
}
