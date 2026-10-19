export interface IdGenerator {
  gerar(): string;
}

export class IdGeneratorAleatorio implements IdGenerator {
  gerar(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export class IdGeneratorSequencial implements IdGenerator {
  private contador = 0;

  gerar(): string {
    this.contador += 1;
    return `tarefa-${this.contador}`;
  }
}
