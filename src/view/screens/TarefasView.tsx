import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Tarefa } from '../../model/entities/Tarefa';
import { TarefaRepository } from '../../model/repositories/TarefaRepository';
import { useTarefasViewModel } from '../../viewmodel/tarefa/useTarefasViewModel';
import { Botao } from '../components/Botao';
import { CampoTexto } from '../components/CampoTexto';
import { Carregamento } from '../components/Carregamento';
import { CartaoTarefa } from '../components/CartaoTarefa';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export interface TarefasViewProps {
  tarefaRepository: TarefaRepository;
}

export function TarefasView({ tarefaRepository }: TarefasViewProps) {
  const { estado, criar, atualizar, alternarStatus, excluir } =
    useTarefasViewModel(tarefaRepository);

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataLimite, setDataLimite] = useState('');

  const { tarefas, carregando, erro, aviso } = estado;
  const listaVazia = !carregando && tarefas.length === 0;

  function limparFormulario() {
    setEditandoId(null);
    setTitulo('');
    setDescricao('');
    setDataLimite('');
  }

  function iniciarEdicao(tarefa: Tarefa) {
    setEditandoId(tarefa.id);
    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao ?? '');
    setDataLimite(tarefa.dataLimite ?? '');
  }

  async function salvar() {
    const payload = {
      titulo,
      descricao: descricao.trim() ? descricao : null,
      dataLimite: dataLimite.trim() ? dataLimite : null,
    };
    const sucesso = editandoId
      ? await atualizar(editandoId, payload)
      : await criar(payload);
    if (sucesso) {
      limparFormulario();
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.cabecalho}>Tarefas</Text>

        <ScrollView
          style={styles.formulario}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.formularioConteudo}
        >
          <CampoTexto
            rotulo="Título"
            placeholder="Ex.: Estudar PDM"
            value={titulo}
            onChangeText={setTitulo}
            testID="campo-titulo"
          />
          <CampoTexto
            rotulo="Descrição"
            placeholder="Detalhes opcionais"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            testID="campo-descricao"
          />
          <CampoTexto
            rotulo="Data limite"
            placeholder="AAAA-MM-DD"
            value={dataLimite}
            onChangeText={setDataLimite}
            autoCapitalize="none"
            testID="campo-data"
          />

          {erro ? (
            <Text style={styles.erro} testID="mensagem-erro">
              {erro}
            </Text>
          ) : null}

          {aviso ? (
            <Text style={styles.aviso} testID="mensagem-aviso">
              {aviso}
            </Text>
          ) : null}

          <View style={styles.acoesFormulario}>
            <Botao
              titulo={editandoId ? 'Salvar edição' : 'Adicionar tarefa'}
              onPress={salvar}
              desabilitado={carregando}
              testID="botao-salvar"
            />
            {editandoId ? (
              <View style={styles.cancelar}>
                <Botao
                  titulo="Cancelar"
                  variante="secundario"
                  onPress={limparFormulario}
                  testID="botao-cancelar"
                />
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.listaContainer}>
          <Text style={styles.tituloLista}>
            {tarefas.length > 0 ? `Minhas tarefas (${tarefas.length})` : 'Minhas tarefas'}
          </Text>
          {carregando ? <Carregamento /> : null}
          {listaVazia ? (
            <Text style={styles.vazio} testID="lista-vazia">
              Nenhuma tarefa cadastrada. Adicione a primeira acima.
            </Text>
          ) : null}
          <FlatList
            data={tarefas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartaoTarefa
                tarefa={item}
                onAlternarStatus={alternarStatus}
                onEditar={iniciarEdicao}
                onExcluir={excluir}
              />
            )}
            contentContainerStyle={styles.listaConteudo}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  cabecalho: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  formulario: {
    maxHeight: 320,
  },
  formularioConteudo: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  erro: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    fontSize: 13,
  },
  aviso: {
    color: colors.primaryDark,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    fontSize: 13,
  },
  acoesFormulario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cancelar: {
    flex: 1,
  },
  listaContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  tituloLista: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  vazio: {
    color: colors.textMuted,
    fontSize: 14,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },
  listaConteudo: {
    paddingBottom: spacing.xl,
  },
});
