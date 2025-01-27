import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import strings from "../constants/strings"

interface FilterBarProps {
  filter: {
    category: string
    priority: string
    status: string
  }
  setFilter: (filter: any) => void
}

export default function FilterBar({ filter, setFilter }: FilterBarProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Select value={filter.category} onValueChange={(value) => setFilter({ ...filter, category: value })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={strings.tarefa.categoria} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{strings.categorias.todas}</SelectItem>
          <SelectItem value="personal">{strings.categorias.pessoal}</SelectItem>
          <SelectItem value="work">{strings.categorias.trabalho}</SelectItem>
          <SelectItem value="shopping">{strings.categorias.compras}</SelectItem>
          <SelectItem value="other">{strings.categorias.outro}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filter.priority} onValueChange={(value) => setFilter({ ...filter, priority: value })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={strings.tarefa.prioridade} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{strings.prioridades.todas}</SelectItem>
          <SelectItem value="low">{strings.prioridades.baixa}</SelectItem>
          <SelectItem value="medium">{strings.prioridades.media}</SelectItem>
          <SelectItem value="high">{strings.prioridades.alta}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filter.status} onValueChange={(value) => setFilter({ ...filter, status: value })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={strings.tarefa.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{strings.status.todos}</SelectItem>
          <SelectItem value="active">{strings.status.ativas}</SelectItem>
          <SelectItem value="completed">{strings.status.concluidas}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

