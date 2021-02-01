export type Session = {
  id: string;
  location: string;
  timestamps: {
    started: Date;
    completed?: Date;
  };
};

export type Performance = "flash" | "onsight" | "redpoint";
export type Environment = "outdoors" | "gym";
export type TickType = "sport" | "trad" | "boulder";
export type Grade = number;
export type GradeModifier = "soft" | "hard";
export type RPE = number;

export type Tick = {
  id: string;
  user_email: string;
  session_id: string;
  type: TickType;

  environment: Environment;
  grade: Grade;
  grade_modifier: GradeModifier | undefined;
  performance: Performance;
  attempts: number;

  bodyweight: number;
  RPE: RPE;

  style: string[];
  features: string[];
  holds: string[];

  created_at: Date;
};
