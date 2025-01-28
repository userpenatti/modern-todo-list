import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import React from "react"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Guia da Aplicação</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="overview">
              <AccordionTrigger>Visão Geral</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground space-y-2">
                  Este é um aplicativo de gerenciamento de tarefas que permite:
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>Criar e gerenciar tarefas</li>
                    <li>Organizar por prioridades e categorias</li>
                    <li>Visualizar em modo lista ou kanban</li>
                    <li>Criar subtarefas</li>
                    <li>Receber notificações</li>
                    <li>Personalizar seu perfil</li>
                  </ul>
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tasks">
              <AccordionTrigger>Gerenciando Tarefas</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Criar Tarefa</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique no botão "+" no topo da tela para adicionar uma nova tarefa.
                      Você pode definir:
                      <ul className="list-disc pl-4 mt-1">
                        <li>Título e descrição</li>
                        <li>Categoria (Pessoal, Trabalho, Compras, Outros)</li>
                        <li>Prioridade (Baixa, Média, Alta)</li>
                        <li>Data e hora de vencimento</li>
                        <li>Tempo de notificação antecipada</li>
                      </ul>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Subtarefas</h4>
                    <p className="text-sm text-muted-foreground">
                      Dentro de cada tarefa, você pode:
                      <ul className="list-disc pl-4 mt-1">
                        <li>Adicionar subtarefas ilimitadas</li>
                        <li>Marcar subtarefas como concluídas independentemente</li>
                        <li>Excluir subtarefas individualmente</li>
                      </ul>
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="views">
              <AccordionTrigger>Modos de Visualização</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Visualização em Lista</h4>
                    <p className="text-sm text-muted-foreground">
                      - Visualização padrão com todas as tarefas em lista<br />
                      - Expanda cada tarefa para ver detalhes e subtarefas<br />
                      - Ordene e filtre por diferentes critérios
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Visualização Kanban</h4>
                    <p className="text-sm text-muted-foreground">
                      - Arraste e solte tarefas entre colunas (A fazer, Em Progresso, Concluído)<br />
                      - Visualização ideal para acompanhamento de progresso<br />
                      - Atalho: Segure e arraste para mover tarefas
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notifications">
              <AccordionTrigger>Notificações</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  O sistema de notificações permite:
                  <ul className="list-disc pl-4 mt-2">
                    <li>Receber alertas antes do prazo da tarefa</li>
                    <li>Escolher tempo de antecedência (1min, 15min, 30min, 1h, 1dia)</li>
                    <li>Notificações sonoras e visuais</li>
                    <li>Notificações mesmo com a aba fechada</li>
                  </ul>
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="filters">
              <AccordionTrigger>Filtros e Organização</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Utilize a barra lateral para filtrar por:
                  <ul className="list-disc pl-4 mt-2">
                    <li>Categoria (Pessoal, Trabalho, Compras, Outros)</li>
                    <li>Prioridade (Baixa, Média, Alta)</li>
                    <li>Status (A fazer, Em Progresso, Concluído)</li>
                  </ul>
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="profile">
              <AccordionTrigger>Perfil e Configurações</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  No seu perfil você pode:
                  <ul className="list-disc pl-4 mt-2">
                    <li>Adicionar/alterar foto de perfil</li>
                    <li>Atualizar nome de usuário</li>
                    <li>Definir nome completo</li>
                    <li>Adicionar website</li>
                    <li>Fazer logout da aplicação</li>
                  </ul>
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shortcuts">
              <AccordionTrigger>Atalhos e Dicas</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Atalhos úteis:
                  <ul className="list-disc pl-4 mt-2">
                    <li>Clique duplo em uma tarefa para editar</li>
                    <li>Arraste tarefas no modo Kanban para mudar status</li>
                    <li>Pressione Enter ao adicionar subtarefas para criar rapidamente</li>
                    <li>Use os filtros da sidebar para encontrar tarefas específicas</li>
                  </ul>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 