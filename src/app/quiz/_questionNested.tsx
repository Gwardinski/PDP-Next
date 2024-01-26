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
import { useState } from "react";

export const QuestionNested: React.FC<{
  question: Question;
  index: number;
  onDeleteQuestion: (qid: UniqueIdentifier, rid: UniqueIdentifier) => void;
}> = ({ question, index, onDeleteQuestion }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
    <div
      ref={setNodeRef}
      style={style}
      className={`flex min-h-[80px] w-full rounded-md px-2 py-2 ${
        isDragging && "opacity-40"
      }`}
      {...attributes}
    >
      <button
        onClick={() => setShowAnswer((v) => !v)}
        className="flex h-full w-full flex-col items-start"
      >
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Question {index + 1}
        </p>
        <p className={`${showAnswer && "text-orange-500"}`}>
          {showAnswer ? question.answer : question.title}
        </p>
        <p>{question.points} Points</p>
      </button>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteQuestion(question.id, question.rid)}
        >
          <XCircle className="text-red-500 dark:text-red-700" />
        </Button>
        <GripVertical {...listeners} />
      </div>
    </div>
  );
};

export const QuestionDragOverlay: React.FC<{ question: Question }> = ({
  question,
}) => {
  return (
    <div className={`flex h-20 w-full rounded-md bg-zinc-500 p-2`}>
      <div className="flex w-full flex-col items-start justify-start">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">Question</p>
        <p>{question.title}</p>
        <p>{question.points} Points</p>
      </div>
    </div>
  );
};
