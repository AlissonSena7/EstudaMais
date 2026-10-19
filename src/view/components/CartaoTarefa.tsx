import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Tarefa } from '../../model/entities/Tarefa';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export interface CartaoTarefaProps {
  tarefa: Tarefa;
  onAlternarStatus: (id: string) => void;
  onEditar: (tarefa: Tarefa) => void;
  onExcluir: (id: string) => void;
}

function formatarData(dataLimite: string | null): string | null {
  if (!dataLimite) return null;
  const data = new Date(dataLimite);
  if (Number.isNaN(data.getTime())) return null;
  return data.toLocaleDateString();
}

export function CartaoTarefa({
  tarefa,
  onAlternarStatus,
  onEditar,
  onExcluir,
}: CartaoTarefaProps) {
  const concluida = tarefa.status === 'concluida';
  const dataFormatada = formatarData(tarefa.dataLimite);

  return (
    <View style={styles.cartao} testID={`cartao-tarefa-${tarefa.id}`}>
      <Pressable
        testID={`alternar-status-${tarefa.id}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: concluida }}
        onPress={() => onAlternarStatus(tarefa.id)}
        style={[styles.checkbox, concluida && styles.checkboxMarcado]}
      >
        {concluida ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>

      <View style={styles.conteudo}>
        <Text style={[styles.titulo, concluida && styles.tituloConcluido]}>
          {tarefa.titulo}
        </Text>
        {tarefa.descricao ? (
          <Text style={styles.descricao}>{tarefa.descricao}</Text>
        ) : null}
        {dataFormatada ? (
          <Text style={styles.dataLimite}>Prazo: {dataFormatada}</Text>
        ) : null}
      </View>

      <View style={styles.acoes}>
        <Pressable
          testID={`editar-${tarefa.id}`}
          accessibilityRole="button"
          onPress={() => onEditar(tarefa)}
          style={styles.acao}
        >
          <Text style={styles.acaoTexto}>Editar</Text>
        </Pressable>
        <Pressable
          testID={`excluir-${tarefa.id}`}
          accessibilityRole="button"
          onPress={() => onExcluir(tarefa.id)}
          style={styles.acao}
        >
          <Text style={[styles.acaoTexto, styles.acaoPerigo]}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxMarcado: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  check: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  conteudo: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  tituloConcluido: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  descricao: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textMuted,
  },
  dataLimite: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.primaryDark,
  },
  acoes: {
    marginLeft: spacing.sm,
    alignItems: 'flex-end',
  },
  acao: {
    paddingVertical: spacing.xs,
  },
  acaoTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  acaoPerigo: {
    color: colors.danger,
  },
});
