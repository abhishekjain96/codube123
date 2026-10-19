export type StageId = "read" | "plan" | "write" | "check" | "pack";

export type FileKind = "page" | "component" | "config" | "asset" | "style";

export type ExportAnswers = {
  projectName: string;
  siteUrl: string;
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  authPages: "include" | "skip";
  deploy: "vercel" | "netlify" | "node";
  brandName?: string;
};

export type PlanSummary = {
  brand: string;
  totalPages: number;
  totalSections: number;
  totalImages: number;
  imagesReady: number;
  imagesTotal: number;
  imagesIncluded?: number;
  hasCart: boolean;
  hasContact: boolean;
  hasNewsletter: boolean;
  hasAuthPages: boolean;
  pages: Array<{ name: string; slug: string; sections: number; path?: string }>;
  types: string[];
};

export type PlannedFile = {
  path: string;
  kind?: FileKind;
  desc?: string;
};

export type GenFile = {
  path: string;
  text?: string;
  content?: string | Uint8Array;
  bytes?: Uint8Array;
  isBinary?: boolean;
};

export type CheckItem = {
  id: string;
  status: "pass" | "warn" | "fail";
  label: string;
  detail?: string;
};

export type CheckResult = {
  ok: boolean;
  passed: number;
  failed: number;
  items: CheckItem[];
};

export type GenEvent =
  | { type: "stage"; id: StageId; status: "pending" | "active" | "done" }
  | { type: "log"; stage: StageId; text: string; level?: "info" | "warn" }
  | { type: "plan"; files: PlannedFile[]; summary: PlanSummary }
  | { type: "file"; file: GenFile; index: number; total: number }
  | { type: "checks"; checks: CheckResult }
  | { type: "done"; zip: Uint8Array; zipName: string; files: PlannedFile[] };

export type BinaryResult = {
  bytes: Uint8Array;
  mime: string;
};
