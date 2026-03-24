export interface FormData {
  // Screen 1
  deadline?: string;
  deadlineNote?: string;
  phase1Deliverables?: string[];
  phase2Deliverables?: string[];
  // Screen 2
  budget?: string;
  brandUsers?: string[];
  signoff?: string;
  workingPrefs?: string;
  // Screen 3
  subBrands?: string;
  subBrandsNote?: string;
  mmMeaning?: string;
  brandPerception?: string;
  platforms?: string[];
  languages?: string;
  languagesNote?: string;
  existingBuild?: string;
  existingBuildNote?: string;
  // Screen 4
  critterCommitment?: string;
  characterRole?: string;
  visualAvoid?: string;
  // Screen 5
  pair1?: 'left' | 'right' | '';
  pair2?: 'left' | 'right' | '';
  pair3?: 'left' | 'right' | '';
  pair4?: 'left' | 'right' | '';
  threeWords?: string;
  anythingElse?: string;
  // Screen 6
  colorPrefs?: string;
  fontPrefs?: string;
  brandInspo?: string;
  [key: string]: string | string[] | undefined;
}
