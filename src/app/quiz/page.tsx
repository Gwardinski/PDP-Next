"use client";

import { v4 as uuidv4 } from "uuid";
import { PageLayout, PageHeader, PageTitle } from "@/components/page-layout";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
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
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { CreateRoundModal, RoundCreate } from "./_createRound";
import { RoundNested } from "./_roundNested";
import { QuestionCreate } from "./_createQuestion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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

  // Dind round either by it's ID, or the ID of one of it's Questions
  const getRoundById = (
    id: UniqueIdentifier | undefined,
    idType: "rid" | "qid",
  ) => {
    if (idType === "rid") {
      return rounds.find((q) => q.id === id);
    }
    if (idType === "qid") {
      return rounds.find((r) => r.questions.find((q) => q.id === id));
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const onDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    // Question Sorting
    if (
      active.id.toString().includes("QUESTION") &&
      over.id.toString().includes("QUESTION")
    ) {
      // Find active and over Round
      const activeRound = getRoundById(active.id, "qid");
      const overRound = getRoundById(over.id, "qid");
      if (!activeRound || !overRound) return;

      // Find the index of the active and over Round
      const activeRoundIndex = rounds.findIndex((r) => r.id === activeRound.id);
      const overRoundIndex = rounds.findIndex((r) => r.id === overRound.id);

      // Find the index of the active and over Question
      const activeQuestionIndex = activeRound.questions.findIndex(
        (question) => question.id === active.id,
      );
      const overQuestionIndex = overRound.questions.findIndex(
        (question) => question.id === over.id,
      );

      // In same Round
      if (activeRoundIndex === overRoundIndex) {
        let neQuestions = [...rounds];
        neQuestions[activeRoundIndex].questions = arrayMove(
          neQuestions[activeRoundIndex].questions,
          activeQuestionIndex,
          overQuestionIndex,
        );
        setRounds(neQuestions);
      }
    }

    // Handling Question Drop Into a Round
    if (
      active.id.toString().includes("QUESTION") &&
      over?.id.toString().includes("ROUND")
    ) {
      // Find the active and over Round
      const activeRound = getRoundById(active.id, "qid");
      const overRound = getRoundById(over.id, "rid");

      // If the active or over Round is not found, return
      if (!activeRound || !overRound) return;

      // Find the index of the active and over Round
      const activeRoundIndex = rounds.findIndex((r) => r.id === activeRound.id);
      const overRoundIndex = rounds.findIndex((r) => r.id === overRound.id);

      // Find the index of the active and over Question
      const activeQuestionIndex = activeRound.questions.findIndex(
        (q) => q.id === active.id,
      );

      // Remove the active Question from the active Round and add it to the over Round
      let newQuestions = [...rounds];
      const [removedQuestion] = newQuestions[activeRoundIndex].questions.splice(
        activeQuestionIndex,
        1,
      );
      newQuestions[overRoundIndex].questions.push(removedQuestion);
      setRounds(newQuestions);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    // Handling Round Sorting
    if (
      active.id.toString().includes("ROUND") &&
      over?.id.toString().includes("ROUND")
    ) {
      // Find the index of the active and over Round
      const activeRoundIndex = rounds.findIndex(
        (round) => round.id === active.id,
      );
      const overRoundIndex = rounds.findIndex((round) => round.id === over.id);
      // Swap the active and over Round
      let newQuestions = [...rounds];
      newQuestions = arrayMove(newQuestions, activeRoundIndex, overRoundIndex);
      setRounds(newQuestions);
    }

    // Handling Question Sorting
    if (
      active.id.toString().includes("QUESTION") &&
      over?.id.toString().includes("QUESTION")
    ) {
      // Find the active and over round
      const activeRound = getRoundById(active.id, "qid");
      const overRound = getRoundById(over.id, "qid");

      // If the active or over Round is not found, return
      if (!activeRound || !overRound) return;
      // Find the index of the active and over Round
      const activeRoundIndex = rounds.findIndex(
        (round) => round.id === activeRound.id,
      );
      const overRoundIndex = rounds.findIndex(
        (round) => round.id === overRound.id,
      );
      // Find the index of the active and over Question
      const activeQuestionIndex = activeRound.questions.findIndex(
        (q) => q.id === active.id,
      );
      const overQuestionIndex = overRound.questions.findIndex(
        (q) => q.id === over.id,
      );

      // In the same Round
      if (activeRoundIndex === overRoundIndex) {
        let newQuestions = [...rounds];
        newQuestions[activeRoundIndex].questions = arrayMove(
          newQuestions[activeRoundIndex].questions,
          activeQuestionIndex,
          overQuestionIndex,
        );
        setRounds(newQuestions);
      } else {
        // In different Rounds
        let newQuestions = [...rounds];
        const [removedQuestion] = newQuestions[
          activeRoundIndex
        ].questions.splice(activeQuestionIndex, 1);
        newQuestions[overRoundIndex].questions.splice(
          overQuestionIndex,
          0,
          removedQuestion,
        );
        setRounds(newQuestions);
      }
    }
    // Handling Question dropping into Round
    if (
      active.id.toString().includes("QUESTION") &&
      over?.id.toString().includes("ROUND")
    ) {
      // Find the active and over Round
      const activeRound = getRoundById(active.id, "qid");
      const overRound = getRoundById(over.id, "rid");

      // If the active or over Round is not found, return
      if (!activeRound || !overRound) return;
      // Find the index of the active and over Round
      const activeRoundIndex = rounds.findIndex((r) => r.id === activeRound.id);
      const overRoundIndex = rounds.findIndex((q) => q.id === overRound.id);
      // Find the index of the active and over Question
      const activeQuestionIndex = activeRound.questions.findIndex(
        (q) => q.id === active.id,
      );

      let newQuestions = [...rounds];
      const [removedQuestion] = newQuestions[activeRoundIndex].questions.splice(
        activeQuestionIndex,
        1,
      );
      newQuestions[overRoundIndex].questions.push(removedQuestion);
      setRounds(newQuestions);
    }
    setActiveId(null);
  };

  // Mutate Handlers - Move into Context / Zustand
  const onCreateRound = (values: RoundCreate) => {
    const newRound: Round = {
      id: `ROUND-${uuidv4()}`,
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
      id: `QUESTION-${uuidv4()}`,
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
        <p>
          {
            "Using 'dnd kit' to create a drag & drop interface for creating a Quiz"
          }
        </p>
        <Link
          href="https://dndkit.com/"
          className="flex items-center gap-2 hover:underline"
        >
          <ExternalLink /> Documentation
        </Link>
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
          <DragOverlay adjustScale={false}>
            {activeId && activeId.toString().includes("QUESTION") && (
              <div className="h-20 w-full bg-zinc-600" />
            )}
            {/* Drag Overlay For Container */}
            {activeId && activeId.toString().includes("ROUND") && (
              <div className="h-20 w-full bg-zinc-600" />
            )}
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
