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

export const QuestionNested: React.FC<{
  question: Question;
  index: number;
  onDeleteQuestion: (qid: UniqueIdentifier, rid: UniqueIdentifier) => void;
}> = ({ question, index, onDeleteQuestion }) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
    data: {
      type: "QUESTION",
      question: question,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <AccordionItem
      value={`QUESTION-${question.id}`}
      ref={setNodeRef}
      style={style}
    >
      <AccordionTrigger
        className={`flex w-full rounded-md p-2 ${isDragging && "opacity-40"}`}
      >
        <div className="flex w-full flex-col items-start justify-start">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Question {index + 1}
          </p>
          <p>{question.title}</p>
          <AccordionContent className="h-fit text-orange-500 dark:text-orange-600">
            {question.answer}
          </AccordionContent>
          <p>{question.points} Points</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteQuestion(question.id, question.rid)}
          >
            <XCircle className="text-red-500 dark:text-red-700" />
          </Button>
          <GripVertical {...attributes} {...listeners} />
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
};
