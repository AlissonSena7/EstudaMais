import { DependenciasProvider, useDependencias } from '../view/providers/DependenciasProvider';
import { TarefasView } from '../view/screens/TarefasView';

function TarefasScreenContent() {
  const { tarefaRepository } = useDependencias();
  return <TarefasView tarefaRepository={tarefaRepository} />;
}

export default function TarefasScreen() {
  return (
    <DependenciasProvider>
      <TarefasScreenContent />
    </DependenciasProvider>
  );
}
