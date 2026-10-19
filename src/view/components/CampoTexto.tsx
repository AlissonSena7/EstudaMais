import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export interface CampoTextoProps extends TextInputProps {
  rotulo: string;
  erro?: string | null;
}

export function CampoTexto({ rotulo, erro, style, ...rest }: CampoTextoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[styles.input, erro ? styles.inputErro : null, style]}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputErro: {
    borderColor: colors.danger,
  },
  erro: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.danger,
  },
});
