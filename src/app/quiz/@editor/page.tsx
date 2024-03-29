"use client";

import { v4 as uuidv4 } from "uuid";
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
import { Accordion } from "@/components/ui/accordion";
import { CreateRoundModal, RoundCreate } from "../_createRound";
import { RoundDragOverlay, RoundItemNested } from "../_roundItemNested";
import { QuestionCreate } from "../_createQuestion";
import { ArrowUpDown } from "lucide-react";
import { QuestionDragOverlay } from "../_questionItemNested";
import { Button } from "@/components/ui/button";
import { Question, Round, useQuizStore } from "../_state";

export default function QuizEditorPage() {
  // UI States - Open, Close, Reorder
  const roundEditMode = useQuizStore((state) => state.roundEditMode);
  const setRoundEditMode = useQuizStore((state) => state.setRoundEditMode);
  const questionEditMode = useQuizStore((state) => state.questionEditMode);
  const setQuestionEditMode = useQuizStore(
    (state) => state.setQuestionEditMode,
  );

  const openRounds = useQuizStore((state) => state.openRounds);
  const setOpenRounds = useQuizStore((state) => state.setOpenRounds);
  const savedOpenRounds = useQuizStore((state) => state.savedOpenRounds);
  const setSavedOpenRounds = useQuizStore((state) => state.setSavedOpenRounds);

  // Data States - Mocked API Response
  const rounds = useQuizStore((state) => state.rounds);
  const setRounds = useQuizStore((state) => state.setRounds);
  const questions = useQuizStore((state) => state.questions);
  const setQuestions = useQuizStore((state) => state.setQuestions);

  // DnD States - Actively Dragged Items
  const activeQuestion = useQuizStore((state) => state.activeQuestion);
  const setActiveQuestion = useQuizStore((state) => state.setActiveQuestion);
  const activeRound = useQuizStore((state) => state.activeRound);
  const setActiveRound = useQuizStore((state) => state.setActiveRound);

  // UI Handlers
  const onRoundOpened = (rids: string[]) => {
    if (roundEditMode) {
      return;
    }
    setOpenRounds(rids);
    setSavedOpenRounds(rids);
  };

  const onClickOrderRounds = () => {
    const startEditing = roundEditMode === false;
    if (startEditing) {
      setOpenRounds([]);
    } else {
      setOpenRounds(savedOpenRounds);
    }
    setRoundEditMode(!roundEditMode);
    setQuestionEditMode(false);
  };

  const onClickOrderQuestions = () => {
    const startEditing = questionEditMode === false;
    if (startEditing) {
      setOpenRounds(rounds.map((r) => r.id.toString()));
    } else {
      setOpenRounds(savedOpenRounds);
    }
    setRoundEditMode(false);
    setQuestionEditMode(!questionEditMode);
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
    setQuestions([...questions, newQuestion]);
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
    setQuestions(questions.filter((q) => q.id !== questionId));
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
    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) {
      return;
    }

    if (active.data.current?.type !== "ROUND") {
      return;
    }

    const activeRoundIndex = rounds.findIndex((r) => r.id === activeId);

    const overRoundIndex = rounds.findIndex((r) => r.id === overId);

    const updatedRounds = arrayMove(rounds, activeRoundIndex, overRoundIndex);

    setRounds(updatedRounds);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) {
      return;
    }

    const isActiveAQuestion = active.data.current?.type === "QUESTION";
    if (!isActiveAQuestion) {
      return;
    }

    // Dropping Question over another Question
    if (over.data.current?.type === "QUESTION") {
      const activeIndex = questions.findIndex((q) => q.id === activeId);
      const overIndex = questions.findIndex((q) => q.id === overId);

      let updatedQuestions;
      if (questions[activeIndex].rid != questions[overIndex].rid) {
        questions[activeIndex].rid = questions[overIndex].rid;
        updatedQuestions = arrayMove(questions, activeIndex, overIndex - 1);
      }

      updatedQuestions = arrayMove(questions, activeIndex, overIndex);
      setQuestions(updatedQuestions);
    }

    // Dropping a Question over a Round
    if (over.data.current?.type === "ROUND") {
      setOpenRounds([...openRounds, overId.toString()]);
      const activeIndex = questions.findIndex((t) => t.id === activeId);

      if (!activeIndex || activeIndex < 0) {
        return;
      }

      questions[activeIndex].rid = overId;

      const updatedQuestions = arrayMove(questions, activeIndex, activeIndex);
      setQuestions(updatedQuestions);
    }

    // Update Rounds array which is primary state
    const updatedRounds = rounds.map((r) => {
      r.questions = questions.filter((q) => q.rid === r.id);
      return r;
    });
    setRounds(updatedRounds);
  }

  return (
    <div className="flex h-full w-full max-w-xl flex-col gap-4">
      <h2 className="text-xl">Rounds</h2>
      <div className="flex h-full w-full flex-col gap-4 rounded-md bg-zinc-300 p-4 px-2 dark:border dark:border-zinc-800 dark:bg-transparent lg:px-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="flex w-full items-center gap-2 self-end lg:w-fit">
            <p className="hidden text-sm text-zinc-700 dark:text-zinc-300 lg:flex">
              Remove & Re-Order:
            </p>
            <ArrowUpDown className="flex size-4 min-w-fit px-2 text-zinc-700 dark:text-zinc-300 lg:hidden" />
            <Button
              onClick={onClickOrderRounds}
              variant="outline"
              className="ml-auto w-full lg:w-24"
            >
              {roundEditMode ? "Done" : "Rounds"}
            </Button>
            <Button
              onClick={onClickOrderQuestions}
              variant="outline"
              className="ml-auto w-full lg:w-24"
            >
              {questionEditMode ? "Done" : "Questions"}
            </Button>
          </div>

          <SortableContext
            items={rounds.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            <Accordion
              type="multiple"
              value={openRounds}
              onValueChange={onRoundOpened}
              className="flex flex-col gap-2"
            >
              {rounds.map((r, i) => {
                return (
                  <RoundItemNested
                    key={`${r.id}-${i}`}
                    round={r}
                    questions={questions.filter((q) => q.rid === r.id)}
                    index={i}
                    onDeleteRound={onDeleteRound}
                    onCreateQuestion={onCreateQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                    roundEditMode={roundEditMode}
                    questionEditMode={questionEditMode}
                  />
                );
              })}
            </Accordion>
          </SortableContext>
          <DragOverlay>
            {activeQuestion && (
              <QuestionDragOverlay question={activeQuestion} />
            )}
            {activeRound && <RoundDragOverlay round={activeRound} />}
          </DragOverlay>

          <CreateRoundModal onCreateRound={onCreateRound} />
        </DndContext>
      </div>
    </div>
  );
}
