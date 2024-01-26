"use client";

import { v4 as uuidv4 } from "uuid";
import { PageLayout, PageHeader, PageTitle } from "@/components/page-layout";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { CreateRoundModal, RoundCreate } from "./_createRound";
import { RoundNested } from "./_roundNested";
import { QuestionCreate } from "./_createQuestion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { QuestionDragOverlay } from "./_questionNested";

export type Round = {
  id: UniqueIdentifier;
  title: string;
  questions: Question[];
};
export type Question = {
  id: UniqueIdentifier;
  rid: UniqueIdentifier;
  title: string;
  answer: string;
  points: number;
};

export default function QuizPage() {
  const [rounds, setRounds] = useState<Round[]>(mockData);

  const [questions, setQuestions] = useState<Question[]>(
    mockData.flatMap((r) => r.questions),
  );

  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activeRound, setActiveRound] = useState<Round | null>(null);

  // Mutate Handlers - Move into Context / Zustand
  const onCreateRound = (values: RoundCreate) => {
    const newRound: Round = {
      id: `ROUND-${uuidv4()}`,
      title: values.title,
      questions: [],
    };
    setRounds([...rounds, newRound]);
  };

  const onDeleteRound = (rid: UniqueIdentifier) => {
    setRounds(rounds.filter((r) => r.id !== rid));
  };

  const onCreateQuestion = (values: QuestionCreate, rid: UniqueIdentifier) => {
    const newQuestion: Question = {
      id: `QUESTION-${uuidv4()}`,
      rid: rid,
      title: values.title,
      answer: values.answer,
      points: values.points,
    };
    setRounds(
      rounds.map((r) => {
        if (r.id === rid) {
          r.questions = [...r.questions, newQuestion];
        }
        return r;
      }),
    );
  };

  const onDeleteQuestion = (
    questionId: UniqueIdentifier,
    rid: UniqueIdentifier,
  ) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === rid) {
          r.questions = r.questions.filter((q) => q.id !== questionId);
        }
        return r;
      }),
    );
  };

  // Dnd Handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "ROUND") {
      setActiveRound(event.active.data.current.round);
      return;
    }

    if (event.active.data.current?.type === "QUESTION") {
      setActiveQuestion(event.active.data.current.question);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveRound(null);
    setActiveQuestion(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveARound = active.data.current?.type === "ROUND";
    if (!isActiveARound) return;

    console.log("DRAG END");

    setRounds((rounds) => {
      const activeRoundIndex = rounds.findIndex((r) => r.id === activeId);

      const overRoundIndex = rounds.findIndex((r) => r.id === overId);

      return arrayMove(rounds, activeRoundIndex, overRoundIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAQuestion = active.data.current?.type === "QUESTION";
    const isOverAQuestion = over.data.current?.type === "QUESTION";

    if (!isActiveAQuestion) return;

    // Im dropping a Question over another Question
    if (isActiveAQuestion && isOverAQuestion) {
      setQuestions((questions) => {
        const activeIndex = questions.findIndex((q) => q.id === activeId);
        const overIndex = questions.findIndex((q) => q.id === overId);

        if (questions[activeIndex].rid != questions[overIndex].rid) {
          // Fix introduced after video recording
          questions[activeIndex].rid = questions[overIndex].rid;
          return arrayMove(questions, activeIndex, overIndex - 1);
        }

        return arrayMove(questions, activeIndex, overIndex);
      });
    }

    const isOverARound = over.data.current?.type === "ROUND";

    // Im dropping a Question over a round
    if (isActiveAQuestion && isOverARound) {
      setQuestions((questions) => {
        const activeIndex = questions.findIndex((t) => t.id === activeId);

        questions[activeIndex].rid = overId;

        return arrayMove(questions, activeIndex, activeIndex);
      });
    }
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>{"Quiz 'Trello' Board"}</PageTitle>
        <p>
          {
            "Using 'dnd kit' to create a drag & drop interface for creating a Quiz"
          }
        </p>
        <Link
          href="https://dndkit.com/"
          className="questions-center flex gap-2 hover:underline"
        >
          <ExternalLink /> Documentation
        </Link>
      </PageHeader>

      <div className="flex max-w-xl flex-col gap-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={rounds.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            <Accordion type="multiple" className="flex flex-col gap-4">
              {rounds.map((r, i) => {
                return (
                  <RoundNested
                    key={`${r.id}-${i}`}
                    round={r}
                    questions={questions.filter((q) => q.rid === r.id)}
                    index={i}
                    onDeleteRound={onDeleteRound}
                    onCreateQuestion={onCreateQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                  />
                );
              })}
            </Accordion>
          </SortableContext>
          <DragOverlay>
            {activeQuestion && (
              <QuestionDragOverlay question={activeQuestion} />
            )}
            {activeRound && <div className="h-20 w-full bg-zinc-600" />}
          </DragOverlay>
        </DndContext>

        <CreateRoundModal onCreateRound={onCreateRound} />
      </div>
    </PageLayout>
  );
}

const r1Id = `ROUND-${uuidv4()}`;
const r2Id = `ROUND-${uuidv4()}`;
const q1Id = `QUESTION-${uuidv4()}`;
const q2Id = `QUESTION-${uuidv4()}`;
const q3Id = `QUESTION-${uuidv4()}`;
const q4Id = `QUESTION-${uuidv4()}`;
const mockData: Round[] = [
  {
    id: r1Id,
    title: "General Knowledge",
    questions: [
      {
        id: q1Id,
        rid: r1Id,
        title: "Q1",
        answer: "A1",
        points: 1,
      },
      {
        id: q2Id,
        rid: r1Id,
        title: "Q2",
        answer: "A2",
        points: 1,
      },
    ],
  },
  {
    id: r2Id,
    title: "Sports",
    questions: [
      {
        id: q3Id,
        rid: r2Id,
        title: "Q3",
        answer: "A3",
        points: 1,
      },
      {
        id: q4Id,
        rid: r2Id,
        title: "Q4",
        answer: "A4",
        points: 1,
      },
    ],
  },
];
