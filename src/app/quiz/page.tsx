"use client";

import { PageLayout, PageHeader, PageTitle } from "@/components/page-layout";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
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
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { CreateRoundModal, RoundCreate } from "./_createRound";
import { RoundNested } from "./_roundNested";
import { QuestionCreate } from "./_createQuestion";

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
  const roundIds = useMemo(() => rounds.map((r) => r.id), [rounds]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();
  const [containerName, setContainerName] = useState<string>("");

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

  const onDragStart = (event: DragStartEvent) => {};
  const onDragMove = (event: DragMoveEvent) => {};
  const onDragEnd = (event: DragEndEvent) => {};

  // Mutate Handlers - Move into Context / Zustand
  const onCreateRound = (values: RoundCreate) => {
    const newRound: Round = {
      id: Math.random(),
      title: values.title,
      questions: [],
    };
    setRounds([...rounds, newRound]);
  };

  const onDeleteRound = (roundId: UniqueIdentifier) => {
    setRounds(rounds.filter((r) => r.id !== roundId));
  };

  const onCreateQuestion = (
    values: QuestionCreate,
    roundId: UniqueIdentifier,
  ) => {
    const newQuestion: Question = {
      id: Math.random(),
      rid: roundId,
      title: values.title,
      answer: values.answer,
      points: values.points,
    };
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId) {
          r.questions = [...r.questions, newQuestion];
        }
        return r;
      }),
    );
  };

  const onDeleteQuestion = (
    questionId: UniqueIdentifier,
    roundId: UniqueIdentifier,
  ) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId) {
          r.questions = r.questions.filter((q) => q.id !== questionId);
        }
        return r;
      }),
    );
  };

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>{"Quiz 'Trello' Board"}</PageTitle>
      </PageHeader>

      <div className="flex max-w-xl flex-col gap-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={roundIds}>
            <Accordion type="multiple" className="flex flex-col gap-4">
              {rounds.map((r, i) => {
                return (
                  <RoundNested
                    key={`${r.id}-${i}`}
                    round={r}
                    index={i}
                    onDeleteRound={onDeleteRound}
                    onCreateQuestion={onCreateQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                  />
                );
              })}
            </Accordion>
          </SortableContext>
        </DndContext>

        <CreateRoundModal onCreateRound={onCreateRound} />
      </div>
    </PageLayout>
  );
}

const mockData: Round[] = [
  {
    id: 101,
    title: "General Knowledge",
    questions: [
      {
        id: 201,
        rid: 101,
        title: "Q1",
        answer: "A1",
        points: 1,
      },
      {
        id: 202,
        rid: 101,
        title: "Q2",
        answer: "A2",
        points: 1,
      },
    ],
  },
  {
    id: 102,
    title: "Sports",
    questions: [
      {
        id: 203,
        rid: 102,
        title: "Q3",
        answer: "A3",
        points: 1,
      },
      {
        id: 204,
        rid: 102,
        title: "Q4",
        answer: "A4",
        points: 1,
      },
    ],
  },
];
