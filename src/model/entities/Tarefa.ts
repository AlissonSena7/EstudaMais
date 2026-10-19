export type TarefaStatus = 'pendente' | 'concluida';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string | null;
  status: TarefaStatus;
  dataLimite: string | null;
  criadaEm: string;
  atualizadaEm: string;
}

export interface CriarTarefaInput {
  titulo: string;
  descricao?: string | null;
  dataLimite?: string | null;
}

export interface AtualizarTarefaInput {
  titulo?: string;
  descricao?: string | null;
  dataLimite?: string | null;
}
