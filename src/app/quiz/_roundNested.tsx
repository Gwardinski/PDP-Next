import { GripVertical, XCircle } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Round } from "./page";
import { QuestionNested } from "./_questionNested";
import { CreateQuestion, QuestionCreate } from "./_createQuestion";
import { useMemo } from "react";

export const RoundNested: React.FC<{
  round: Round;
  index: number;
  onDeleteRound: (rid: UniqueIdentifier) => void;
  onCreateQuestion: (q: QuestionCreate, rid: UniqueIdentifier) => void;
  onDeleteQuestion: (qid: UniqueIdentifier, rid: UniqueIdentifier) => void;
}> = ({ round, index, onDeleteRound, onCreateQuestion, onDeleteQuestion }) => {
  const questionIds = useMemo(
    () => round.questions.map((q) => q.id),
    [round.questions],
  );
  const totalPoints = useMemo(() => {
    return round.questions.reduce((acc, q) => acc + q.points, 0);
  }, [round.questions]);

  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: round.id,
    data: {
      type: "ROUND",
      round: round,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <AccordionItem
      value={`ROUND-${round.id}`}
      ref={setNodeRef}
      style={style}
      className={`flex max-w-xl flex-col rounded-md bg-zinc-300 dark:bg-zinc-800 ${isDragging && "opacity-40"}`}
    >
      <AccordionTrigger className="flex h-20 items-center gap-2 rounded-t-md bg-zinc-400 p-2 dark:bg-zinc-700">
        <div className="flex w-full flex-col items-start justify-start">
          <h4 className="flex gap-4 text-sm text-orange-500 dark:text-orange-600">
            Round {index + 1}
          </h4>
          <h2 className="text-lg">{round.title}</h2>
          <h4 className="flex gap-4 text-sm text-zinc-700 dark:text-zinc-300">
            {round.questions.length} Questions {totalPoints} Points
          </h4>
        </div>
        <div className="ml-auto flex items-center justify-center gap-4">
          <XCircle
            onClick={() => onDeleteRound(round.id)}
            className="text-red-500 dark:text-red-700"
          />
          <GripVertical {...attributes} {...listeners} />
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {!round.questions.length && (
          <div className="flex h-16 items-center justify-center">
            This Round does not contain any Questions
          </div>
        )}
        <SortableContext items={questionIds}>
          <Accordion type="multiple" className="flex flex-col">
            {round.questions.map((q, i) => {
              return (
                <QuestionNested
                  key={`${q.id}-${i}`}
                  question={q}
                  index={i}
                  onDeleteQuestion={onDeleteQuestion}
                />
              );
            })}
          </Accordion>
        </SortableContext>
        <div className="flex justify-end p-2">
          <CreateQuestion
            onCreateQuestion={(q) => onCreateQuestion(q, round.id)}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};