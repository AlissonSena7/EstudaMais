import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';

import { AtualizarTarefaInput, CriarTarefaInput } from '../../model/entities/Tarefa';
import { TarefaRepository } from '../../model/repositories/TarefaRepository';
import { TarefasEstado, TarefasViewModel } from './TarefasViewModel';

export interface UseTarefasViewModel {
  estado: TarefasEstado;
  carregar: () => Promise<void>;
  criar: (input: CriarTarefaInput) => Promise<boolean>;
  atualizar: (id: string, input: AtualizarTarefaInput) => Promise<boolean>;
  alternarStatus: (id: string) => Promise<void>;
  excluir: (id: string) => Promise<void>;
}

const ESTADO_INICIAL_SSR: TarefasEstado = {
  tarefas: [],
  carregando: false,
  erro: null,
  aviso: null,
};

export function useTarefasViewModel(repository: TarefaRepository): UseTarefasViewModel {
  const viewModel = useMemo(() => new TarefasViewModel(repository), [repository]);

  const estado = useSyncExternalStore(
    useCallback((ouvinte) => viewModel.inscrever(ouvinte), [viewModel]),
    () => viewModel.obterEstado(),
    () => ESTADO_INICIAL_SSR
  );

  useEffect(() => {
    void viewModel.carregar();
  }, [viewModel]);

  return {
    estado,
    carregar: viewModel.carregar.bind(viewModel),
    criar: viewModel.criar.bind(viewModel),
    atualizar: viewModel.atualizar.bind(viewModel),
    alternarStatus: viewModel.alternarStatus.bind(viewModel),
    excluir: viewModel.excluir.bind(viewModel),
  };
}
