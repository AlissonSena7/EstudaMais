import {
  ValidacaoTarefaError,
  validarAtualizarTarefa,
  validarCriarTarefa,
  validarDataLimite,
  validarDescricao,
  validarTitulo,
} from '@/model/services/ValidarTarefa';

describe('ValidarTarefa', () => {
  describe('validarTitulo', () => {
    it('remove espaços nas extremidades', () => {
      expect(validarTitulo('  Estudar PDM  ')).toBe('Estudar PDM');
    });

    it('rejeita título vazio', () => {
      expect(() => validarTitulo('   ')).toThrow(ValidacaoTarefaError);
    });

    it('rejeita título não textual', () => {
      expect(() => validarTitulo(42 as unknown as string)).toThrow(ValidacaoTarefaError);
    });

    it('rejeita título acima do limite', () => {
      expect(() => validarTitulo('a'.repeat(121))).toThrow(ValidacaoTarefaError);
    });
  });

  describe('validarDescricao', () => {
    it('converte vazio em nulo', () => {
      expect(validarDescricao('   ')).toBeNull();
      expect(validarDescricao(undefined)).toBeNull();
      expect(validarDescricao(null)).toBeNull();
    });

    it('preserva descrição válida', () => {
      expect(validarDescricao('  Revisar capítulo 3 ')).toBe('Revisar capítulo 3');
    });
  });

  describe('validarDataLimite', () => {
    it('normaliza para ISO', () => {
      expect(validarDataLimite('2026-05-01')).toBe('2026-05-01T00:00:00.000Z');
    });

    it('aceita valores vazios como nulo', () => {
      expect(validarDataLimite('')).toBeNull();
      expect(validarDataLimite(null)).toBeNull();
    });

    it('rejeita data inválida', () => {
      expect(() => validarDataLimite('data-invalida')).toThrow(ValidacaoTarefaError);
    });
  });

  describe('validarCriarTarefa', () => {
    it('normaliza os campos', () => {
      expect(
        validarCriarTarefa({ titulo: ' Prova ', descricao: ' ', dataLimite: '2026-05-01' })
      ).toEqual({
        titulo: 'Prova',
        descricao: null,
        dataLimite: '2026-05-01T00:00:00.000Z',
      });
    });

    it('exige título', () => {
      expect(() => validarCriarTarefa({ titulo: '' })).toThrow(ValidacaoTarefaError);
    });
  });

  describe('validarAtualizarTarefa', () => {
    it('exige ao menos um campo', () => {
      expect(() => validarAtualizarTarefa({})).toThrow(ValidacaoTarefaError);
    });

    it('valida somente campos informados', () => {
      expect(validarAtualizarTarefa({ titulo: 'Novo' })).toEqual({ titulo: 'Novo' });
    });

    it('permite limpar descrição', () => {
      expect(validarAtualizarTarefa({ descricao: '' })).toEqual({ descricao: null });
    });
  });
});
