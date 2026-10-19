import { TarefaRepository } from '@/model/repositories/TarefaRepository';
import { ValidacaoTarefaError } from '@/model/services/ValidarTarefa';
import { AtualizarTarefa } from '@/usecase/tarefa/AtualizarTarefa';
import { ConcluirTarefa } from '@/usecase/tarefa/ConcluirTarefa';
import { CriarTarefa } from '@/usecase/tarefa/CriarTarefa';
import { ExcluirTarefa } from '@/usecase/tarefa/ExcluirTarefa';
import { ListarTarefa } from '@/usecase/tarefa/ListarTarefa';
import { FakeTarefaRepository } from '@/infra/repositories/FakeTarefaRepository';

function criarrepo(): TarefaRepository {
  return new FakeTarefaRepository();
}

describe('Casos de uso de tarefa', () => {
  it('CriarTarefa valida e persiste', async () => {
    const repo = criarrepo();
    const criar = new CriarTarefa(repo);

    const tarefa = await criar.executar({ titulo: ' Estudo ' });
    expect(tarefa.titulo).toBe('Estudo');
    expect(tarefa.status).toBe('pendente');
    await expect(repo.listar()).resolves.toHaveLength(1);
  });

  it('CriarTarefa rejeita título inválido sem persistir', async () => {
    const repo = criarrepo();
    const criar = new CriarTarefa(repo);

    await expect(criar.executar({ titulo: '' })).rejects.toBeInstanceOf(ValidacaoTarefaError);
    await expect(repo.listar()).resolves.toEqual([]);
  });

  it('ListarTarefa ordena por criação', async () => {
    const repo = criarrepo();
    const criar = new CriarTarefa(repo);
    const listar = new ListarTarefa(repo);

    await criar.executar({ titulo: 'Primeira' });
    await criar.executar({ titulo: 'Segunda' });

    const tarefas = await listar.executar();
    expect(tarefas.map((t) => t.titulo)).toEqual(['Primeira', 'Segunda']);
  });

  it('AtualizarTarefa aplica as mudanças validadas', async () => {
    const repo = criarrepo();
    const tarefa = await new CriarTarefa(repo).executar({ titulo: 'Antiga' });
    const atualizar = new AtualizarTarefa(repo);

    const atualizada = await atualizar.executar(tarefa.id, { titulo: 'Nova' });
    expect(atualizada.titulo).toBe('Nova');
    await expect(atualizar.executar(tarefa.id, {})).rejects.toBeInstanceOf(ValidacaoTarefaError);
  });

  it('ConcluirTarefa alterna o status', async () => {
    const repo = criarrepo();
    const tarefa = await new CriarTarefa(repo).executar({ titulo: 'A' });
    const concluir = new ConcluirTarefa(repo);

    await expect(concluir.executar(tarefa.id)).resolves.toMatchObject({ status: 'concluida' });
    await expect(concluir.reabrir(tarefa.id)).resolves.toMatchObject({ status: 'pendente' });
  });

  it('ExcluirTarefa remove do repositório', async () => {
    const repo = criarrepo();
    const tarefa = await new CriarTarefa(repo).executar({ titulo: 'A' });
    const excluir = new ExcluirTarefa(repo);

    await excluir.executar(tarefa.id);
    await expect(repo.listar()).resolves.toEqual([]);
  });
});
