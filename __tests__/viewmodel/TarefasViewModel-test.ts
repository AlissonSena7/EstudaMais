import { FakeTarefaRepository } from '@/infra/repositories/FakeTarefaRepository';
import { Tarefa } from '@/model/entities/Tarefa';
import { TarefaRepository } from '@/model/repositories/TarefaRepository';
import { TarefasViewModel } from '@/viewmodel/tarefa/TarefasViewModel';

class RepositorioQueFalha implements TarefaRepository {
  async listar(): Promise<never> {
    throw new Error('Falha ao listar tarefas.');
  }
  async buscarPorId(): Promise<never> {
    throw new Error('Falha.');
  }
  async criar(): Promise<never> {
    throw new Error('Falha.');
  }
  async atualizar(): Promise<never> {
    throw new Error('Falha.');
  }
  async concluir(): Promise<never> {
    throw new Error('Falha.');
  }
  async reabrir(): Promise<never> {
    throw new Error('Falha.');
  }
  async excluir(): Promise<never> {
    throw new Error('Falha.');
  }
}

class RepositorioComFalhaNaListagemAposEscrita implements TarefaRepository {
  constructor(private readonly real: FakeTarefaRepository) {}

  private deveFalharAProximaListagem = false;

  agendarFalhaNaProximaListagem(): void {
    this.deveFalharAProximaListagem = true;
  }

  async listar(): Promise<Tarefa[]> {
    if (this.deveFalharAProximaListagem) {
      this.deveFalharAProximaListagem = false;
      throw new Error('Falha ao listar após gravação.');
    }
    return this.real.listar();
  }

  async buscarPorId(id: string) {
    return this.real.buscarPorId(id);
  }
  async criar(input: Parameters<TarefaRepository['criar']>[0]) {
    return this.real.criar(input);
  }
  async atualizar(id: string, input: Parameters<TarefaRepository['atualizar']>[1]) {
    return this.real.atualizar(id, input);
  }
  async concluir(id: string) {
    return this.real.concluir(id);
  }
  async reabrir(id: string) {
    return this.real.reabrir(id);
  }
  async excluir(id: string) {
    return this.real.excluir(id);
  }
}

describe('TarefasViewModel', () => {
  it('carrega, cria, alterna status e exclui', async () => {
    const repo = new FakeTarefaRepository();
    const vm = new TarefasViewModel(repo);

    await vm.carregar();
    expect(vm.obterEstado().tarefas).toEqual([]);
    expect(vm.obterEstado().carregando).toBe(false);

    const criou = await vm.criar({ titulo: 'Estudar PDM' });
    expect(criou).toBe(true);
    expect(vm.obterEstado().tarefas.map((t) => t.titulo)).toEqual(['Estudar PDM']);

    const id = vm.obterEstado().tarefas[0].id;
    await vm.alternarStatus(id);
    expect(vm.obterEstado().tarefas[0].status).toBe('concluida');

    await vm.alternarStatus(id);
    expect(vm.obterEstado().tarefas[0].status).toBe('pendente');

    await vm.excluir(id);
    expect(vm.obterEstado().tarefas).toEqual([]);
  });

  it('atualiza uma tarefa existente', async () => {
    const vm = new TarefasViewModel(new FakeTarefaRepository());
    await vm.criar({ titulo: 'Antiga' });
    const id = vm.obterEstado().tarefas[0].id;

    const ok = await vm.atualizar(id, { titulo: 'Nova' });
    expect(ok).toBe(true);
    expect(vm.obterEstado().tarefas[0].titulo).toBe('Nova');
  });

  it('expõe erro de validação e mantém o formulário', async () => {
    const vm = new TarefasViewModel(new FakeTarefaRepository());

    const ok = await vm.criar({ titulo: '' });
    expect(ok).toBe(false);
    expect(vm.obterEstado().erro).toBeTruthy();
    expect(vm.obterEstado().tarefas).toEqual([]);
  });

  it('expõe erro do repositório no carregamento', async () => {
    const vm = new TarefasViewModel(new RepositorioQueFalha());

    await vm.carregar();
    expect(vm.obterEstado().erro).toBe('Falha ao listar tarefas.');
    expect(vm.obterEstado().carregando).toBe(false);
  });

  it('notifica ouvintes e permite cancelar inscrição', async () => {
    const vm = new TarefasViewModel(new FakeTarefaRepository());
    const ouvinte = jest.fn();
    const cancelar = vm.inscrever(ouvinte);

    await vm.carregar();
    expect(ouvinte).toHaveBeenCalled();

    const chamadas = ouvinte.mock.calls.length;
    cancelar();
    await vm.criar({ titulo: 'X' });
    expect(ouvinte.mock.calls.length).toBe(chamadas);
  });

  it('mantém sucesso na criação quando apenas a recarga falha', async () => {
    const repo = new RepositorioComFalhaNaListagemAposEscrita(new FakeTarefaRepository());
    const vm = new TarefasViewModel(repo);

    repo.agendarFalhaNaProximaListagem();
    const ok = await vm.criar({ titulo: 'Estudar' });

    expect(ok).toBe(true);
    expect(vm.obterEstado().erro).toBeNull();
    expect(vm.obterEstado().aviso).toBeTruthy();
    expect(vm.obterEstado().carregando).toBe(false);
  });

  it('mantém sucesso na atualização quando apenas a recarga falha', async () => {
    const repo = new RepositorioComFalhaNaListagemAposEscrita(new FakeTarefaRepository());
    const vm = new TarefasViewModel(repo);

    await vm.criar({ titulo: 'Antiga' });
    const id = vm.obterEstado().tarefas[0].id;

    repo.agendarFalhaNaProximaListagem();
    const ok = await vm.atualizar(id, { titulo: 'Nova' });

    expect(ok).toBe(true);
    expect(vm.obterEstado().erro).toBeNull();
    expect(vm.obterEstado().aviso).toBeTruthy();
    expect(vm.obterEstado().carregando).toBe(false);
  });

  it('reporta falha de persistência como erro, sem aviso', async () => {
    const vm = new TarefasViewModel(new RepositorioQueFalha());

    const ok = await vm.criar({ titulo: 'Estudar' });
    expect(ok).toBe(false);
    expect(vm.obterEstado().erro).toBe('Falha.');
    expect(vm.obterEstado().aviso).toBeNull();
  });
});
