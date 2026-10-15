export type StageId = "read" | "plan" | "write" | "check" | "pack";

export type FileKind = "config" | "content" | "page" | "component" | "api" | "asset" | "doc";

export type GenFile = {
  path: string;
  kind: FileKind;
  text?: string;
  bytes?: Uint8Array;
};

export type PlannedFile = { path: string; kind: FileKind };

export type CheckResult = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail?: string;
};

export type ExportAnswers = {
  projectName: string;
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  authPages: "include" | "skip";
  deploy: "vercel" | "netlify" | "node";
};

export type PlanSummary = {
  pages: { name: string; path: string; sections: number }[];
  componentNames: string[];
  imagesIncluded: number;
  imagesPending: number;
  imagesFailed: number;
};

export type GenEvent =
  | { type: "stage"; id: StageId; status: "active" | "done"; detail?: string }
  | { type: "log"; stage: StageId; text: string; level?: "info" | "warn" }
  | { type: "plan"; files: PlannedFile[]; summary: PlanSummary }
  | { type: "file"; file: GenFile; index: number; total: number }
  | { type: "checks"; checks: CheckResult[] }
  | { type: "done"; files: GenFile[]; zip: Uint8Array; zipName: string };

export type BinaryResult = { bytes: Uint8Array; type: string };
