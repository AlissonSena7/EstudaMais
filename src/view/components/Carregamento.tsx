import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';

export interface CarregamentoProps {
  texto?: string;
}

export function Carregamento({ texto }: CarregamentoProps) {
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
