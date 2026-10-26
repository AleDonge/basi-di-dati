export type GradingFeedback =
  | { status: "passed" | "failed"; message: string; checkedFixtures: number }
  | { status: "guided" | "unsupported"; message: string };
