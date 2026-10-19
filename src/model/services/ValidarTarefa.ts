import { AtualizarTarefaInput, CriarTarefaInput } from '../entities/Tarefa';

export class ValidacaoTarefaError extends Error {
  constructor(
    message: string,
    public readonly campo?: keyof CriarTarefaInput | keyof AtualizarTarefaInput
  ) {
    super(message);
    this.name = 'ValidacaoTarefaError';
  }
}

const TITULO_MAX = 120;
const DESCRICAO_MAX = 2000;

function normalizarTexto(valor: string): string {
  return valor.trim();
}

export function validarTitulo(titulo: unknown): string {
  if (typeof titulo !== 'string') {
    throw new ValidacaoTarefaError('O título é obrigatório.', 'titulo');
  }
  const limpo = normalizarTexto(titulo);
  if (limpo.length === 0) {
    throw new ValidacaoTarefaError('O título é obrigatório.', 'titulo');
  }
  if (limpo.length > TITULO_MAX) {
    throw new ValidacaoTarefaError(
      `O título deve ter no máximo ${TITULO_MAX} caracteres.`,
      'titulo'
    );
  }
  return limpo;
}

export function validarDescricao(descricao: unknown): string | null {
  if (descricao === undefined || descricao === null) return null;
  if (typeof descricao !== 'string') {
    throw new ValidacaoTarefaError('A descrição é inválida.', 'descricao');
  }
  const limpo = normalizarTexto(descricao);
  if (limpo.length === 0) return null;
  if (limpo.length > DESCRICAO_MAX) {
    throw new ValidacaoTarefaError(
      `A descrição deve ter no máximo ${DESCRICAO_MAX} caracteres.`,
      'descricao'
    );
  }
  return limpo;
}

export function validarDataLimite(dataLimite: unknown): string | null {
  if (dataLimite === undefined || dataLimite === null) return null;
  if (typeof dataLimite !== 'string') {
    throw new ValidacaoTarefaError('A data limite é inválida.', 'dataLimite');
  }
  const limpo = normalizarTexto(dataLimite);
  if (limpo.length === 0) return null;
  const timestamp = Date.parse(limpo);
  if (Number.isNaN(timestamp)) {
    throw new ValidacaoTarefaError('A data limite é inválida.', 'dataLimite');
  }
  return new Date(timestamp).toISOString();
}

export function validarCriarTarefa(input: CriarTarefaInput): CriarTarefaInput {
  return {
    titulo: validarTitulo(input?.titulo),
    descricao: validarDescricao(input?.descricao),
    dataLimite: validarDataLimite(input?.dataLimite),
  };
}

export function validarAtualizarTarefa(input: AtualizarTarefaInput): AtualizarTarefaInput {
  const resultado: AtualizarTarefaInput = {};
  if (input?.titulo !== undefined) {
    resultado.titulo = validarTitulo(input.titulo);
  }
  if (input?.descricao !== undefined) {
    resultado.descricao = validarDescricao(input.descricao);
  }
  if (input?.dataLimite !== undefined) {
    resultado.dataLimite = validarDataLimite(input.dataLimite);
  }
  if (Object.keys(resultado).length === 0) {
    throw new ValidacaoTarefaError('Nenhum campo para atualizar foi informado.');
  }
  return resultado;
}
