import { AtualizarTarefaInput, CriarTarefaInput, Tarefa } from '../../model/entities/Tarefa';
import { TarefaRepository } from '../../model/repositories/TarefaRepository';
import { AtualizarTarefa } from '../../usecase/tarefa/AtualizarTarefa';
import { ConcluirTarefa } from '../../usecase/tarefa/ConcluirTarefa';
import { CriarTarefa } from '../../usecase/tarefa/CriarTarefa';
import { ExcluirTarefa } from '../../usecase/tarefa/ExcluirTarefa';
import { ListarTarefa } from '../../usecase/tarefa/ListarTarefa';

export interface TarefasEstado {
  tarefas: Tarefa[];
  carregando: boolean;
  erro: string | null;
  aviso: string | null;
}

export type OuvinteTarefas = (estado: TarefasEstado) => void;

const ESTADO_INICIAL: TarefasEstado = {
  tarefas: [],
  carregando: false,
  erro: null,
  aviso: null,
};

const AVISO_RECARGA =
  'A alteração foi salva, mas não foi possível atualizar a lista exibida.';

export class TarefasViewModel {
  private estado: TarefasEstado = { ...ESTADO_INICIAL };
  private readonly ouvintes = new Set<OuvinteTarefas>();

  private readonly listarTarefa: ListarTarefa;
  private readonly criarTarefa: CriarTarefa;
  private readonly atualizarTarefa: AtualizarTarefa;
  private readonly concluirTarefa: ConcluirTarefa;
  private readonly excluirTarefa: ExcluirTarefa;

  constructor(repository: TarefaRepository) {
    this.listarTarefa = new ListarTarefa(repository);
    this.criarTarefa = new CriarTarefa(repository);
    this.atualizarTarefa = new AtualizarTarefa(repository);
    this.concluirTarefa = new ConcluirTarefa(repository);
    this.excluirTarefa = new ExcluirTarefa(repository);
  }

  obterEstado(): TarefasEstado {
    return this.estado;
  }

  inscrever(ouvinte: OuvinteTarefas): () => void {
    this.ouvintes.add(ouvinte);
    return () => {
      this.ouvintes.delete(ouvinte);
    };
  }

  private emitir(patch: Partial<TarefasEstado>): void {
    this.estado = { ...this.estado, ...patch };
    this.ouvintes.forEach((ouvinte) => ouvinte(this.estado));
  }

  private mensagemDeErro(erro: unknown): string {
    if (erro instanceof Error && erro.message) return erro.message;
    return 'Ocorreu um erro inesperado.';
  }

  async carregar(): Promise<void> {
    this.emitir({ carregando: true, erro: null, aviso: null });
    try {
      const tarefas = await this.listarTarefa.executar();
      this.emitir({ tarefas, carregando: false, erro: null });
    } catch (erro) {
      this.emitir({ carregando: false, erro: this.mensagemDeErro(erro) });
    }
  }

  async criar(input: CriarTarefaInput): Promise<boolean> {
    this.emitir({ carregando: true, erro: null, aviso: null });
    try {
      await this.criarTarefa.executar(input);
    } catch (erro) {
      this.emitir({ carregando: false, erro: this.mensagemDeErro(erro) });
      return false;
    }
    await this.recarregarAposEscrita();
    return true;
  }

  async atualizar(id: string, input: AtualizarTarefaInput): Promise<boolean> {
    this.emitir({ carregando: true, erro: null, aviso: null });
    try {
      await this.atualizarTarefa.executar(id, input);
    } catch (erro) {
      this.emitir({ carregando: false, erro: this.mensagemDeErro(erro) });
      return false;
    }
    await this.recarregarAposEscrita();
    return true;
  }

  async alternarStatus(id: string): Promise<void> {
    const tarefa = this.estado.tarefas.find((item) => item.id === id);
    if (!tarefa) return;
    this.emitir({ carregando: true, erro: null, aviso: null });
    try {
      if (tarefa.status === 'concluida') {
        await this.concluirTarefa.reabrir(id);
      } else {
        await this.concluirTarefa.executar(id);
      }
    } catch (erro) {
      this.emitir({ carregando: false, erro: this.mensagemDeErro(erro) });
      return;
    }
    await this.recarregarAposEscrita();
  }

  async excluir(id: string): Promise<void> {
    this.emitir({ carregando: true, erro: null, aviso: null });
    try {
      await this.excluirTarefa.executar(id);
    } catch (erro) {
      this.emitir({ carregando: false, erro: this.mensagemDeErro(erro) });
      return;
    }
    await this.recarregarAposEscrita();
  }

  private async recarregarAposEscrita(): Promise<void> {
    try {
      const tarefas = await this.listarTarefa.executar();
      this.emitir({ tarefas, carregando: false, erro: null, aviso: null });
    } catch {
      this.emitir({ carregando: false, erro: null, aviso: AVISO_RECARGA });
    }
  }
}
