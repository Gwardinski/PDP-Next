import { GripVertical, XCircle } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Question } from "./page";

export const QuestionItemNested: React.FC<{
  question: Question;
  index: number;
  questionEditMode: boolean;
  onDeleteQuestion?: (qid: UniqueIdentifier, rid: UniqueIdentifier) => void;
}> = ({ question, index, questionEditMode, onDeleteQuestion }) => {
  const canEditQuestion = questionEditMode;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    disabled: !canEditQuestion,
    id: question.id ?? 0,
    data: {
      type: "QUESTION",
      question: question,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <AccordionItem
      value={question.id.toString()}
      ref={setNodeRef}
      style={style}
      className={`flex flex-col bg-zinc-100 dark:bg-zinc-900 ${
        isDragging && "opacity-40"
      }`}
    >
      <AccordionTrigger
        disabled={canEditQuestion}
        hideIcon
        className="flex min-h-[80px] items-center gap-2 p-2 "
      >
        <div className="flex w-full flex-col items-start justify-start">
          <h4 className="flex gap-4 text-sm text-orange-500 dark:text-orange-600">
            Question {index + 1}
          </h4>
          <h4>{question.title}</h4>
          <AccordionContent>
            <h4 className="italic">{question.answer}</h4>
          </AccordionContent>
          <h4 className="flex gap-4 text-sm text-zinc-400 dark:text-zinc-300">
            {question.points} Points
          </h4>
        </div>
        {canEditQuestion && (
          <div className="ml-auto flex w-fit items-center justify-center gap-2">
            {onDeleteQuestion && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteQuestion(question.id, question.rid!)}
              >
                <XCircle className="text-red-500 dark:text-red-700" />
              </Button>
            )}
            <GripVertical {...attributes} {...listeners} />
          </div>
        )}
      </AccordionTrigger>
    </AccordionItem>
  );
};

export const QuestionDragOverlay: React.FC<{ question: Question }> = ({
  question,
}) => {
  return (
    <div
      className={`flex h-20 w-full rounded-md bg-white p-2 dark:bg-zinc-500`}
    >
      <div className="flex w-full flex-col items-start justify-start">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">Question</p>
        <p>{question.title}</p>
        <p>{question.points} Points</p>
      </div>
    </div>
  );
};
