export interface ChildSupportProfile {
  completedAt?: string;
  isCompleted: boolean;

  // Step 1: About Child
  preferredName?: string;
  age?: number;
  ageGroup?: 'Early Learner' | 'School Learner' | 'Teen' | 'Young Adult';
  educationLevel?: string;
  preferredLearningFormats?: string[];

  // Step 2: Language Background
  homeLanguage?: string;
  schoolLanguage?: string;
  isMultilingual?: string; // 'Yes' | 'No' | 'Not sure'
  languagesUsed?: string[];
  primaryAppLanguage?: string;
  languageComprehensionDifference?: string; // 'Yes' | 'No' | 'Not sure'

  // Step 3: Communication
  expressNeeds?: string; // 'Usually easy' | 'Sometimes difficult' | 'Often difficult' | 'Not sure'
  wordFindingDifficulty?: string;
  sentenceFormationDifficulty?: string;
  repeatsWords?: string;
  explainingEventDifficulty?: string;
  avoidsSpeaking?: string;
  mostDifficultCommunicationSituation?: string;
  communicationNotes?: string;

  // Step 4: Listening & Understanding
  understandSimpleInstructions?: string;
  followMultiStepInstructions?: string;
  needsInstructionsRepeated?: string;
  understandQuestions?: string;
  understandLongConversations?: string;
  understandInference?: string;
  backgroundNoiseImpact?: string;
  listeningNotes?: string;

  // Step 5: Vocabulary
  learnNewWordsDifficulty?: string;
  forgetNewWords?: string;
  explainWordMeaningDifficulty?: string;
  smallerVocabularyRange?: string;
  receptiveExpressiveGap?: string;
  targetVocabularyAreas?: string[];
  vocabularyNotes?: string;

  // Step 6: Reading & Learning
  enjoysReading?: string;
  wordRecognitionDifficulty?: string;
  readingComprehensionDifficulty?: string;
  passageMemoryDifficulty?: string;
  eventOrderingDifficulty?: string;
  storyQuestionDifficulty?: string;
  academicLanguageDifficulty?: string;
  readingNotes?: string;

  // Step 7: Expressive Language
  explainIdeasClearly?: string;
  describeObjectSituation?: string;
  tellStructuredStory?: string;
  explainCauseAndEffect?: string;
  answerOpenEndedQuestions?: string;
  organizeThoughtsDifficulty?: string;
  targetExpressionTypes?: string[];
  expressiveNotes?: string;

  // Step 8: Social & Everyday Communication
  participateInConversations?: string;
  startConversation?: string;
  maintainConversation?: string;
  understandSocialSituations?: string;
  interpretEmotionsCues?: string;
  groupCommunicationDifficulty?: string;
  keyPracticeSettings?: string[];
  socialNotes?: string;

  // Step 9: Daily Routine & Learning Habits
  focusDuration?: string;
  sessionPreference?: string;
  bestLearningTime?: string;
  respondsToRepetition?: string;
  respondsToVisualSchedules?: string;
  prefersAudioSupport?: string;
  homeLearningChallenges?: string;

  // Step 10: Home Practice & Physical Well-being
  dailyPracticeTime?: string;
  weeklyPracticeDays?: number;
  enjoyedActivities?: string[];
  offlineActivities?: string[];
  outdoorMovementTime?: string;
  sleepRoutineNotes?: string;
  screenTimeBalanceNotes?: string;

  // Step 11: Parent Concerns & Goals
  biggestConcerns?: string[];
  topPriorities?: string[]; // Up to 3
  childStrengths?: string;
  additionalParentNotes?: string;

  // Step 12: Professional Support Context
  professionalSupportTypes?: string[];
  professionalSupportNotes?: string;
}

const STORAGE_KEY = 'lingua_child_support_profile';

/**
 * Derives age group automatically from age number
 */
export function deriveAgeGroup(
  age: number
): 'Early Learner' | 'School Learner' | 'Teen' | 'Young Adult' {
  if (age <= 6) return 'Early Learner';
  if (age <= 11) return 'School Learner';
  if (age <= 17) return 'Teen';
  return 'Young Adult';
}

/**
 * Retrieves stored child support profile or null if not yet filled
 */
export function getChildSupportProfile(): ChildSupportProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (e) {
    console.error('Failed to parse child support profile from storage:', e);
  }
  return null;
}

/**
 * Saves child support profile to localStorage
 */
export function saveChildSupportProfile(profile: ChildSupportProfile): void {
  try {
    const updated = {
      ...profile,
      completedAt: profile.completedAt || new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save child support profile to storage:', e);
  }
}

/**
 * Clears the stored child support profile
 */
export function clearChildSupportProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear child support profile:', e);
  }
}
