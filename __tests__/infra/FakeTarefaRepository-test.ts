import { FakeTarefaRepository } from '@/infra/repositories/FakeTarefaRepository';

describe('FakeTarefaRepository', () => {
  function criarRepositorio() {
    return new FakeTarefaRepository({
      idGenerator: {
        gerar: (() => {
          let n = 0;
          return () => `id-${++n}`;
        })(),
      },
    });
  }

  it('inicia sem tarefas', async () => {
    const repo = criarRepositorio();
    await expect(repo.listar()).resolves.toEqual([]);
  });

  it('cria uma tarefa pendente com metadados', async () => {
    const repo = criarRepositorio();
    const tarefa = await repo.criar({ titulo: 'Estudar', descricao: null, dataLimite: null });

    expect(tarefa.id).toBe('id-1');
    expect(tarefa.status).toBe('pendente');
    expect(tarefa.titulo).toBe('Estudar');
    expect(tarefa.criadaEm).toBe(tarefa.atualizadaEm);
  });

  it('lista as tarefas criadas', async () => {
    const repo = criarRepositorio();
    await repo.criar({ titulo: 'A', descricao: null, dataLimite: null });
    await repo.criar({ titulo: 'B', descricao: null, dataLimite: null });

    const tarefas = await repo.listar();
    expect(tarefas.map((t) => t.titulo)).toEqual(['A', 'B']);
  });

  it('busca por id', async () => {
    const repo = criarRepositorio();
    const criada = await repo.criar({ titulo: 'A', descricao: null, dataLimite: null });

    await expect(repo.buscarPorId(criada.id)).resolves.toMatchObject({ titulo: 'A' });
    await expect(repo.buscarPorId('inexistente')).resolves.toBeNull();
  });

  it('atualiza campos informados', async () => {
    const repo = criarRepositorio();
    const criada = await repo.criar({ titulo: 'A', descricao: null, dataLimite: null });

    const atualizada = await repo.atualizar(criada.id, { titulo: 'B' });
    expect(atualizada.titulo).toBe('B');
    expect(atualizada.descricao).toBeNull();
  });

  it('conclui e reabre tarefas', async () => {
    const repo = criarRepositorio();
    const criada = await repo.criar({ titulo: 'A', descricao: null, dataLimite: null });

    await expect(repo.concluir(criada.id)).resolves.toMatchObject({ status: 'concluida' });
    await expect(repo.reabrir(criada.id)).resolves.toMatchObject({ status: 'pendente' });
  });

  it('exclui tarefas existentes e falha em inexistentes', async () => {
    const repo = criarRepositorio();
    const criada = await repo.criar({ titulo: 'A', descricao: null, dataLimite: null });

    await expect(repo.excluir(criada.id)).resolves.toBeUndefined();
    await expect(repo.buscarPorId(criada.id)).resolves.toBeNull();
    await expect(repo.excluir(criada.id)).rejects.toThrow();
  });

  it('devolve cópias, protegendo o estado interno', async () => {
    const repo = criarRepositorio();
    const criada = await repo.criar({ titulo: 'A', descricao: null, dataLimite: null });

    criada.titulo = 'MUTADO';
    const tarefas = await repo.listar();
    expect(tarefas[0].titulo).toBe('A');
  });

  it('satisfaz o contrato TarefaRepository', () => {
    const repo = criarRepositorio();
    const metodos = [
      'listar',
      'buscarPorId',
      'criar',
      'atualizar',
      'concluir',
      'reabrir',
      'excluir',
    ];
    metodos.forEach((metodo) => {
      expect(typeof (repo as unknown as Record<string, unknown>)[metodo]).toBe('function');
    });
  });
});
