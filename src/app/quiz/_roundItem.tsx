import { GripVertical, ListPlus, Plus, PlusCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Round } from "./page";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { QuestionItem } from "./_questionItem";

export const RoundItem: React.FC<{
  round: Round;
  onAddToQuiz: (round: Round) => void;
}> = ({ round, onAddToQuiz }) => {
  const totalPoints = useMemo(() => {
    return round.questions.reduce((acc, q) => acc + q.points, 0);
  }, [round.questions]);

  return (
    <AccordionItem
      value={round.id.toString()}
      className="flex max-w-xl flex-col rounded-md bg-zinc-100 dark:bg-zinc-900"
    >
      <AccordionTrigger className="flex h-20 items-center gap-2 rounded-t-md bg-white p-2 dark:bg-zinc-700">
        <div className="flex w-full flex-col items-start justify-start">
          <h4 className="flex gap-4 text-sm text-orange-500 dark:text-orange-600">
            Round
          </h4>
          <h2 className="text-lg">{round.title}</h2>
          <h4 className="flex gap-4 text-sm text-zinc-400 dark:text-zinc-300">
            {round.questions.length} Questions {totalPoints} Points
          </h4>
        </div>
        <div className="ml-auto flex w-fit items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddToQuiz(round)}
          >
            <PlusCircle />
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {!round.questions.length && (
          <div className="flex h-16 items-center justify-center">
            This Round does not contain any Questions
          </div>
        )}
        <Accordion type="multiple" className="flex flex-col">
          {round.questions.map((question, i) => (
            <QuestionItem key={question.id} question={question} />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
};
