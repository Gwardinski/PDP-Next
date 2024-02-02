"use client";

import { v4 as uuidv4 } from "uuid";
import {
  PageLayout,
  PageHeader,
  PageTitle,
  PageAccordionDescription,
} from "@/components/page-layout";
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
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CreateRoundModal, RoundCreate } from "./_createRound";
import { RoundDragOverlay, RoundItemNested } from "./_roundItemNested";
import { QuestionCreate } from "./_createQuestion";
import Link from "next/link";
import {
  ArrowUpDown,
  CheckCheck,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  TicketCheck,
  Wrench,
} from "lucide-react";
import { QuestionDragOverlay, QuestionItemNested } from "./_questionItemNested";
import { Button } from "@/components/ui/button";
import { set } from "react-hook-form";
import { QuestionItem } from "./_questionItem";
import { RoundItem } from "./_roundItem";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DocumentationLink,
  VideoLink,
  GithubLink,
  FunctionalText,
  NonFunctionalText,
  RefreshText,
  BugText,
  TodoText,
} from "@/components/DocText";

export type Round = {
  id: UniqueIdentifier;
  title: string;
  questions: Question[];
};
export type Question = {
  id: UniqueIdentifier;
  rid: UniqueIdentifier | null;
  title: string;
  answer: string;
  points: number;
};

