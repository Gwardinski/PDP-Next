import { GripVertical, XCircle } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Question, Round } from "./page";
import { QuestionItemNested } from "./_questionItemNested";
import { CreateQuestion, QuestionCreate } from "./_createQuestion";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export const RoundItemNested: React.FC<{
  round: Round;
  questions: Question[];
  index: number;
  ordering: boolean;
  onDeleteRound: (rid: UniqueIdentifier) => void;
  onCreateQuestion: (q: QuestionCreate, rid: UniqueIdentifier) => void;
  onDeleteQuestion: (qid: UniqueIdentifier, rid: UniqueIdentifier) => void;
}> = ({
  round,
  questions,
  index,
  ordering,
  onDeleteRound,
  onCreateQuestion,
  onDeleteQuestion,
}) => {
  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);
  const totalPoints = useMemo(() => {
    return questions.reduce((acc, q) => acc + q.points, 0);
  }, [questions]);

  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: round.id,
    disabled: !ordering,
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
      value={round.id.toString()}
      ref={setNodeRef}
      style={style}
      className={`flex max-w-xl flex-col rounded-md bg-zinc-100 dark:bg-zinc-900 ${
        isDragging && "opacity-40"
      }`}
    >
      <AccordionTrigger
        disabled={ordering}
        className="flex h-20 items-center gap-2 rounded-t-md bg-white p-2 dark:bg-zinc-700"
      >
        <div className="flex w-full flex-col items-start justify-start">
          <h4 className="flex gap-4 text-sm text-orange-500 dark:text-orange-600">
            Round {index + 1}
          </h4>
          <h2 className="text-lg">{round.title}</h2>
          <h4 className="flex gap-4 text-sm text-zinc-400 dark:text-zinc-300">
            {questions.length} Questions {totalPoints} Points
          </h4>
        </div>
        <div className="ml-auto flex w-fit items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteRound(round.id)}
          >
            <XCircle className="text-red-500 dark:text-red-700" />
          </Button>
          {ordering && <GripVertical {...attributes} {...listeners} />}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {!questions.length && (
          <div className="flex h-16 items-center justify-center">
            This Round does not contain any Questions
          </div>
        )}
        <SortableContext
          items={questionIds}
          strategy={verticalListSortingStrategy}
        >
          <Accordion type="multiple" className="flex flex-col">
            {questions.map((question, i) => (
              <QuestionItemNested
                key={question.id}
                question={question}
                onDeleteQuestion={onDeleteQuestion}
                index={i}
              />
            ))}
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

export const RoundDragOverlay: React.FC<{ round: Round }> = ({ round }) => {
  return (
    <div
      className={`flex h-20 w-full items-center rounded-md bg-white p-2 dark:bg-zinc-500`}
    >
      <div className="flex h-full w-full flex-col items-start justify-start">
        <h4 className="flex gap-4 text-sm text-orange-500 dark:text-orange-600">
          Round
        </h4>
        <h2 className="text-lg">{round.title}</h2>
      </div>
      <GripVertical />
    </div>
  );
};
