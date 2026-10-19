import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  desabilitado?: boolean;
  testID?: string;
}

export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  desabilitado = false,
  testID,
}: BotaoProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityState={{ disabled: desabilitado }}
      style={({ pressed }) => [
        styles.base,
        styles[variante],
        desabilitado && styles.desabilitado,
        pressed && !desabilitado && styles.pressionado,
      ]}
    >
      <Text style={[styles.texto, variante === 'secundario' && styles.textoSecundario]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: colors.primary,
  },
  secundario: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  perigo: {
    backgroundColor: colors.danger,
  },
  desabilitado: {
    opacity: 0.5,
  },
  pressionado: {
    opacity: 0.85,
  },
  texto: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  textoSecundario: {
    color: colors.text,
  },
});