export default function QuizPage() {
  // UI States - Open, Close, Reorder
  const [roundEditMode, setRoundEditMode] = useState<boolean>(false);
  const [questionEditMode, setQuestionEditMode] = useState<boolean>(false);
  const [openRounds, setOpenRounds] = useState<string[]>([]);
  const [savedOpenRounds, setSavedOpenRounds] = useState<string[]>([]);

  // Data States - Mocked API Response
  const [libraryRounds, setLibraryRounds] =
    useState<Round[]>(mockLibraryRounds);
  const [libraryQuestions, setLibraryQuestions] =
    useState<Question[]>(mockLibraryQuestions);
  const [rounds, setRounds] = useState<Round[]>(mockData);
  // Flatten Questions. Getting sorting to work with Questions as a nested field within Rounds is a total cunt to work with
  const [questions, setQuestions] = useState<Question[]>(
    mockData.flatMap((r) => r.questions),
  );

  // DnD States - Actively Dragged Items
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activeRound, setActiveRound] = useState<Round | null>(null);

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

  const onAddRoundToQuiz = (round: Round) => {
    setRounds([...rounds, round]);
    setQuestions([...questions, ...round.questions]);
    setLibraryRounds(libraryRounds.filter((r) => r.id !== round.id));
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

  const onAddQuestionToRound = (question: Question, rid: UniqueIdentifier) => {
    question.rid = rid;
    setLibraryQuestions(libraryQuestions.filter((q) => q.id !== question.id));
    setQuestions([...questions, question]);
    setRounds(
      rounds.map((r) => {
        if (r.id === rid) {
          r.questions = [...r.questions, question];
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

    setRounds((rounds) => {
      const activeRoundIndex = rounds.findIndex((r) => r.id === activeId);

      const overRoundIndex = rounds.findIndex((r) => r.id === overId);

      return arrayMove(rounds, activeRoundIndex, overRoundIndex);
    });
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
      setQuestions((questions) => {
        const activeIndex = questions.findIndex((q) => q.id === activeId);
        const overIndex = questions.findIndex((q) => q.id === overId);

        if (questions[activeIndex].rid != questions[overIndex].rid) {
          questions[activeIndex].rid = questions[overIndex].rid;
          return arrayMove(questions, activeIndex, overIndex - 1);
        }

        return arrayMove(questions, activeIndex, overIndex);
      });
    }

    // Dropping a Question over a Round
    if (over.data.current?.type === "ROUND") {
      setOpenRounds([...openRounds, overId.toString()]);
      setQuestions((qs) => {
        const activeIndex = qs.findIndex((t) => t.id === activeId);

        if (!activeIndex || activeIndex < 0) {
          return qs;
        }

        qs[activeIndex].rid = overId;

        return arrayMove(qs, activeIndex, activeIndex);
      });
    }

    // Update Rounds array which is primary state
    setRounds((rs) => {
      return rs.map((r) => {
        r.questions = questions.filter((q) => q.rid === r.id);
        return r;
      });
    });
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>{"Quiz 'Trello' Board"}</PageTitle>
        <PageAccordionDescription>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                Drag & Drop interface for creating a Quiz using DnD Kit
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <DocumentationLink
                  href="https://dndkit.com/"
                  text="DnD Kit Docs"
                />
                <VideoLink
                  href="https://www.youtube.com/watch?v=RG-3R6Pu_Ik"
                  text="Youtube Tutorial"
                />
                <GithubLink
                  text="Source Code"
                  href="https://github.com/Gwardinski/PDP/tree/main/src/app/quiz"
                />
                <FunctionalText text="Adding, Removing, and Ordering all work as expected" />
                <NonFunctionalText
                  text="Search functionality is non-functional and just for example
                  purposes"
                />
                <NonFunctionalText
                  text="Menu functionality - edit, publish delete is non-functional and just for example
                  purposes"
                />
                <BugText text="Delete button doesn't work on neither Question or Round" />
                <TodoText text="Move state into Zustand to prevent Prop Drilling" />
                <DocumentationLink
                  href="https://www.npmjs.com/package/zustand#typescript-usage"
                  text="Zustand Docs"
                />
                <RefreshText text="Refresh page to reset data" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordionDescription>
      </PageHeader>

      <div className="flex w-full flex-col gap-8 lg:flex-row">
        <div className="flex h-full w-full max-w-xl flex-col gap-4">
          <h2 className="text-xl">Rounds</h2>
          <div className="flex h-full w-full flex-col gap-4 rounded-md bg-zinc-300 p-4 dark:border dark:border-zinc-800 dark:bg-transparent">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
            >
              <div className="flex w-fit items-center gap-2 self-end">
                <Button
                  onClick={onClickOrderRounds}
                  variant="outline"
                  className="ml-auto w-32"
                >
                  {roundEditMode ? "Done" : "Edit Rounds"}
                </Button>
                <Button
                  onClick={onClickOrderQuestions}
                  variant="outline"
                  className="ml-auto w-32"
                >
                  {questionEditMode ? "Done" : "Edit Questions"}
                </Button>
                <ArrowUpDown className="size-4 text-zinc-600 dark:text-zinc-300" />
              </div>

              <SortableContext
                items={rounds.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                <Accordion
                  type="multiple"
                  value={openRounds}
                  onValueChange={onRoundOpened}
                  className="flex flex-col gap-4"
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

        <div className="flex h-full w-full max-w-xl flex-col gap-4 ">
          <h2 className="text-xl">Add Content From Your Library</h2>
          <Tabs defaultValue="library_questions">
            <TabsList className="mb-2">
              <TabsTrigger value="library_questions">Questions</TabsTrigger>
              <TabsTrigger value="library_rounds">Rounds</TabsTrigger>
            </TabsList>
            <TabsContent value="library_questions">
              <div className="flex flex-col gap-2">
                <Input placeholder="Search your Questions..." />
                <h4 className="min-w-fit self-end text-xs">
                  Showing {libraryQuestions.length} of{" "}
                  {mockLibraryQuestions.length}
                </h4>
                <Accordion type="multiple">
                  <div className="flex flex-col gap-2">
                    {libraryQuestions.map((q, i) => (
                      <QuestionItem
                        key={q.id}
                        question={q}
                        rounds={rounds}
                        onAddToRound={onAddQuestionToRound}
                      />
                    ))}
                  </div>
                </Accordion>
              </div>
            </TabsContent>
            <TabsContent value="library_rounds">
              <div className="flex flex-col gap-2">
                <Input placeholder="Search your Rounds..." />
                <h4 className="min-w-fit self-end text-xs">
                  Showing {libraryRounds.length} of {mockLibraryRounds.length}
                </h4>
                <Accordion type="multiple">
                  <div className="flex flex-col gap-2">
                    {libraryRounds.map((r) => (
                      <RoundItem
                        key={r.id}
                        round={r}
                        onAddToQuiz={onAddRoundToQuiz}
                      />
                    ))}
                  </div>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </div>
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
const q5Id = `QUESTION-${uuidv4()}`;

const q1lId = `QUESTION-${uuidv4()}`;
const q2lId = `QUESTION-${uuidv4()}`;
const q3lId = `QUESTION-${uuidv4()}`;
const q4lId = `QUESTION-${uuidv4()}`;

const r1lId = `ROUND-${uuidv4()}`;
const r2lId = `ROUND-${uuidv4()}`;
const q1lrId = `QUESTION-${uuidv4()}`;
const q2lrId = `QUESTION-${uuidv4()}`;
const q3lrId = `QUESTION-${uuidv4()}`;
const q4lrId = `QUESTION-${uuidv4()}`;

const mockData: Round[] = [
  {
    id: r1Id,
    title: "General Knowledge",
    questions: [
      {
        id: q1Id,
        rid: r1Id,
        title: "What is the capital of Scotland",
        answer: "Edinburgh",
        points: 1,
      },
      {
        id: q2Id,
        rid: r1Id,
        title: "What name is commonly given to our moon",
        answer: "Luna",
        points: 1,
      },
    ],
  },
  {
    id: r2Id,
    title: "Heavy Metal",
    questions: [
      {
        id: q3Id,
        rid: r2Id,
        title: "What is Ozzy Osbourne's real name",
        answer: "John Michael Osbourne",
        points: 1,
      },
      {
        id: q4Id,
        rid: r2Id,
        title: "Glasgows greatest metal band",
        answer: "Bleed From Within",
        points: 1,
      },
      {
        id: q5Id,
        rid: r2Id,
        title: "Who plays drums for both Bleed from Within and Sylosis",
        answer: "Ali Richardson",
        points: 1,
      },
    ],
  },
];

const mockLibraryRounds: Round[] = [
  {
    id: r1lId,
    title: "Geography",
    questions: [
      {
        id: q1lrId,
        rid: r1lId,
        title: "What is the capital of France",
        answer: "Paris",
        points: 1,
      },
      {
        id: q2lrId,
        rid: r1lId,
        title: "What is the capital of England",
        answer: "London",
        points: 1,
      },
    ],
  },
  {
    id: r2lId,
    title: "Sports",
    questions: [
      {
        id: q3lrId,
        rid: r2lId,
        title: "Which country has won every single World Series",
        answer: "USA",
        points: 1,
      },
      {
        id: q4lrId,
        rid: r2lId,
        title: "Something about Tennis",
        answer: "14 Love",
        points: 1,
      },
    ],
  },
];

const mockLibraryQuestions: Question[] = [
  {
    id: q1lId,
    rid: null,
    title: "Who is the CEO of Apple",
    answer: "Tim Cook",
    points: 1,
  },
  {
    id: q2lId,
    rid: null,
    title: "What year was the Battle of Hastings",
    answer: "1066",
    points: 1,
  },
  {
    id: q3lId,
    rid: null,
    title: "Which Pokemon is number 1 in the Pokedex",
    answer: "Bulbasaur",
    points: 1,
  },
  {
    id: q4lId,
    rid: null,
    title: "Which Pokemon is number 100 in the Pokedex",
    answer: "Voltorb",
    points: 1,
  },
];
