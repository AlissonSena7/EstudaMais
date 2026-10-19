import { TarefaRepository } from '../model/repositories/TarefaRepository';
import { FakeTarefaRepository } from './repositories/FakeTarefaRepository';

export interface Dependencias {
  tarefaRepository: TarefaRepository;
}

let dependencias: Dependencias | null = null;

export function obterDependencias(): Dependencias {
  if (!dependencias) {
    dependencias = {
      tarefaRepository: new FakeTarefaRepository(),
    };
  }
  return dependencias;
}

export function definirDependencias(novas: Dependencias): void {
  dependencias = novas;
}

export function reiniciarDependencias(): void {
  dependencias = null;
}
