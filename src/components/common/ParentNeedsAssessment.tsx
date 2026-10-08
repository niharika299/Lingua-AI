import React, { useState, useEffect } from 'react';
import { NavPage } from '../../types';
import { ClinicalGrowthInsights } from './ClinicalGrowthInsights';
import { DailyNeuroPlayChallenges } from './DailyNeuroPlayChallenges';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Brain,
  Check,
  ShieldCheck,
  BookOpen,
  Volume2,
  Eye,
  Puzzle,
  Layers,
  CheckCircle2,
  Globe,
  Languages,
  Heart,
  AlertCircle,
  MessageSquare,
  Star,
  Mic,
  Ear,
  VolumeX,
  BookMarked,
  Target,
  Lightbulb,
  Clock,
  Activity,
  ChevronDown,
  ChevronUp,
  Edit3,
  FileText,
  X,
} from 'lucide-react';

export interface Step1ChildProfileData {
  preferredName: string;
  age: number | '';
  educationLevel: string;
  learningStyle: string;
}

export interface Step2LanguageBackgroundData {
  homeLanguage: string;
  homeLanguageOther?: string;
  schoolLanguage: string;
  schoolLanguageOther?: string;
  isMultilingual: string;
  comfortableLanguage: string;
  comfortableLanguageOther?: string;
  preferredActivityLanguage: string;
}

export interface Step3CommunicationData {
  expressingNeeds: string;
  findingWords: string;
  formingSentences: string;
  storytelling: string;
  explainingIdeas: string;
  speakingAvoidance: string;
  communicationStrengths: string[];
  communicationStrengthsOther?: string;
  parentCommunicationNotes?: string;
}

export interface Step4ListeningData {
  simpleInstructions: string;
  multiStepInstructions: string;
  repetitionNeeded: string;
  conversationUnderstanding: string;
  longerExplanations: string;
  impliedMeaning: string;
  backgroundNoise: string;
  understandingStrengths: string[];
  understandingStrengthsOther?: string;
  parentListeningNotes?: string;
}

export interface Step5VocabularyData {
  newWordLearning: string;
  wordRetention: string;
  wordMeaning: string;
  wordFinding: string;
  sentenceUse: string;
  difficultWordActivities: string[];
  vocabularyPriorities: string[];
  vocabularyPrioritiesOther?: string;
  parentVocabularyNotes?: string;
  vocabularyStrengths: string[];
  vocabularyStrengthsOther?: string;
}

export interface Step6ReadingData {
  readingComfort: string;
  familiarWordReading: string;
  unfamiliarWordReading: string;
  readingFrustration: string;
  mainIdea: string;
  comprehensionQuestions: string;
  informationRecall: string;
  retelling: string;
  sequencing: string;
  causeAndEffect: string;
  inference: string;
  importantDetails: string;
  difficultLearningSituations: string[];
  readingStrengths: string[];
  parentReadingNotes?: string;
  readingLearningProfile: {
    readingComfort: string;
    familiarWordReading: string;
    unfamiliarWordReading: string;
    readingFrustration: string;
    mainIdea: string;
    comprehensionQuestions: string;
    informationRecall: string;
    retelling: string;
    sequencing: string;
    causeAndEffect: string;
    inference: string;
    importantDetails: string;
    difficultLearningSituations: string[];
    readingStrengths: string[];
    parentReadingNotes?: string;
  };
}

export interface Step7ExpressionData {
  explainingIdeas: string;
  describingThings: string;
  explainingWhy: string;
  openEndedQuestions: string;
  organizingThoughts: string;
  tellingEvents: string;
  logicalOrder: string;
  importantStoryDetails: string;
  firstNextLast: string;
  difficultEverydaySituations: string[];
  difficultEverydaySituationsOther?: string;
  expressionStrengths: string[];
  expressionStrengthsOther?: string;
  parentExpressionNotes?: string;
  expressionProfile: {
    explainingIdeas: string;
    describingThings: string;
    explainingWhy: string;
    openEndedQuestions: string;
    organizingThoughts: string;
    tellingEvents: string;
    logicalOrder: string;
    importantStoryDetails: string;
    firstNextLast: string;
    difficultEverydaySituations: string[];
    expressionStrengths: string[];
    parentExpressionNotes?: string;
  };
}

export interface Step8RoutineData {
  practiceTime: string;
  practiceDays: string;
  practiceTimeOfDay?: string;
  bestLearningTime?: string;
  enjoyedActivities: string[];
  enjoyedActivitiesOther?: string;
  enjoyableActivities?: string[];
  learningSupports: string[];
  learningSupportsOther?: string;
  helpfulSupports?: string[];
  dailyChallenges: string[];
  dailyChallengesOther?: string;
  homeLearningChallenges?: string[];
  movementPlayTypes: string[];
  movementPlayTypesOther?: string;
  movementActivities?: string[];
  movementOpportunities: string;
  routineHelpAreas: string[];
  routineHelpAreasOther?: string;
  routinePriorities?: string[];
  parentRoutineNotes?: string;
  routineProfile: {
    practiceTime: string;
    practiceDays: string;
    bestLearningTime: string;
    enjoyableActivities: string[];
    helpfulSupports: string[];
    homeLearningChallenges: string[];
    movementActivities: string[];
    movementOpportunities: string;
    routinePriorities: string[];
    parentRoutineNotes?: string;
  };
}

export interface Step9ConcernsData {
  mainConcerns: string[];
  mainConcernsOther?: string;
  topPriorities: string[];
  mainGoal?: string;
  familyGoal?: string;
  childStrengths?: string;
  childStrengthsText?: string;
  additionalNotes?: string;
  previouslyHelpfulSupports?: string[];
  pastHelpedSupports?: string[];
  pastHelpedSupportsOther?: string;
  professionalSupport?: string[];
  professionalSupports?: string[];
  professionalSupportsOther?: string;
  professionalSupportNotes?: string;
  goalsProfile?: {
    mainConcerns: string[];
    mainConcernsOther?: string;
    topPriorities: string[];
    mainGoal?: string;
    familyGoal?: string;
    childStrengths?: string;
    childStrengthsText?: string;
    previouslyHelpfulSupports?: string[];
    pastHelpedSupports?: string[];
    pastHelpedSupportsOther?: string;
    professionalSupport?: string[];
    professionalSupports?: string[];
    professionalSupportsOther?: string;
    professionalSupportNotes?: string;
    additionalNotes?: string;
  };
}

interface ParentNeedsAssessmentProps {
  childName?: string;
  onSaved?: () => void;
  onNavigate?: (page: NavPage) => void;
  onContinue?: (data: {
    step1: Step1ChildProfileData;
    step2?: Step2LanguageBackgroundData;
    step3?: Step3CommunicationData;
    step4?: Step4ListeningData;
    step5?: Step5VocabularyData;
    step6?: Step6ReadingData;
    step7?: Step7ExpressionData;
    step8?: Step8RoutineData;
    step9?: Step9ConcernsData;
  }) => void;
}

const EDUCATION_LEVELS = [
  'Preschool',
  'Primary School',
  'Middle School',
  'Secondary School',
  'College / University',
  'Other',
];

const LEARNING_STYLES = [
  {
    id: 'Visual',
    label: 'Visual',
    description: 'Learns best with pictures, diagrams, and visual cues',
    icon: Eye,
  },
  {
    id: 'Listening / Audio',
    label: 'Listening / Audio',
    description: 'Learns best through spoken words, stories, and audio',
    icon: Volume2,
  },
  {
    id: 'Reading',
    label: 'Reading',
    description: 'Learns best with written text and book reading',
    icon: BookOpen,
  },
  {
    id: 'Hands-on Activities',
    label: 'Hands-on Activities',
    description: 'Learns best by doing, manipulating objects, and interactive play',
    icon: Puzzle,
  },
  {
    id: 'Combination',
    label: 'Combination',
    description: 'Benefits from a mix of visual, auditory, and tactile modalities',
    icon: Layers,
  },
];

const COMMON_LANGUAGES = [
  'English',
  'Hindi',
  'Bengali',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Urdu',
  'Other',
];

const MULTILINGUAL_OPTIONS = ['Yes', 'No', 'Not sure'];

const COMFORTABLE_LANG_OPTIONS = [
  'Same as home language',
  'Same as school language',
  'Both equally',
  'Another language',
  'Not sure',
];

const EASE_OPTIONS = ['Usually easy', 'Sometimes difficult', 'Often difficult', 'Not sure'];
const AVOIDANCE_OPTIONS = ['Never', 'Sometimes', 'Often', 'Not sure'];
const REPETITION_OPTIONS = ['Rarely', 'Sometimes', 'Often', 'Not sure'];
const NOISE_OPTIONS = ['No', 'Sometimes', 'Often', 'Not sure'];

const STRENGTHS_OPTIONS = [
  'Asking for things',
  'Answering questions',
  'Talking about interests',
  'Telling stories',
  'Describing things',
  'Talking with family',
  'Talking with friends',
  'Expressing feelings',
  'Other',
];

const UNDERSTANDING_STRENGTHS_OPTIONS = [
  'Everyday conversations',
  'Simple instructions',
  'Stories',
  'Questions',
  'Visual information',
  'Classroom instructions',
  'Step-by-step activities',
  'Topics they are interested in',
  'Other',
];

const DIFFICULT_ACTIVITIES_OPTIONS = [
  'Naming objects',
  'Naming actions',
  'Describing objects',
  'Describing people',
  'Describing places',
  'Finding similar words',
  'Finding opposite words',
  'Grouping words into categories',
  'Explaining word meanings',
  'Using words in sentences',
  'Remembering words',
  'Not sure',
];

const VOCABULARY_PRIORITIES_OPTIONS = [
  'Everyday vocabulary',
  'School / academic vocabulary',
  'Emotions and feelings',
  'Actions and verbs',
  'Describing words',
  'Social communication words',
  'Storytelling vocabulary',
  'Subject-specific vocabulary',
  'Other',
];

const VOCABULARY_STRENGTHS_OPTIONS = [
  'Learns words from stories',
  'Learns words from pictures',
  'Learns words from conversations',
  'Remembers familiar words',
  'Uses words confidently',
  'Enjoys word games',
  'Enjoys talking about favourite topics',
  'Can describe things well',
  'Other',
];

const EVERYDAY_EXPRESSION_SITUATIONS = [
  'Asking for help',
  'Explaining what they need',
  'Describing what happened',
  'Answering unexpected questions',
  'Telling a story',
  'Explaining an opinion',
  'Explaining how to do something',
  'Talking about feelings',
  'Talking about school or studies',
  'Talking about interests',
  'None of these',
  'Not sure',
  'Other',
];

const EXPRESSION_STRENGTHS_OPTIONS = [
  'Talking about favourite topics',
  'Telling stories',
  'Describing things',
  'Explaining ideas',
  'Talking with family',
  'Talking with friends',
  'Expressing feelings',
  'Asking questions',
  'Sharing experiences',
  'Other',
];

const PRACTICE_TIME_OPTIONS = [
  'Less than 10 minutes',
  '10–20 minutes',
  '20–30 minutes',
  '30–45 minutes',
  'More than 45 minutes',
  'It varies from day to day',
  'Not sure',
];

const PRACTICE_DAYS_OPTIONS = [
  '1–2 days',
  '3–4 days',
  '5–6 days',
  'Every day',
  'It varies',
  'Not sure',
];

const PRACTICE_TIME_OF_DAY_OPTIONS = [
  'Morning',
  'Afternoon',
  'Evening',
  'No particular time',
  'It varies',
];

const CHILD_ENJOYED_ACTIVITIES_OPTIONS = [
  'Listening to stories',
  'Reading',
  'Looking at pictures',
  'Talking and conversation',
  'Word games',
  'Storytelling',
  'Drawing or creative activities',
  'Movement-based activities',
  'Puzzles',
  'Technology-based activities',
  'Learning about favourite topics',
  'Other',
];

const LEARNING_SUPPORTS_OPTIONS = [
  'Short activities',
  'Repetition',
  'Pictures or visual examples',
  'Audio or spoken instructions',
  'Written instructions',
  'Demonstration/example first',
  'One instruction at a time',
  'Breaks between activities',
  'Encouragement or praise',
  'Choice between activities',
  'Working with a parent/caregiver',
  'Other',
  'Not sure',
];

const DAILY_CHALLENGES_OPTIONS = [
  'Short attention span',
  'Getting tired',
  'Losing interest',
  'Too much noise',
  'Too many instructions at once',
  'Difficulty understanding the task',
  'Difficulty remembering what to do',
  'Limited time at home',
  'Homework or school workload',
  'Other',
  'Not sure',
];

const MOVEMENT_PLAY_OPTIONS = [
  'Walking',
  'Outdoor play',
  'Cycling',
  'Dancing',
  'Sports',
  'Stretching',
  'Playground activities',
  'Family activities',
  'Other',
  'Not sure',
];

const MOVEMENT_OPPORTUNITIES_OPTIONS = [
  'Regular opportunities most days',
  'Some days',
  'Limited opportunities',
  'Varies considerably',
  'Not sure',
];

const ROUTINE_HELP_ORGANIZING_OPTIONS = [
  'Learning/practice time',
  'Reading time',
  'Breaks',
  'Outdoor/movement time',
  'Bedtime routine',
  'Screen-time balance',
  'Family activity time',
  'None',
  'Other',
];

const MAIN_CONCERNS_OPTIONS = [
  'Speaking and expressing ideas',
  'Listening and understanding',
  'Vocabulary and word learning',
  'Reading',
  'Reading comprehension',
  'Following instructions',
  'Storytelling',
  'Social communication',
  'Academic or school language',
  'Everyday communication',
  'Confidence when communicating',
  'Other',
  'Not sure',
];

const PAST_HELPED_OPTIONS = [
  'Pictures or visual examples',
  'Listening/audio',
  'Reading together',
  'Repetition',
  'Short activities',
  'Games',
  'Storytelling',
  'One-to-one practice',
  'Parent/caregiver support',
  'Teacher support',
  'Speech-language support',
  'Other',
  'Not sure',
];

const PROFESSIONAL_SUPPORT_OPTIONS = [
  'Speech-language therapist/pathologist',
  'Teacher or special educator',
  'Pediatrician/doctor',
  'Audiologist',
  'Psychologist/developmental professional',
  'Other',
  'No current professional support',
  'Prefer not to say',
];

export const ParentNeedsAssessment: React.FC<ParentNeedsAssessmentProps> = ({
  childName,
  onSaved,
  onContinue,
  onNavigate,
}) => {
  const getInitialStep = (): number => {
    try {
      const storedStep = localStorage.getItem('lingua_parent_current_step');
      if (storedStep) {
        const parsed = parseInt(storedStep, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
          return parsed;
        }
      }
      if (localStorage.getItem('lingua_parent_step9_data')) return 10;
      if (localStorage.getItem('lingua_parent_step8_data')) return 9;
      if (localStorage.getItem('lingua_parent_step7_data')) return 8;
      if (localStorage.getItem('lingua_parent_step6_data')) return 7;
      if (localStorage.getItem('lingua_parent_step5_data')) return 6;
      if (localStorage.getItem('lingua_parent_step4_data')) return 5;
      if (localStorage.getItem('lingua_parent_step3_data')) return 4;
      if (localStorage.getItem('lingua_parent_step2_data')) return 3;
      if (localStorage.getItem('lingua_parent_step1_data')) return 2;
    } catch {}
    return 1;
  };

  // Step navigation state with single persistent source of truth
  const [currentStep, setCurrentStepState] = useState<number>(() => getInitialStep());

  // Caregiver Hub Tab & Routine state
  const [activeHubTab, setActiveHubTab] = useState<'BLUEPRINT' | 'ROUTINES' | 'CLINICAL'>('BLUEPRINT');
  const [triedRoutines, setTriedRoutines] = useState<{ [key: string]: boolean }>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const setCurrentStep = (step: number) => {
    setCurrentStepState(step);
    try {
      localStorage.setItem('lingua_parent_current_step', String(step));
    } catch {}
  };

  // --- STEP 1 STATE ---
  const [preferredName, setPreferredName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step1_data');
      if (saved) return JSON.parse(saved).preferredName || '';
    } catch {}
    return '';
  });

  const [age, setAge] = useState<number | ''>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step1_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.age === 'number') return parsed.age;
      }
    } catch {}
    return 8;
  });

  const [educationLevel, setEducationLevel] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step1_data');
      if (saved) return JSON.parse(saved).educationLevel || 'Primary School';
    } catch {}
    return 'Primary School';
  });

  const [learningStyle, setLearningStyle] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step1_data');
      if (saved) return JSON.parse(saved).learningStyle || 'Combination';
    } catch {}
    return 'Combination';
  });

  const [isStep1Saved, setIsStep1Saved] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('lingua_parent_step1_data');
    } catch {}
    return false;
  });

  // --- STEP 2 STATE ---
  const [homeLanguage, setHomeLanguage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step2_data');
      if (saved) return JSON.parse(saved).homeLanguage || 'English';
    } catch {}
    return 'English';
  });
  const [homeLanguageOther, setHomeLanguageOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step2_data');
      if (saved) return JSON.parse(saved).homeLanguageOther || '';
    } catch {}
    return '';
  });

  const [schoolLanguage, setSchoolLanguage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step2_data');
      if (saved) return JSON.parse(saved).schoolLanguage || 'English';
    } catch {}
    return 'English';
  });
  const [schoolLanguageOther, setSchoolLanguageOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step2_data');
      if (saved) return JSON.parse(saved).schoolLanguageOther || '';
    } catch {}
    return '';
  });

  const [isMultilingual, setIsMultilingual] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step2_data');
      if (saved) return JSON.parse(saved).isMultilingual || 'Yes';
    } catch {}
    return 'Yes';
  });

  const [comfortableLanguage, setComfortableLanguage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step2_data');
      if (saved) return JSON.parse(saved).comfortableLanguage || 'Both equally';
    } catch {}
    return 'Both equally';
  });
  const [comfortableLanguageOther, setComfortableLanguageOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step2_data');
      if (saved) return JSON.parse(saved).comfortableLanguageOther || '';
    } catch {}
    return '';
  });

  const [preferredActivityLanguage, setPreferredActivityLanguage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step2_data');
      if (saved) return JSON.parse(saved).preferredActivityLanguage || 'English';
    } catch {}
    return 'English';
  });

  const [step2Error, setStep2Error] = useState<string>('');
  const [isStep2Saved, setIsStep2Saved] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('lingua_parent_step2_data');
    } catch {}
    return false;
  });

  // --- STEP 3 STATE ---
  const [expressingNeeds, setExpressingNeeds] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step3_data');
      if (saved) return JSON.parse(saved).expressingNeeds || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });

  const [findingWords, setFindingWords] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step3_data');
      if (saved) return JSON.parse(saved).findingWords || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });

  const [formingSentences, setFormingSentences] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step3_data');
      if (saved) return JSON.parse(saved).formingSentences || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });

  const [storytelling, setStorytelling] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step3_data');
      if (saved) return JSON.parse(saved).storytelling || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });

  const [explainingIdeas, setExplainingIdeas] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step3_data');
      if (saved) return JSON.parse(saved).explainingIdeas || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });

  const [speakingAvoidance, setSpeakingAvoidance] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step3_data');
      if (saved) return JSON.parse(saved).speakingAvoidance || 'Sometimes';
    } catch {}
    return 'Sometimes';
  });

  const [communicationStrengths, setCommunicationStrengths] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step3_data');
      if (saved) return JSON.parse(saved).communicationStrengths || ['Talking about interests', 'Talking with family'];
    } catch {}
    return ['Talking about interests', 'Talking with family'];
  });

  const [communicationStrengthsOther, setCommunicationStrengthsOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step3_data');
      if (saved) return JSON.parse(saved).communicationStrengthsOther || '';
    } catch {}
    return '';
  });

  const [parentCommunicationNotes, setParentCommunicationNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step3_data');
      if (saved) return JSON.parse(saved).parentCommunicationNotes || '';
    } catch {}
    return '';
  });

  const [step3Error, setStep3Error] = useState<string>('');
  const [isStep3Saved, setIsStep3Saved] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('lingua_parent_step3_data');
    } catch {}
    return false;
  });

  // --- STEP 4 STATE ---
  const [simpleInstructions, setSimpleInstructions] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved).simpleInstructions || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });

  const [multiStepInstructions, setMultiStepInstructions] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved).multiStepInstructions || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });

  const [repetitionNeeded, setRepetitionNeeded] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved).repetitionNeeded || 'Sometimes';
    } catch {}
    return 'Sometimes';
  });

  const [conversationUnderstanding, setConversationUnderstanding] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved).conversationUnderstanding || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });

  const [longerExplanations, setLongerExplanations] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved).longerExplanations || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });

  const [impliedMeaning, setImpliedMeaning] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved).impliedMeaning || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });

  const [backgroundNoise, setBackgroundNoise] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved).backgroundNoise || 'Sometimes';
    } catch {}
    return 'Sometimes';
  });

  const [understandingStrengths, setUnderstandingStrengths] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved).understandingStrengths || ['Everyday conversations', 'Stories'];
    } catch {}
    return ['Everyday conversations', 'Stories'];
  });

  const [understandingStrengthsOther, setUnderstandingStrengthsOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved).understandingStrengthsOther || '';
    } catch {}
    return '';
  });

  const [parentListeningNotes, setParentListeningNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved).parentListeningNotes || '';
    } catch {}
    return '';
  });

  const [step4Error, setStep4Error] = useState<string>('');
  const [isStep4Saved, setIsStep4Saved] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('lingua_parent_step4_data');
    } catch {}
    return false;
  });

  // --- STEP 5 STATE ---
  const [newWordLearning, setNewWordLearning] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).newWordLearning || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });

  const [wordRetention, setWordRetention] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).wordRetention || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });

  const [wordMeaning, setWordMeaning] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).wordMeaning || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });

  const [wordFinding, setWordFinding] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).wordFinding || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });

  const [sentenceUse, setSentenceUse] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).sentenceUse || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });

  const [difficultWordActivities, setDifficultWordActivities] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).difficultWordActivities || ['Remembering words', 'Explaining word meanings'];
    } catch {}
    return ['Remembering words', 'Explaining word meanings'];
  });

  const [vocabularyPriorities, setVocabularyPriorities] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).vocabularyPriorities || ['Everyday vocabulary', 'School / academic vocabulary'];
    } catch {}
    return ['Everyday vocabulary', 'School / academic vocabulary'];
  });

  const [vocabularyPrioritiesOther, setVocabularyPrioritiesOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).vocabularyPrioritiesOther || '';
    } catch {}
    return '';
  });

  const [parentVocabularyNotes, setParentVocabularyNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).parentVocabularyNotes || '';
    } catch {}
    return '';
  });

  const [vocabularyStrengths, setVocabularyStrengths] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).vocabularyStrengths || ['Learns words from stories', 'Enjoys talking about favourite topics'];
    } catch {}
    return ['Learns words from stories', 'Enjoys talking about favourite topics'];
  });

  const [vocabularyStrengthsOther, setVocabularyStrengthsOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved).vocabularyStrengthsOther || '';
    } catch {}
    return '';
  });

  const [step5Error, setStep5Error] = useState<string>('');
  const [isStep5Saved, setIsStep5Saved] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('lingua_parent_step5_data');
    } catch {}
    return false;
  });

  // --- STEP 6 STATE ---
  const [readingComfort, setReadingComfort] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).readingComfort || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });
  const [familiarWordReading, setFamiliarWordReading] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).familiarWordReading || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });
  const [unfamiliarWordReading, setUnfamiliarWordReading] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).unfamiliarWordReading || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });
  const [readingFrustration, setReadingFrustration] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).readingFrustration || 'Sometimes';
    } catch {}
    return 'Sometimes';
  });
  const [mainIdea, setMainIdea] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).mainIdea || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });
  const [comprehensionQuestions, setComprehensionQuestions] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).comprehensionQuestions || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });
  const [informationRecall, setInformationRecall] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).informationRecall || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });
  const [retelling, setRetelling] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).retelling || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });
  const [sequencing, setSequencing] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).sequencing || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });
  const [causeAndEffect, setCauseAndEffect] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).causeAndEffect || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });
  const [inference, setInference] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).inference || 'Sometimes difficult';
    } catch {}
    return 'Sometimes difficult';
  });
  const [importantDetails, setImportantDetails] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).importantDetails || 'Usually easy';
    } catch {}
    return 'Usually easy';
  });
  const [parentReadingNotes, setParentReadingNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved).parentReadingNotes || '';
    } catch {}
    return '';
  });
  const [difficultLearningSituations, setDifficultLearningSituations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        const list = parsed.difficultLearningSituations || parsed.readingLearningProfile?.difficultLearningSituations;
        if (Array.isArray(list)) return list;
      }
    } catch {}
    return ['Reading instructions', 'Understanding stories'];
  });
  const [readingStrengths, setReadingStrengths] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        const list = parsed.readingStrengths || parsed.readingLearningProfile?.readingStrengths;
        if (Array.isArray(list)) return list;
      }
    } catch {}
    return ['Stories', 'Reading about favourite topics'];
  });
  const [step6Error, setStep6Error] = useState<string>('');

  // --- STEP 7 STATE ---
  const [step7ExplainingIdeas, setStep7ExplainingIdeas] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.explainingIdeas || parsed.explainingIdea || parsed.expressionProfile?.explainingIdeas || 'Usually easy';
      }
    } catch {}
    return 'Usually easy';
  });

  const [step7DescribingThings, setStep7DescribingThings] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.describingThings || parsed.describingEntities || parsed.expressionProfile?.describingThings || 'Usually easy';
      }
    } catch {}
    return 'Usually easy';
  });

  const [step7ExplainingWhy, setStep7ExplainingWhy] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.explainingWhy || parsed.expressionProfile?.explainingWhy || 'Usually easy';
      }
    } catch {}
    return 'Usually easy';
  });

  const [step7OpenEndedQuestions, setStep7OpenEndedQuestions] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.openEndedQuestions || parsed.expressionProfile?.openEndedQuestions || 'Usually easy';
      }
    } catch {}
    return 'Usually easy';
  });

  const [step7OrganizingThoughts, setStep7OrganizingThoughts] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.organizingThoughts || parsed.expressionProfile?.organizingThoughts || 'Sometimes difficult';
      }
    } catch {}
    return 'Sometimes difficult';
  });

  const [step7TellingEvents, setStep7TellingEvents] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.tellingEvents || parsed.storytellingEvents || parsed.expressionProfile?.tellingEvents || 'Usually easy';
      }
    } catch {}
    return 'Usually easy';
  });

  const [step7LogicalOrder, setStep7LogicalOrder] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.logicalOrder || parsed.expressionProfile?.logicalOrder || 'Usually easy';
      }
    } catch {}
    return 'Usually easy';
  });

  const [step7ImportantStoryDetails, setStep7ImportantStoryDetails] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.importantStoryDetails || parsed.includingDetails || parsed.expressionProfile?.importantStoryDetails || 'Sometimes difficult';
      }
    } catch {}
    return 'Sometimes difficult';
  });

  const [step7FirstNextLast, setStep7FirstNextLast] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.firstNextLast || parsed.sequencingChronology || parsed.expressionProfile?.firstNextLast || 'Usually easy';
      }
    } catch {}
    return 'Usually easy';
  });

  const [difficultEverydaySituations, setDifficultEverydaySituations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        const list = parsed.difficultEverydaySituations || parsed.difficultExpressionSituations || parsed.expressionProfile?.difficultEverydaySituations;
        if (Array.isArray(list)) return list;
      }
    } catch {}
    return ['Answering unexpected questions', 'Explaining an opinion'];
  });

  const [difficultEverydaySituationsOther, setDifficultEverydaySituationsOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.difficultEverydaySituationsOther || parsed.difficultExpressionSituationsOther || '';
      }
    } catch {}
    return '';
  });

  const [expressionStrengths, setExpressionStrengths] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        const list = parsed.expressionStrengths || parsed.expressionProfile?.expressionStrengths;
        if (Array.isArray(list)) return list;
      }
    } catch {}
    return ['Talking about favourite topics', 'Talking with family'];
  });

  const [expressionStrengthsOther, setExpressionStrengthsOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.expressionStrengthsOther || '';
      }
    } catch {}
    return '';
  });

  const [parentExpressionNotes, setParentExpressionNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.parentExpressionNotes || parsed.expressionProfile?.parentExpressionNotes || '';
      }
    } catch {}
    return '';
  });
  const [step7Error, setStep7Error] = useState<string>('');

  const toggleDifficultEverydaySituation = (option: string) => {
    setDifficultEverydaySituations((prev) => {
      if (option === 'None of these') {
        return prev.includes('None of these') ? [] : ['None of these'];
      }
      if (option === 'Not sure') {
        return prev.includes('Not sure') ? [] : ['Not sure'];
      }
      const filtered = prev.filter((i) => i !== 'None of these' && i !== 'Not sure');
      if (filtered.includes(option)) {
        return filtered.filter((i) => i !== option);
      } else {
        return [...filtered, option];
      }
    });
    if (step7Error) setStep7Error('');
  };

  const toggleExpressionStrength = (option: string) => {
    setExpressionStrengths((prev) => {
      if (option === 'None of these') {
        return prev.includes('None of these') ? [] : ['None of these'];
      }
      if (option === 'Not sure') {
        return prev.includes('Not sure') ? [] : ['Not sure'];
      }
      const filtered = prev.filter((i) => i !== 'None of these' && i !== 'Not sure');
      if (filtered.includes(option)) {
        return filtered.filter((i) => i !== option);
      } else {
        return [...filtered, option];
      }
    });
    if (step7Error) setStep7Error('');
  };

  // --- STEP 8 STATE ---
  const [practiceTime, setPracticeTime] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).practiceTime || '10–20 minutes';
    } catch {}
    return '10–20 minutes';
  });

  const [practiceDays, setPracticeDays] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).practiceDays || '3–4 days';
    } catch {}
    return '3–4 days';
  });

  const [practiceTimeOfDay, setPracticeTimeOfDay] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).practiceTimeOfDay || 'Afternoon';
    } catch {}
    return 'Afternoon';
  });

  const [enjoyedActivities, setEnjoyedActivities] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).enjoyedActivities || ['Listening to stories', 'Word games'];
    } catch {}
    return ['Listening to stories', 'Word games'];
  });

  const [enjoyedActivitiesOther, setEnjoyedActivitiesOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).enjoyedActivitiesOther || '';
    } catch {}
    return '';
  });

  const [learningSupports, setLearningSupports] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).learningSupports || ['Pictures or visual examples', 'Short activities'];
    } catch {}
    return ['Pictures or visual examples', 'Short activities'];
  });

  const [learningSupportsOther, setLearningSupportsOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).learningSupportsOther || '';
    } catch {}
    return '';
  });

  const [dailyChallenges, setDailyChallenges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).dailyChallenges || ['Getting tired', 'Short attention span'];
    } catch {}
    return ['Getting tired', 'Short attention span'];
  });

  const [dailyChallengesOther, setDailyChallengesOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).dailyChallengesOther || '';
    } catch {}
    return '';
  });

  const [movementPlayTypes, setMovementPlayTypes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).movementPlayTypes || ['Outdoor play', 'Playground activities'];
    } catch {}
    return ['Outdoor play', 'Playground activities'];
  });

  const [movementPlayTypesOther, setMovementPlayTypesOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).movementPlayTypesOther || '';
    } catch {}
    return '';
  });

  const [movementOpportunities, setMovementOpportunities] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).movementOpportunities || 'Regular opportunities most days';
    } catch {}
    return 'Regular opportunities most days';
  });

  const [routineHelpAreas, setRoutineHelpAreas] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).routineHelpAreas || ['Learning/practice time', 'Breaks'];
    } catch {}
    return ['Learning/practice time', 'Breaks'];
  });

  const [routineHelpAreasOther, setRoutineHelpAreasOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).routineHelpAreasOther || '';
    } catch {}
    return '';
  });

  const [parentRoutineNotes, setParentRoutineNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved).parentRoutineNotes || '';
    } catch {}
    return '';
  });

  const [step8Error, setStep8Error] = useState<string>('');

  const toggleEnjoyedActivity = (option: string) => {
    setEnjoyedActivities((prev) =>
      prev.includes(option) ? prev.filter((i) => i !== option) : [...prev, option]
    );
  };

  const toggleLearningSupport = (option: string) => {
    setLearningSupports((prev) => {
      if (option === 'Not sure') {
        return prev.includes('Not sure') ? [] : ['Not sure'];
      }
      const filtered = prev.filter((i) => i !== 'Not sure');
      return filtered.includes(option) ? filtered.filter((i) => i !== option) : [...filtered, option];
    });
  };

  const toggleDailyChallenge = (option: string) => {
    setDailyChallenges((prev) => {
      if (option === 'Not sure') {
        return prev.includes('Not sure') ? [] : ['Not sure'];
      }
      const filtered = prev.filter((i) => i !== 'Not sure');
      return filtered.includes(option) ? filtered.filter((i) => i !== option) : [...filtered, option];
    });
  };

  const toggleMovementPlay = (option: string) => {
    setMovementPlayTypes((prev) => {
      if (option === 'Not sure') {
        return prev.includes('Not sure') ? [] : ['Not sure'];
      }
      const filtered = prev.filter((i) => i !== 'Not sure');
      return filtered.includes(option) ? filtered.filter((i) => i !== option) : [...filtered, option];
    });
  };

  const toggleRoutineHelpArea = (option: string) => {
    setRoutineHelpAreas((prev) => {
      if (option === 'None') {
        return prev.includes('None') ? [] : ['None'];
      }
      const filtered = prev.filter((i) => i !== 'None');
      return filtered.includes(option) ? filtered.filter((i) => i !== option) : [...filtered, option];
    });
  };

  const getStep1Data = (): Step1ChildProfileData => {
    try {
      const saved = localStorage.getItem('lingua_parent_step1_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      preferredName: preferredName.trim(),
      age: typeof age === 'number' ? age : 8,
      educationLevel,
      learningStyle,
    };
  };

  const getStep2Data = (): Step2LanguageBackgroundData => {
    try {
      const saved = localStorage.getItem('lingua_parent_step2_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      homeLanguage,
      homeLanguageOther: homeLanguage === 'Other' ? homeLanguageOther.trim() : undefined,
      schoolLanguage,
      schoolLanguageOther: schoolLanguage === 'Other' ? schoolLanguageOther.trim() : undefined,
      isMultilingual,
      comfortableLanguage,
      comfortableLanguageOther: comfortableLanguage === 'Another language' ? comfortableLanguageOther.trim() : undefined,
      preferredActivityLanguage,
    };
  };

  const getStep3Data = (): Step3CommunicationData => {
    try {
      const saved = localStorage.getItem('lingua_parent_step3_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      expressingNeeds,
      findingWords,
      formingSentences,
      storytelling,
      explainingIdeas,
      speakingAvoidance,
      communicationStrengths,
      communicationStrengthsOther: communicationStrengths.includes('Other') ? communicationStrengthsOther.trim() : undefined,
      parentCommunicationNotes: parentCommunicationNotes.trim() || undefined,
    };
  };

  const getStep4Data = (): Step4ListeningData => {
    try {
      const saved = localStorage.getItem('lingua_parent_step4_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      simpleInstructions,
      multiStepInstructions,
      repetitionNeeded,
      conversationUnderstanding,
      longerExplanations,
      impliedMeaning,
      backgroundNoise,
      understandingStrengths,
      understandingStrengthsOther: understandingStrengths.includes('Other') ? understandingStrengthsOther.trim() : undefined,
      parentListeningNotes: parentListeningNotes.trim() || undefined,
    };
  };

  const getStep5Data = (): Step5VocabularyData => {
    try {
      const saved = localStorage.getItem('lingua_parent_step5_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      newWordLearning,
      wordRetention,
      wordMeaning,
      wordFinding,
      sentenceUse,
      difficultWordActivities,
      vocabularyPriorities,
      vocabularyPrioritiesOther: vocabularyPriorities.includes('Other') ? vocabularyPrioritiesOther.trim() : undefined,
      parentVocabularyNotes: parentVocabularyNotes.trim() || undefined,
      vocabularyStrengths,
      vocabularyStrengthsOther: vocabularyStrengths.includes('Other') ? vocabularyStrengthsOther.trim() : undefined,
    };
  };

  const getStep6Data = (): Step6ReadingData => {
    try {
      const saved = localStorage.getItem('lingua_parent_step6_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    const readingProfile = {
      readingComfort,
      familiarWordReading,
      unfamiliarWordReading,
      readingFrustration,
      mainIdea,
      comprehensionQuestions,
      informationRecall,
      retelling,
      sequencing,
      causeAndEffect,
      inference,
      importantDetails,
      difficultLearningSituations,
      readingStrengths,
      parentReadingNotes: parentReadingNotes.trim() || undefined,
    };
    return {
      ...readingProfile,
      readingLearningProfile: readingProfile,
    };
  };

  const getStep7Data = (): Step7ExpressionData => {
    try {
      const saved = localStorage.getItem('lingua_parent_step7_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    const expressionProfile = {
      explainingIdeas: step7ExplainingIdeas,
      describingThings: step7DescribingThings,
      explainingWhy: step7ExplainingWhy,
      openEndedQuestions: step7OpenEndedQuestions,
      organizingThoughts: step7OrganizingThoughts,
      tellingEvents: step7TellingEvents,
      logicalOrder: step7LogicalOrder,
      importantStoryDetails: step7ImportantStoryDetails,
      firstNextLast: step7FirstNextLast,
      difficultEverydaySituations,
      expressionStrengths,
      parentExpressionNotes: parentExpressionNotes.trim() || undefined,
    };
    return {
      ...expressionProfile,
      difficultEverydaySituationsOther: difficultEverydaySituations.includes('Other') ? difficultEverydaySituationsOther.trim() : undefined,
      expressionStrengthsOther: expressionStrengths.includes('Other') ? expressionStrengthsOther.trim() : undefined,
      expressionProfile,
    };
  };

  const getStep8Data = (): Step8RoutineData => {
    try {
      const saved = localStorage.getItem('lingua_parent_step8_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    const routineProfile = {
      practiceTime,
      practiceDays,
      bestLearningTime: practiceTimeOfDay,
      enjoyableActivities: enjoyedActivities,
      helpfulSupports: learningSupports,
      homeLearningChallenges: dailyChallenges,
      movementActivities: movementPlayTypes,
      movementOpportunities,
      routinePriorities: routineHelpAreas,
      parentRoutineNotes: parentRoutineNotes.trim() || undefined,
    };
    return {
      practiceTime,
      practiceDays,
      practiceTimeOfDay,
      bestLearningTime: practiceTimeOfDay,
      enjoyedActivities,
      enjoyedActivitiesOther: enjoyedActivities.includes('Other') ? enjoyedActivitiesOther.trim() : undefined,
      enjoyableActivities: enjoyedActivities,
      learningSupports,
      learningSupportsOther: learningSupports.includes('Other') ? learningSupportsOther.trim() : undefined,
      helpfulSupports: learningSupports,
      dailyChallenges,
      dailyChallengesOther: dailyChallenges.includes('Other') ? dailyChallengesOther.trim() : undefined,
      homeLearningChallenges: dailyChallenges,
      movementPlayTypes,
      movementPlayTypesOther: movementPlayTypes.includes('Other') ? movementPlayTypesOther.trim() : undefined,
      movementActivities: movementPlayTypes,
      movementOpportunities,
      routineHelpAreas,
      routineHelpAreasOther: routineHelpAreas.includes('Other') ? routineHelpAreasOther.trim() : undefined,
      routinePriorities: routineHelpAreas,
      parentRoutineNotes: parentRoutineNotes.trim() || undefined,
      routineProfile,
    };
  };

  const validateStep8 = (): boolean => {
    if (!practiceTime) {
      setStep8Error('Please select practice time duration.');
      return false;
    }
    if (!practiceDays) {
      setStep8Error('Please select practice days per week.');
      return false;
    }
    if (enjoyedActivities.includes('Other') && !enjoyedActivitiesOther.trim()) {
      setStep8Error('Please specify the other activity your child enjoys.');
      return false;
    }
    if (learningSupports.includes('Other') && !learningSupportsOther.trim()) {
      setStep8Error('Please specify the other learning support.');
      return false;
    }
    if (dailyChallenges.includes('Other') && !dailyChallengesOther.trim()) {
      setStep8Error('Please specify the other difficulty at home.');
      return false;
    }
    if (movementPlayTypes.includes('Other') && !movementPlayTypesOther.trim()) {
      setStep8Error('Please specify the other type of movement.');
      return false;
    }
    if (routineHelpAreas.includes('Other') && !routineHelpAreasOther.trim()) {
      setStep8Error('Please specify the other routine part.');
      return false;
    }

    setStep8Error('');
    return true;
  };

  const handleStep8Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep8()) return;

    const routineProfile = {
      practiceTime,
      practiceDays,
      bestLearningTime: practiceTimeOfDay,
      enjoyableActivities: enjoyedActivities,
      helpfulSupports: learningSupports,
      homeLearningChallenges: dailyChallenges,
      movementActivities: movementPlayTypes,
      movementOpportunities,
      routinePriorities: routineHelpAreas,
      parentRoutineNotes: parentRoutineNotes.trim() || undefined,
    };

    const step8Data: Step8RoutineData = {
      practiceTime,
      practiceDays,
      practiceTimeOfDay,
      bestLearningTime: practiceTimeOfDay,
      enjoyedActivities,
      enjoyedActivitiesOther: enjoyedActivities.includes('Other') ? enjoyedActivitiesOther.trim() : undefined,
      enjoyableActivities: enjoyedActivities,
      learningSupports,
      learningSupportsOther: learningSupports.includes('Other') ? learningSupportsOther.trim() : undefined,
      helpfulSupports: learningSupports,
      dailyChallenges,
      dailyChallengesOther: dailyChallenges.includes('Other') ? dailyChallengesOther.trim() : undefined,
      homeLearningChallenges: dailyChallenges,
      movementPlayTypes,
      movementPlayTypesOther: movementPlayTypes.includes('Other') ? movementPlayTypesOther.trim() : undefined,
      movementActivities: movementPlayTypes,
      movementOpportunities,
      routineHelpAreas,
      routineHelpAreasOther: routineHelpAreas.includes('Other') ? routineHelpAreasOther.trim() : undefined,
      routinePriorities: routineHelpAreas,
      parentRoutineNotes: parentRoutineNotes.trim() || undefined,
      routineProfile,
    };

    try {
      localStorage.setItem('lingua_parent_step8_data', JSON.stringify(step8Data));
    } catch (err) {
      console.error('Failed to save step 8 data:', err);
    }

    if (onSaved) onSaved();

    if (onContinue) {
      onContinue({
        step1: getStep1Data(),
        step2: getStep2Data(),
        step3: getStep3Data(),
        step4: getStep4Data(),
        step5: getStep5Data(),
        step6: getStep6Data(),
        step7: getStep7Data(),
        step8: step8Data,
      });
    }

    setCurrentStep(9);
  };

  // --- STEP 9 STATE ---
  const [mainConcerns, setMainConcerns] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved).mainConcerns || [];
    } catch {}
    return [];
  });

  const [mainConcernsOther, setMainConcernsOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved).mainConcernsOther || '';
    } catch {}
    return '';
  });

  const [topPriorities, setTopPriorities] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved).topPriorities || [];
    } catch {}
    return [];
  });

  const [familyGoal, setFamilyGoal] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved).familyGoal || '';
    } catch {}
    return '';
  });

  const [additionalNotes, setAdditionalNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.additionalNotes || parsed.parentStep9Notes || parsed.professionalSupportNotes || '';
      }
    } catch {}
    return '';
  });

  const [childStrengthsText, setChildStrengthsText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved).childStrengthsText || '';
    } catch {}
    return '';
  });

  const [pastHelpedSupports, setPastHelpedSupports] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved).pastHelpedSupports || [];
    } catch {}
    return [];
  });

  const [pastHelpedSupportsOther, setPastHelpedSupportsOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved).pastHelpedSupportsOther || '';
    } catch {}
    return '';
  });

  const [professionalSupports, setProfessionalSupports] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved).professionalSupports || [];
    } catch {}
    return [];
  });

  const [professionalSupportsOther, setProfessionalSupportsOther] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved).professionalSupportsOther || '';
    } catch {}
    return '';
  });

  const [professionalSupportNotes, setProfessionalSupportNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved).professionalSupportNotes || '';
    } catch {}
    return '';
  });

  const [step9Error, setStep9Error] = useState<string>('');

  // --- STEP 10 STATE ---
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isReviewConfirmed, setIsReviewConfirmed] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('lingua_parent_support_profile');
    } catch {}
    return false;
  });
  const [isProfileCreated, setIsProfileCreated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('lingua_parent_support_profile');
    } catch {}
    return false;
  });
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
  const [supportProfile, setSupportProfile] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('lingua_parent_support_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleCreateSupportProfile = () => {
    if (!isReviewConfirmed || isSavingProfile) return;

    setIsSavingProfile(true);
    setProfileSaveError(null);

    try {
      // Gather actual answers collected across all steps
      const s1 = getStep1Data();
      const s2 = getStep2Data();
      const s3 = getStep3Data();
      const s4 = getStep4Data();
      const s5 = getStep5Data();
      const s6 = getStep6Data();
      const s7 = getStep7Data();
      const s8 = getStep8Data();
      const s9 = getStep9Data();

      const childProfile = {
        preferredName: s1.preferredName || preferredName.trim() || undefined,
        age: typeof s1.age === 'number' ? s1.age : (typeof age === 'number' ? age : undefined),
        educationLevel: s1.educationLevel || educationLevel || undefined,
        learningStyle: s1.learningStyle || learningStyle || undefined,
      };

      const languageProfile = s2;
      const communicationProfile = s3;
      const listeningProfile = s4;
      const vocabularyProfile = s5;
      const readingLearningProfile = s6.readingLearningProfile || s6;
      const expressionProfile = s7.expressionProfile || s7;
      const routineProfile = s8.routineProfile || s8;
      const goalsProfile = s9.goalsProfile || s9;

      let existingCreatedAt = new Date().toISOString();
      try {
        const existingStored = localStorage.getItem('lingua_parent_support_profile');
        if (existingStored) {
          const parsed = JSON.parse(existingStored);
          if (parsed && parsed.createdAt) {
            existingCreatedAt = parsed.createdAt;
          }
        }
      } catch {}

      const now = new Date().toISOString();

      const newSupportProfile = {
        childProfile,
        languageProfile,
        communicationProfile,
        listeningProfile,
        vocabularyProfile,
        readingLearningProfile,
        expressionProfile,
        routineProfile,
        goalsProfile,
        createdAt: existingCreatedAt,
        updatedAt: now,
      };

      // Save using existing persistence
      localStorage.setItem('lingua_parent_support_profile', JSON.stringify(newSupportProfile));
      localStorage.setItem('lingua_parent_assessment_completed', 'true');
      localStorage.setItem('lingua_parent_completed_at', now);
      localStorage.setItem('lingua_parent_current_step', '10');

      setSupportProfile(newSupportProfile);
      setIsProfileCreated(true);
      setCurrentStep(10);

      if (onSaved) onSaved();
    } catch (err) {
      console.error('Failed to save support profile:', err);
      setProfileSaveError("We couldn't save your support profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Automatic priority pruning whenever mainConcerns changes
  useEffect(() => {
    setTopPriorities((prev) => prev.filter((priority) => mainConcerns.includes(priority)));
  }, [mainConcerns]);

  const getStep9Data = (): Step9ConcernsData => {
    try {
      const saved = localStorage.getItem('lingua_parent_step9_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    const goalsProfile = {
      mainConcerns,
      mainConcernsOther: mainConcerns.includes('Other') ? mainConcernsOther.trim() : undefined,
      topPriorities,
      mainGoal: familyGoal.trim() || undefined,
      familyGoal: familyGoal.trim() || undefined,
      childStrengths: childStrengthsText.trim() || undefined,
      childStrengthsText: childStrengthsText.trim() || undefined,
      previouslyHelpfulSupports: pastHelpedSupports,
      pastHelpedSupports,
      pastHelpedSupportsOther: pastHelpedSupports.includes('Other') ? pastHelpedSupportsOther.trim() : undefined,
      professionalSupport: professionalSupports,
      professionalSupports,
      professionalSupportsOther: professionalSupports.includes('Other') ? professionalSupportsOther.trim() : undefined,
      professionalSupportNotes: professionalSupportNotes.trim() || additionalNotes.trim() || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
    };
    return {
      ...goalsProfile,
      goalsProfile,
    };
  };

  const toggleMainConcern = (option: string) => {
    setMainConcerns((prev) => {
      if (option === 'Not sure') {
        const next = prev.includes('Not sure') ? [] : ['Not sure'];
        setTopPriorities((priorities) => priorities.filter((p) => next.includes(p)));
        if (step9Error) setStep9Error('');
        return next;
      }
      const filtered = prev.filter((i) => i !== 'Not sure');
      if (filtered.includes(option)) {
        const updated = filtered.filter((i) => i !== option);
        setTopPriorities((priorities) => priorities.filter((p) => updated.includes(p)));
        if (step9Error) setStep9Error('');
        return updated;
      }
      if (filtered.length >= 4) {
        setStep9Error('You can select up to 4 main concern areas.');
        return prev;
      }
      if (step9Error) setStep9Error('');
      return [...filtered, option];
    });
  };

  const toggleTopPriority = (option: string) => {
    setTopPriorities((prev) => {
      if (prev.includes(option)) {
        if (step9Error) setStep9Error('');
        return prev.filter((i) => i !== option);
      }
      if (prev.length >= 3) {
        setStep9Error('You can select up to 3 top priority areas.');
        return prev;
      }
      if (step9Error) setStep9Error('');
      return [...prev, option];
    });
  };

  const togglePastHelpedSupport = (option: string) => {
    setPastHelpedSupports((prev) => {
      if (option === 'Not sure') {
        return prev.includes('Not sure') ? [] : ['Not sure'];
      }
      const filtered = prev.filter((i) => i !== 'Not sure');
      return filtered.includes(option) ? filtered.filter((i) => i !== option) : [...filtered, option];
    });
    if (step9Error) setStep9Error('');
  };

  const toggleProfessionalSupport = (option: string) => {
    setProfessionalSupports((prev) => {
      if (option === 'No current professional support') {
        return prev.includes('No current professional support') ? [] : ['No current professional support'];
      }
      if (option === 'Prefer not to say') {
        return prev.includes('Prefer not to say') ? [] : ['Prefer not to say'];
      }
      const filtered = prev.filter(
        (i) => i !== 'No current professional support' && i !== 'Prefer not to say'
      );
      return filtered.includes(option) ? filtered.filter((i) => i !== option) : [...filtered, option];
    });
    if (step9Error) setStep9Error('');
  };

  const handleStep9Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mainConcerns.length === 0) {
      setStep9Error('Please select at least one main concern area above.');
      return;
    }
    if (mainConcerns.includes('Other') && !mainConcernsOther.trim()) {
      setStep9Error('Please specify the other main concern area.');
      return;
    }
    if (pastHelpedSupports.includes('Other') && !pastHelpedSupportsOther.trim()) {
      setStep9Error('Please specify the other support that has helped before.');
      return;
    }
    if (professionalSupports.includes('Other') && !professionalSupportsOther.trim()) {
      setStep9Error('Please specify the other professional support.');
      return;
    }

    setStep9Error('');

    const validTopPriorities = topPriorities.filter((p) => mainConcerns.includes(p));

    const goalsProfile = {
      mainConcerns,
      mainConcernsOther: mainConcerns.includes('Other') ? mainConcernsOther.trim() : undefined,
      topPriorities: validTopPriorities,
      mainGoal: familyGoal.trim() || undefined,
      familyGoal: familyGoal.trim() || undefined,
      childStrengths: childStrengthsText.trim() || undefined,
      childStrengthsText: childStrengthsText.trim() || undefined,
      previouslyHelpfulSupports: pastHelpedSupports,
      pastHelpedSupports,
      pastHelpedSupportsOther: pastHelpedSupports.includes('Other') ? pastHelpedSupportsOther.trim() : undefined,
      professionalSupport: professionalSupports,
      professionalSupports,
      professionalSupportsOther: professionalSupports.includes('Other') ? professionalSupportsOther.trim() : undefined,
      professionalSupportNotes: professionalSupportNotes.trim() || additionalNotes.trim() || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
    };

    const step9Data: Step9ConcernsData = {
      ...goalsProfile,
      goalsProfile,
    };

    try {
      localStorage.setItem('lingua_parent_step9_data', JSON.stringify(step9Data));
    } catch (err) {
      console.error('Failed to save step 9 data:', err);
    }

    if (onSaved) onSaved();

    if (onContinue) {
      onContinue({
        step1: getStep1Data(),
        step2: getStep2Data(),
        step3: getStep3Data(),
        step4: getStep4Data(),
        step5: getStep5Data(),
        step6: getStep6Data(),
        step7: getStep7Data(),
        step8: getStep8Data(),
        step9: step9Data,
      });
    }

    setCurrentStep(10);
  };

  // Dynamic Age-Appropriate Helper Text
  const getAgeGroupHelperText = () => {
    const numericAge = typeof age === 'number' ? age : 8;
    if (numericAge < 7) {
      return 'For example: objects, actions, colours, people, animals, and simple everyday words.';
    } else if (numericAge <= 12) {
      return 'For example: story vocabulary, descriptions, categories, and school words.';
    } else {
      return 'For example: academic vocabulary, subject-specific terminology, everyday explanations, and precise word choice.';
    }
  };

  // --- STEP 1 HANDLERS ---
  const isStep1Valid =
    age !== '' && age >= 3 && age <= 25 && educationLevel !== '' && learningStyle !== '';

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid) return;

    const step1Data: Step1ChildProfileData = {
      preferredName: preferredName.trim(),
      age: Number(age),
      educationLevel,
      learningStyle,
    };

    try {
      localStorage.setItem('lingua_parent_step1_data', JSON.stringify(step1Data));
    } catch (err) {
      console.error('Failed to save step 1 data:', err);
    }

    setIsStep1Saved(true);
    setCurrentStep(2);
    if (onSaved) onSaved();
  };

  // --- STEP 2 HANDLERS ---
  const validateStep2 = (): boolean => {
    if (!homeLanguage) {
      setStep2Error('Please select the language your child uses most at home.');
      return false;
    }
    if (homeLanguage === 'Other' && !homeLanguageOther.trim()) {
      setStep2Error('Please specify the home language in the text field.');
      return false;
    }
    if (!schoolLanguage) {
      setStep2Error('Please select the language your child uses mainly at school.');
      return false;
    }
    if (schoolLanguage === 'Other' && !schoolLanguageOther.trim()) {
      setStep2Error('Please specify the school language in the text field.');
      return false;
    }
    if (!isMultilingual) {
      setStep2Error('Please select if your child regularly hears or uses more than one language.');
      return false;
    }
    if (!comfortableLanguage) {
      setStep2Error('Please select which language your child understands most comfortably.');
      return false;
    }
    if (comfortableLanguage === 'Another language' && !comfortableLanguageOther.trim()) {
      setStep2Error('Please specify the comfortable language in the text field.');
      return false;
    }
    if (!preferredActivityLanguage) {
      setStep2Error('Please select your preferred language for Lingua AI activities.');
      return false;
    }

    setStep2Error('');
    return true;
  };

  const handleStep2SaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const step2Data: Step2LanguageBackgroundData = {
      homeLanguage,
      homeLanguageOther: homeLanguage === 'Other' ? homeLanguageOther.trim() : undefined,
      schoolLanguage,
      schoolLanguageOther: schoolLanguage === 'Other' ? schoolLanguageOther.trim() : undefined,
      isMultilingual,
      comfortableLanguage,
      comfortableLanguageOther:
        comfortableLanguage === 'Another language' ? comfortableLanguageOther.trim() : undefined,
      preferredActivityLanguage,
    };

    try {
      localStorage.setItem('lingua_parent_step2_data', JSON.stringify(step2Data));
    } catch (err) {
      console.error('Failed to save step 2 data:', err);
    }

    setIsStep2Saved(true);
    setCurrentStep(3);
    if (onSaved) onSaved();
  };

  // --- STEP 3 HANDLERS ---
  const toggleStrengthOption = (option: string) => {
    setCommunicationStrengths((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
    if (step3Error) setStep3Error('');
  };

  const validateStep3 = (): boolean => {
    if (!expressingNeeds) {
      setStep3Error('Please answer Question 1 (expressing wants or needs).');
      return false;
    }
    if (!findingWords) {
      setStep3Error('Please answer Question 2 (finding the right words).');
      return false;
    }
    if (!formingSentences) {
      setStep3Error('Please answer Question 3 (forming complete sentences).');
      return false;
    }
    if (!storytelling) {
      setStep3Error('Please answer Question 4 (explaining what happened or telling stories).');
      return false;
    }
    if (!explainingIdeas) {
      setStep3Error('Please answer Question 5 (explaining ideas or describing things).');
      return false;
    }
    if (!speakingAvoidance) {
      setStep3Error('Please answer Question 6 (avoiding speaking).');
      return false;
    }
    if (communicationStrengths.includes('Other') && !communicationStrengthsOther.trim()) {
      setStep3Error('Please specify the other communication strength in the text field.');
      return false;
    }

    setStep3Error('');
    return true;
  };

  const handleStep3SaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const step3Data: Step3CommunicationData = {
      expressingNeeds,
      findingWords,
      formingSentences,
      storytelling,
      explainingIdeas,
      speakingAvoidance,
      communicationStrengths,
      communicationStrengthsOther: communicationStrengths.includes('Other')
        ? communicationStrengthsOther.trim()
        : undefined,
      parentCommunicationNotes: parentCommunicationNotes.trim() || undefined,
    };

    try {
      localStorage.setItem('lingua_parent_step3_data', JSON.stringify(step3Data));
    } catch (err) {
      console.error('Failed to save step 3 data:', err);
    }

    setIsStep3Saved(true);
    setCurrentStep(4);
    if (onSaved) onSaved();
  };

  // --- STEP 4 HANDLERS ---
  const toggleUnderstandingStrengthOption = (option: string) => {
    setUnderstandingStrengths((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
    if (step4Error) setStep4Error('');
  };

  const validateStep4 = (): boolean => {
    if (!simpleInstructions) {
      setStep4Error('Please answer Question 1 (understanding simple instructions).');
      return false;
    }
    if (!multiStepInstructions) {
      setStep4Error('Please answer Question 2 (following multi-step instructions).');
      return false;
    }
    if (!repetitionNeeded) {
      setStep4Error('Please answer Question 3 (repetition needed).');
      return false;
    }
    if (!conversationUnderstanding) {
      setStep4Error('Please answer Question 4 (understanding questions during conversations).');
      return false;
    }
    if (!longerExplanations) {
      setStep4Error('Please answer Question 5 (longer explanations).');
      return false;
    }
    if (!impliedMeaning) {
      setStep4Error('Please answer Question 6 (understanding indirect meanings).');
      return false;
    }
    if (!backgroundNoise) {
      setStep4Error('Please answer the listening environment question (background noise).');
      return false;
    }
    if (understandingStrengths.includes('Other') && !understandingStrengthsOther.trim()) {
      setStep4Error('Please specify the other understanding strength in the text field.');
      return false;
    }

    setStep4Error('');
    return true;
  };

  const handleStep4SaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;

    const step4Data: Step4ListeningData = {
      simpleInstructions,
      multiStepInstructions,
      repetitionNeeded,
      conversationUnderstanding,
      longerExplanations,
      impliedMeaning,
      backgroundNoise,
      understandingStrengths,
      understandingStrengthsOther: understandingStrengths.includes('Other')
        ? understandingStrengthsOther.trim()
        : undefined,
      parentListeningNotes: parentListeningNotes.trim() || undefined,
    };

    try {
      localStorage.setItem('lingua_parent_step4_data', JSON.stringify(step4Data));
    } catch (err) {
      console.error('Failed to save step 4 data:', err);
    }

    setIsStep4Saved(true);
    setCurrentStep(5);
    if (onSaved) onSaved();
  };

  // --- STEP 5 HANDLERS ---
  const toggleDifficultActivity = (option: string) => {
    setDifficultWordActivities((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
    if (step5Error) setStep5Error('');
  };

  const toggleVocabularyPriority = (option: string) => {
    setVocabularyPriorities((prev) => {
      if (prev.includes(option)) {
        if (step5Error) setStep5Error('');
        return prev.filter((item) => item !== option);
      }
      if (prev.length >= 3) {
        setStep5Error('You can select up to 3 vocabulary priority areas.');
        return prev;
      }
      if (step5Error) setStep5Error('');
      return [...prev, option];
    });
  };

  const toggleVocabularyStrength = (option: string) => {
    setVocabularyStrengths((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
    if (step5Error) setStep5Error('');
  };

  const validateStep5 = (): boolean => {
    if (!newWordLearning) {
      setStep5Error('Please answer Question 1 (learning meaning of a new word).');
      return false;
    }
    if (!wordRetention) {
      setStep5Error('Please answer Question 2 (remembering a new word).');
      return false;
    }
    if (!wordMeaning) {
      setStep5Error('Please answer Question 3 (explaining what a familiar word means).');
      return false;
    }
    if (!wordFinding) {
      setStep5Error('Please answer Question 4 (finding the right word when speaking).');
      return false;
    }
    if (!sentenceUse) {
      setStep5Error('Please answer Question 5 (using a newly learned word in a sentence).');
      return false;
    }
    if (vocabularyPriorities.includes('Other') && !vocabularyPrioritiesOther.trim()) {
      setStep5Error('Please specify the other vocabulary priority in the text field.');
      return false;
    }
    if (vocabularyStrengths.includes('Other') && !vocabularyStrengthsOther.trim()) {
      setStep5Error('Please specify the other vocabulary strength in the text field.');
      return false;
    }

    setStep5Error('');
    return true;
  };

  const handleStep5SaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep5()) return;

    const step5Data: Step5VocabularyData = {
      newWordLearning,
      wordRetention,
      wordMeaning,
      wordFinding,
      sentenceUse,
      difficultWordActivities,
      vocabularyPriorities,
      vocabularyPrioritiesOther: vocabularyPriorities.includes('Other')
        ? vocabularyPrioritiesOther.trim()
        : undefined,
      parentVocabularyNotes: parentVocabularyNotes.trim() || undefined,
      vocabularyStrengths,
      vocabularyStrengthsOther: vocabularyStrengths.includes('Other')
        ? vocabularyStrengthsOther.trim()
        : undefined,
    };

    try {
      localStorage.setItem('lingua_parent_step5_data', JSON.stringify(step5Data));
    } catch (err) {
      console.error('Failed to save step 5 data:', err);
    }

    setIsStep5Saved(true);
    setCurrentStep(6);

    if (onSaved) onSaved();
    if (onContinue) {
      const step1Data: Step1ChildProfileData = {
        preferredName: preferredName.trim(),
        age: Number(age),
        educationLevel,
        learningStyle,
      };
      const step2Data: Step2LanguageBackgroundData = {
        homeLanguage,
        homeLanguageOther: homeLanguage === 'Other' ? homeLanguageOther.trim() : undefined,
        schoolLanguage,
        schoolLanguageOther: schoolLanguage === 'Other' ? schoolLanguageOther.trim() : undefined,
        isMultilingual,
        comfortableLanguage,
        comfortableLanguageOther:
          comfortableLanguage === 'Another language' ? comfortableLanguageOther.trim() : undefined,
        preferredActivityLanguage,
      };
      const step3Data: Step3CommunicationData = {
        expressingNeeds,
        findingWords,
        formingSentences,
        storytelling,
        explainingIdeas,
        speakingAvoidance,
        communicationStrengths,
        communicationStrengthsOther: communicationStrengths.includes('Other')
          ? communicationStrengthsOther.trim()
          : undefined,
        parentCommunicationNotes: parentCommunicationNotes.trim() || undefined,
      };
      const step4Data: Step4ListeningData = {
        simpleInstructions,
        multiStepInstructions,
        repetitionNeeded,
        conversationUnderstanding,
        longerExplanations,
        impliedMeaning,
        backgroundNoise,
        understandingStrengths,
        understandingStrengthsOther: understandingStrengths.includes('Other')
          ? understandingStrengthsOther.trim()
          : undefined,
        parentListeningNotes: parentListeningNotes.trim() || undefined,
      };
      onContinue({
        step1: step1Data,
        step2: step2Data,
        step3: step3Data,
        step4: step4Data,
        step5: step5Data,
      });
    }
  };

  // --- STEP 6 HANDLERS ---
  const validateStep6 = (): boolean => {
    if (!readingComfort) {
      setStep6Error('Please answer Question 1 (reading comfort).');
      return false;
    }
    if (!familiarWordReading) {
      setStep6Error('Please answer Question 2 (familiar word recognition).');
      return false;
    }
    if (!unfamiliarWordReading) {
      setStep6Error('Please answer Question 3 (unfamiliar word reading).');
      return false;
    }
    if (!readingFrustration) {
      setStep6Error('Please answer Question 4 (reading frustration/avoidance).');
      return false;
    }
    if (!mainIdea) {
      setStep6Error('Please answer Question 5 (understanding main idea).');
      return false;
    }
    if (!comprehensionQuestions) {
      setStep6Error('Please answer Question 6 (answering comprehension questions).');
      return false;
    }
    if (!informationRecall) {
      setStep6Error('Please answer Question 7 (information recall).');
      return false;
    }
    if (!retelling) {
      setStep6Error('Please answer Question 8 (retelling in own words).');
      return false;
    }
    if (!sequencing) {
      setStep6Error('Please answer the event ordering item.');
      return false;
    }
    if (!causeAndEffect) {
      setStep6Error('Please answer the cause and effect item.');
      return false;
    }
    if (!inference) {
      setStep6Error('Please answer the suggested/implied information item.');
      return false;
    }
    if (!importantDetails) {
      setStep6Error('Please answer the important details item.');
      return false;
    }

    setStep6Error('');
    return true;
  };

  const handleStep6SaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep6()) return;

    const readingProfile = {
      readingComfort,
      familiarWordReading,
      unfamiliarWordReading,
      readingFrustration,
      mainIdea,
      comprehensionQuestions,
      informationRecall,
      retelling,
      sequencing,
      causeAndEffect,
      inference,
      importantDetails,
      difficultLearningSituations,
      readingStrengths,
      parentReadingNotes: parentReadingNotes.trim() || undefined,
    };

    const step6Data: Step6ReadingData = {
      ...readingProfile,
      readingLearningProfile: readingProfile,
    };

    try {
      localStorage.setItem('lingua_parent_step6_data', JSON.stringify(step6Data));
    } catch (err) {
      console.error('Failed to save step 6 data:', err);
    }

    if (onSaved) onSaved();

    if (onContinue) {
      const step1Data: Step1ChildProfileData = {
        preferredName: preferredName.trim(),
        age: Number(age),
        educationLevel,
        learningStyle,
      };
      const step2Data: Step2LanguageBackgroundData = {
        homeLanguage,
        homeLanguageOther: homeLanguage === 'Other' ? homeLanguageOther.trim() : undefined,
        schoolLanguage,
        schoolLanguageOther: schoolLanguage === 'Other' ? schoolLanguageOther.trim() : undefined,
        isMultilingual,
        comfortableLanguage,
        comfortableLanguageOther:
          comfortableLanguage === 'Another language' ? comfortableLanguageOther.trim() : undefined,
        preferredActivityLanguage,
      };
      const step3Data: Step3CommunicationData = {
        expressingNeeds,
        findingWords,
        formingSentences,
        storytelling,
        explainingIdeas,
        speakingAvoidance,
        communicationStrengths,
        communicationStrengthsOther: communicationStrengths.includes('Other')
          ? communicationStrengthsOther.trim()
          : undefined,
        parentCommunicationNotes: parentCommunicationNotes.trim() || undefined,
      };
      const step4Data: Step4ListeningData = {
        simpleInstructions,
        multiStepInstructions,
        repetitionNeeded,
        conversationUnderstanding,
        longerExplanations,
        impliedMeaning,
        backgroundNoise,
        understandingStrengths,
        understandingStrengthsOther: understandingStrengths.includes('Other')
          ? understandingStrengthsOther.trim()
          : undefined,
        parentListeningNotes: parentListeningNotes.trim() || undefined,
      };
      const step5Data: Step5VocabularyData = {
        newWordLearning,
        wordRetention,
        wordMeaning,
        wordFinding,
        sentenceUse,
        difficultWordActivities,
        vocabularyPriorities,
        vocabularyPrioritiesOther: vocabularyPriorities.includes('Other')
          ? vocabularyPrioritiesOther.trim()
          : undefined,
        parentVocabularyNotes: parentVocabularyNotes.trim() || undefined,
        vocabularyStrengths,
        vocabularyStrengthsOther: vocabularyStrengths.includes('Other')
          ? vocabularyStrengthsOther.trim()
          : undefined,
      };
      onContinue({
        step1: step1Data,
        step2: step2Data,
        step3: step3Data,
        step4: step4Data,
        step5: step5Data,
        step6: step6Data,
      });
    }

    setCurrentStep(7);
  };

  // --- STEP 7 HANDLERS ---
  const validateStep7 = (): boolean => {
    if (!step7ExplainingIdeas) {
      setStep7Error('Please answer Question 1 (explaining an idea).');
      return false;
    }
    if (!step7DescribingThings) {
      setStep7Error('Please answer Question 2 (describing a person, object, or place).');
      return false;
    }
    if (!step7ExplainingWhy) {
      setStep7Error('Please answer Question 3 (explaining why something happened).');
      return false;
    }
    if (!step7OpenEndedQuestions) {
      setStep7Error('Please answer Question 4 (answering open-ended questions).');
      return false;
    }
    if (!step7OrganizingThoughts) {
      setStep7Error('Please answer Question 5 (organizing thoughts before speaking).');
      return false;
    }
    if (!step7TellingEvents) {
      setStep7Error('Please answer Question 6 (telling what happened in a story or event).');
      return false;
    }
    if (!step7LogicalOrder) {
      setStep7Error('Please answer Question 7 (telling events in a logical order).');
      return false;
    }
    if (!step7ImportantStoryDetails) {
      setStep7Error('Please answer Question 8 (including important story details).');
      return false;
    }
    if (!step7FirstNextLast) {
      setStep7Error('Please answer Question 9 (explaining first, next, and last).');
      return false;
    }
    if (difficultEverydaySituations.includes('Other') && !difficultEverydaySituationsOther.trim()) {
      setStep7Error('Please specify the other difficult situation in the text field.');
      return false;
    }
    if (expressionStrengths.includes('Other') && !expressionStrengthsOther.trim()) {
      setStep7Error('Please specify the other expression strength in the text field.');
      return false;
    }

    setStep7Error('');
    return true;
  };

  const handleStep7SaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep7()) return;

    const expressionProfile = {
      explainingIdeas: step7ExplainingIdeas,
      describingThings: step7DescribingThings,
      explainingWhy: step7ExplainingWhy,
      openEndedQuestions: step7OpenEndedQuestions,
      organizingThoughts: step7OrganizingThoughts,
      tellingEvents: step7TellingEvents,
      logicalOrder: step7LogicalOrder,
      importantStoryDetails: step7ImportantStoryDetails,
      firstNextLast: step7FirstNextLast,
      difficultEverydaySituations,
      expressionStrengths,
      parentExpressionNotes: parentExpressionNotes.trim() || undefined,
    };

    const step7Data: Step7ExpressionData = {
      ...expressionProfile,
      difficultEverydaySituationsOther: difficultEverydaySituations.includes('Other')
        ? difficultEverydaySituationsOther.trim()
        : undefined,
      expressionStrengthsOther: expressionStrengths.includes('Other')
        ? expressionStrengthsOther.trim()
        : undefined,
      expressionProfile,
    };

    try {
      localStorage.setItem('lingua_parent_step7_data', JSON.stringify(step7Data));
    } catch (err) {
      console.error('Failed to save step 7 data:', err);
    }

    if (onSaved) onSaved();

    if (onContinue) {
      const step1Data: Step1ChildProfileData = {
        preferredName: preferredName.trim(),
        age: Number(age),
        educationLevel,
        learningStyle,
      };
      const step2Data: Step2LanguageBackgroundData = {
        homeLanguage,
        homeLanguageOther: homeLanguage === 'Other' ? homeLanguageOther.trim() : undefined,
        schoolLanguage,
        schoolLanguageOther: schoolLanguage === 'Other' ? schoolLanguageOther.trim() : undefined,
        isMultilingual,
        comfortableLanguage,
        comfortableLanguageOther:
          comfortableLanguage === 'Another language' ? comfortableLanguageOther.trim() : undefined,
        preferredActivityLanguage,
      };
      const step3Data: Step3CommunicationData = {
        expressingNeeds,
        findingWords,
        formingSentences,
        storytelling,
        explainingIdeas,
        speakingAvoidance,
        communicationStrengths,
        communicationStrengthsOther: communicationStrengths.includes('Other')
          ? communicationStrengthsOther.trim()
          : undefined,
        parentCommunicationNotes: parentCommunicationNotes.trim() || undefined,
      };
      const step4Data: Step4ListeningData = {
        simpleInstructions,
        multiStepInstructions,
        repetitionNeeded,
        conversationUnderstanding,
        longerExplanations,
        impliedMeaning,
        backgroundNoise,
        understandingStrengths,
        understandingStrengthsOther: understandingStrengths.includes('Other')
          ? understandingStrengthsOther.trim()
          : undefined,
        parentListeningNotes: parentListeningNotes.trim() || undefined,
      };
      const step5Data: Step5VocabularyData = {
        newWordLearning,
        wordRetention,
        wordMeaning,
        wordFinding,
        sentenceUse,
        difficultWordActivities,
        vocabularyPriorities,
        vocabularyPrioritiesOther: vocabularyPriorities.includes('Other')
          ? vocabularyPrioritiesOther.trim()
          : undefined,
        parentVocabularyNotes: parentVocabularyNotes.trim() || undefined,
        vocabularyStrengths,
        vocabularyStrengthsOther: vocabularyStrengths.includes('Other')
          ? vocabularyStrengthsOther.trim()
          : undefined,
      };
      const step6Data: Step6ReadingData = {
        readingComfort,
        familiarWordReading,
        unfamiliarWordReading,
        readingFrustration,
        mainIdea,
        comprehensionQuestions,
        informationRecall,
        retelling,
        sequencing,
        causeAndEffect,
        inference,
        importantDetails,
        difficultLearningSituations,
        readingStrengths,
        parentReadingNotes: parentReadingNotes.trim() || undefined,
        readingLearningProfile: {
          readingComfort,
          familiarWordReading,
          unfamiliarWordReading,
          readingFrustration,
          mainIdea,
          comprehensionQuestions,
          informationRecall,
          retelling,
          sequencing,
          causeAndEffect,
          inference,
          importantDetails,
          difficultLearningSituations,
          readingStrengths,
          parentReadingNotes: parentReadingNotes.trim() || undefined,
        },
      };

      onContinue({
        step1: step1Data,
        step2: step2Data,
        step3: step3Data,
        step4: step4Data,
        step5: step5Data,
        step6: step6Data,
        step7: step7Data,
      });
    }

    setCurrentStep(8);
  };

  // Dynamic personalized recommendation cards based strictly on actual parent assessment choices
  const getPersonalizedRecommendations = () => {
    const activeConcerns = new Set<string>([
      ...mainConcerns,
      ...topPriorities,
    ]);

    interface RecCard {
      id: string;
      title: string;
      icon: any;
      badge: string;
      whySuggested: string;
      professionalToConsider: string;
      audiologistNote?: string;
      homePractice: string[];
      linguaActivities: { name: string; page: NavPage }[];
      primaryPage: NavPage;
    }

    const cards: RecCard[] = [];

    // 1. Speech & Language Support
    const hasSpeechConcern =
      activeConcerns.has('Speaking and expressing ideas') ||
      activeConcerns.has('Storytelling') ||
      activeConcerns.has('Academic or school language') ||
      activeConcerns.has('Everyday communication') ||
      activeConcerns.has('Confidence when communicating') ||
      (mainConcernsOther && /speech|speak|sentence|talk|express/i.test(mainConcernsOther));

    if (hasSpeechConcern) {
      cards.push({
        id: 'speech-language',
        title: 'Speech & Language Support',
        icon: Mic,
        badge: 'Communication Focus',
        whySuggested:
          'Because communication and expressive-language skills are an important concern in your responses, you may want to discuss these observations with a qualified speech-language professional.',
        professionalToConsider:
          'Speech-Language Therapist / Speech-Language Pathologist',
        homePractice: [
          'Give 5 seconds of wait time before expecting an answer to reduce speaking pressure.',
          'Encourage storytelling by asking open-ended questions about daily events.',
          'Model complete sentences gently rather than directly correcting speech mistakes.',
        ],
        linguaActivities: [
          { name: 'Speech & Expression Coach', page: 'read-listen' },
          { name: 'Sentence Builder & Story Sequence', page: 'language-tools' },
        ],
        primaryPage: 'read-listen',
      });
    }

    // 2. Vocabulary & Language Support
    const hasVocabConcern =
      activeConcerns.has('Vocabulary and word learning') ||
      vocabularyPriorities.length > 0 ||
      (mainConcernsOther && /vocab|word/i.test(mainConcernsOther));

    if (hasVocabConcern) {
      cards.push({
        id: 'vocabulary',
        title: 'Vocabulary & Language Support',
        icon: BookMarked,
        badge: 'Word Learning Focus',
        whySuggested:
          'Your responses show that vocabulary and word learning are an area you would like to practice.',
        professionalToConsider:
          'Speech-Language Therapist / Speech-Language Pathologist',
        homePractice: [
          'Learn a small number of useful, high-frequency words at a time.',
          'Use each new word together in daily conversation and sentences.',
          'Describe objects using new vocabulary and revisit previously learned words regularly.',
          'Connect words with pictures, actions, and real-life situations.',
        ],
        linguaActivities: [
          { name: 'Visual Vocabulary Bank', page: 'language-tools' },
          { name: 'Interactive Word Match', page: 'read-listen' },
        ],
        primaryPage: 'language-tools',
      });
    }

    // 3. Listening & Understanding Support
    const hasListeningConcern =
      activeConcerns.has('Listening and understanding') ||
      simpleInstructions === 'Needs help' ||
      multiStepInstructions === 'Needs help' ||
      backgroundNoise === 'Struggles in noise' ||
      (mainConcernsOther && /listen|hear|understand/i.test(mainConcernsOther));

    if (hasListeningConcern) {
      const mentionsHearingOrNoise = backgroundNoise === 'Struggles in noise' || repetitionNeeded === 'Very often';
      cards.push({
        id: 'listening-understanding',
        title: 'Listening & Understanding Support',
        icon: Ear,
        badge: 'Auditory Focus',
        whySuggested:
          'Your responses indicate that listening and understanding spoken information is an area you would like to support.',
        professionalToConsider:
          'Speech-Language Therapist / Speech-Language Pathologist',
        audiologistNote: mentionsHearingOrNoise
          ? 'If you notice consistent difficulty hearing speech or frequent requests for repetition across different environments, consider discussing hearing concerns with an Audiologist.'
          : undefined,
        homePractice: [
          'Give one instruction at a time before adding secondary steps.',
          'Gradually practice two-step instructions once single steps are comfortable.',
          'Ask your child to explain what they understood in their own words.',
          'Reduce unnecessary background noise (TV, radio) during important directions.',
          'Use visual support when helpful.',
        ],
        linguaActivities: [
          { name: 'Sound Match & Auditory Recall', page: 'neuroplay' },
          { name: 'Read & Listen Read-Aloud', page: 'read-listen' },
        ],
        primaryPage: 'neuroplay',
      });
    }

    // 4. Reading & Comprehension Support
    const hasReadingConcern =
      activeConcerns.has('Reading') ||
      activeConcerns.has('Reading comprehension') ||
      readingComfort === 'Struggles' ||
      (mainConcernsOther && /read|comprehend/i.test(mainConcernsOther));

    if (hasReadingConcern) {
      cards.push({
        id: 'reading-comprehension',
        title: 'Reading & Comprehension Support',
        icon: BookOpen,
        badge: 'Literacy Focus',
        whySuggested:
          'Your responses suggest that reading or understanding written information is an area your family would like to support.',
        professionalToConsider:
          'Teacher or special educator, Speech-Language Therapist / Speech-Language Pathologist, or appropriate literacy professional',
        homePractice: [
          'Read short passages together using line-by-line Bionic text highlighting.',
          'Ask your child to explain the main idea of a short story paragraph.',
          'Ask what happened first, next, and last during reading.',
          'Discuss unfamiliar words before reading a new page.',
          'Connect stories to pictures and real experiences.',
        ],
        linguaActivities: [
          { name: 'Read & Listen Bionic Reader', page: 'read-listen' },
          { name: 'Comprehension Assistant & Book Scanner', page: 'book-scanner' },
        ],
        primaryPage: 'read-listen',
      });
    }

    // 5. Social Communication Practice
    const hasSocialConcern =
      activeConcerns.has('Social communication') ||
      activeConcerns.has('Confidence when communicating') ||
      (mainConcernsOther && /social|friend|peer/i.test(mainConcernsOther));

    if (hasSocialConcern) {
      cards.push({
        id: 'social-communication',
        title: 'Social Communication Practice',
        icon: Heart,
        badge: 'Social Practice',
        whySuggested:
          'Social communication and conversational confidence were highlighted as key focus areas in your responses.',
        professionalToConsider:
          'Speech-Language Therapist / Speech-Language Pathologist or another appropriately qualified professional',
        homePractice: [
          'Practice everyday greetings and asking for help in low-stakes family settings.',
          'Practice taking turns in conversations during family meals or games.',
          'Practice explaining feelings and describing simple real-life scenarios.',
          'Help identify and name emotional cues in storybook characters.',
        ],
        linguaActivities: [
          { name: 'Social Scene Scenarios', page: 'neuroplay' },
        ],
        primaryPage: 'neuroplay',
      });
    }

    // 6. Following Instructions
    const hasInstructionConcern =
      activeConcerns.has('Following instructions') ||
      (mainConcernsOther && /instruction|direction|follow/i.test(mainConcernsOther));

    if (hasInstructionConcern) {
      cards.push({
        id: 'following-instructions',
        title: 'Following Instructions',
        icon: CheckCircle2,
        badge: 'Task Practice',
        whySuggested:
          'Organizing multi-step tasks and following instructions was highlighted in your assessment answers.',
        professionalToConsider:
          'Speech-Language Therapist / Speech-Language Pathologist or teacher / special educator',
        homePractice: [
          'Start with one short, concrete instruction before moving to the next.',
          'Gradually introduce two-step instructions once single steps are comfortable.',
          'Ask your child to repeat the instruction in their own words.',
          'Use visual cues when helpful.',
        ],
        linguaActivities: [
          { name: 'Instruction Mission', page: 'neuroplay' },
        ],
        primaryPage: 'neuroplay',
      });
    }

    return cards;
  };

  const getHomeSupportSuggestions = () => {
    const numericAge = typeof age === 'number' ? age : 8;
    const suggestions = [];

    if (mainConcerns.includes('Speaking and expressing ideas') || mainConcerns.includes('Storytelling')) {
      suggestions.push({
        title: '5-Second Wait-Time Rule',
        instruction: `When asking ${preferredName.trim() || 'your child'} a question, count quietly to 5 before jumping in to give extra thinking time.`,
        duration: 'Daily conversation',
      });
    }

    if (mainConcerns.includes('Vocabulary and word learning') || topPriorities.includes('Vocabulary and word learning')) {
      suggestions.push({
        title: 'One New Word Routine',
        instruction: `Pick 1 new interesting word from a storybook or daily walk. Connect it to a real object, and use it twice during dinner.`,
        duration: '5–10 minutes daily',
      });
    }

    if (mainConcerns.includes('Listening and understanding') || mainConcerns.includes('Following instructions')) {
      suggestions.push({
        title: 'Step-by-Step Repeat Back',
        instruction: `Give one short instruction, ask ${preferredName.trim() || 'your child'} to repeat what they heard, then celebrate completion before giving step two.`,
        duration: '5 minutes during routines',
      });
    }

    if (mainConcerns.includes('Reading') || mainConcerns.includes('Reading comprehension')) {
      suggestions.push({
        title: 'Picture & Story Prediction',
        instruction: numericAge < 7
          ? `Point to 3 pictures on a book page and ask 'What do you think will happen next?' before reading.`
          : `Read 1 paragraph together, pause, and ask ${preferredName.trim() || 'your child'} to explain the main idea in 1 sentence.`,
        duration: '10 minutes daily reading',
      });
    }

    if (suggestions.length < 3) {
      suggestions.push({
        title: 'Visual Daily Checklist',
        instruction: `Create a simple 3-item picture checklist for morning or evening routines to build independent focus.`,
        duration: 'Daily routine',
      });
    }

    return suggestions.slice(0, 5);
  };

  return (
    <div className="mx-auto max-w-3xl p-6 sm:p-8 rounded-3xl border app-border app-bg-surface shadow-sm space-y-8 animate-fade-in">
      {/* Top Header & Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 border-b app-border pb-3">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
            <Sparkles className="w-4 h-4 text-[#7C4DBA]" />
            <span>Parent & Caregiver Assessment</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#7C4DBA]/10 text-[#7C4DBA] border border-[#7C4DBA]/20 font-mono">
            Step {currentStep} of 10
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-[#7C4DBA] transition-all duration-500 rounded-full"
            style={{ width: `${currentStep * 10}%` }}
          />
        </div>
      </div>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary tracking-tight">
              Tell Us About Your Child
            </h1>
            <p className="text-xs sm:text-sm app-text-secondary leading-relaxed max-w-2xl">
              Answer a few simple questions so Lingua AI can personalize learning activities and support for your child.
            </p>
          </div>

          {isStep1Saved && currentStep === 1 ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                    Step 1 Details Saved
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Preferred Name: {preferredName.trim() || 'Not specified'} · Age: {age} · Level: {educationLevel} · Style: {learningStyle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStep1Saved(false)}
                  className="px-4 py-2 rounded-xl border border-emerald-600/30 text-emerald-900 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-500/10 cursor-pointer"
                >
                  Edit Step 1 Details
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2 rounded-xl bg-[#7C4DBA] text-white text-xs font-bold hover:bg-[#6B3CA8] cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Proceed to Step 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleStep1Submit} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider app-text-primary flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#7C4DBA]" />
                  <span>1. Child's preferred name</span>
                  <span className="text-[10px] font-normal app-text-muted lowercase ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="First name or preferred nickname"
                  className="w-full px-4 py-3 rounded-2xl border app-border app-bg-surface-secondary text-sm app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider app-text-primary flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#7C4DBA]" />
                  <span>2. Child's age</span>
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-[10px] font-normal app-text-muted ml-1">(ages 3–25)</span>
                </label>
                <div className="relative max-w-xs">
                  <select
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-4 py-3 rounded-2xl border app-border app-bg-surface-secondary text-sm font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 appearance-none cursor-pointer pr-10"
                  >
                    <option value="" disabled>Select age (3 to 25)</option>
                    {Array.from({ length: 23 }, (_, i) => i + 3).map((a) => (
                      <option key={a} value={a}>
                        {a} years old
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider app-text-primary flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#7C4DBA]" />
                  <span>3. Education level</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EDUCATION_LEVELS.map((level) => {
                    const isSelected = educationLevel === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setEducationLevel(level)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface-secondary border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        <span>{level}</span>
                        {isSelected && <Check className="w-4 h-4 shrink-0 ml-1 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider app-text-primary flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#7C4DBA]" />
                  <span>4. Preferred learning style</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LEARNING_STYLES.map((style) => {
                    const IconComp = style.icon;
                    const isSelected = learningStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setLearningStyle(style.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] ring-2 ring-[#7C4DBA] app-text-primary'
                            : 'app-bg-surface-secondary border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-xl ${
                                isSelected
                                  ? 'bg-[#7C4DBA] text-white'
                                  : 'bg-black/5 dark:bg-white/10 text-[#7C4DBA]'
                              }`}
                            >
                              <IconComp className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-extrabold">{style.label}</span>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] app-text-secondary leading-relaxed pl-1">
                          {style.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t app-border">
                <div className="text-xs app-text-muted">
                  Step 1 captures core learning preferences to customize activities.
                </div>

                <button
                  type="submit"
                  disabled={!isStep1Valid}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isStep1Valid
                      ? 'bg-[#7C4DBA] hover:bg-[#6B3CA8] text-white hover:scale-[1.02] active:scale-95'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary tracking-tight">
              Your Child's Language Background
            </h1>
            <p className="text-xs sm:text-sm app-text-secondary leading-relaxed max-w-2xl">
              Understanding the languages your child hears and uses helps Lingua AI personalize activities and communication support.
            </p>
          </div>

          {step2Error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{step2Error}</span>
            </div>
          )}

          <form onSubmit={handleStep2SaveAndContinue} className="space-y-8">
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA] border-b app-border pb-2">
                <Globe className="w-4 h-4" />
                <span>Primary Environments</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider app-text-primary">
                  1. What language does your child use most at home?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="relative max-w-sm">
                  <select
                    value={homeLanguage}
                    onChange={(e) => {
                      setHomeLanguage(e.target.value);
                      if (step2Error) setStep2Error('');
                    }}
                    className="w-full px-4 py-3 rounded-2xl border app-border app-bg-surface text-sm font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 appearance-none cursor-pointer pr-10"
                  >
                    {COMMON_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>

                {homeLanguage === 'Other' && (
                  <div className="pt-1 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={homeLanguageOther}
                      onChange={(e) => setHomeLanguageOther(e.target.value)}
                      placeholder="Specify home language"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t app-border">
                <label className="block text-xs font-extrabold uppercase tracking-wider app-text-primary">
                  2. What language does your child mainly use at school or college?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="relative max-w-sm">
                  <select
                    value={schoolLanguage}
                    onChange={(e) => {
                      setSchoolLanguage(e.target.value);
                      if (step2Error) setStep2Error('');
                    }}
                    className="w-full px-4 py-3 rounded-2xl border app-border app-bg-surface text-sm font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 appearance-none cursor-pointer pr-10"
                  >
                    {COMMON_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>

                {schoolLanguage === 'Other' && (
                  <div className="pt-1 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={schoolLanguageOther}
                      onChange={(e) => setSchoolLanguageOther(e.target.value)}
                      placeholder="Specify school language"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA] border-b app-border pb-2">
                <Languages className="w-4 h-4" />
                <span>Language Exposure & Comfort</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider app-text-primary">
                  3. Does your child regularly hear or use more than one language?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>

                <div className="flex flex-wrap gap-2.5">
                  {MULTILINGUAL_OPTIONS.map((opt) => {
                    const isSelected = isMultilingual === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setIsMultilingual(opt);
                          if (step2Error) setStep2Error('');
                        }}
                        className={`px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t app-border">
                <label className="block text-xs font-extrabold uppercase tracking-wider app-text-primary">
                  4. Which language does your child understand most comfortably?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {COMFORTABLE_LANG_OPTIONS.map((opt) => {
                    const isSelected = comfortableLanguage === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setComfortableLanguage(opt);
                          if (step2Error) setStep2Error('');
                        }}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] ring-2 ring-[#7C4DBA] app-text-primary'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {comfortableLanguage === 'Another language' && (
                  <div className="pt-1 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={comfortableLanguageOther}
                      onChange={(e) => setComfortableLanguageOther(e.target.value)}
                      placeholder="Specify language"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Heart className="w-4 h-4 text-[#7C4DBA]" />
                <span>Lingua AI Activity Preference</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider app-text-primary">
                  5. Which language would you like Lingua AI to use for your child's personalized activities?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>

                <div className="relative max-w-sm">
                  <select
                    value={preferredActivityLanguage}
                    onChange={(e) => {
                      setPreferredActivityLanguage(e.target.value);
                      if (step2Error) setStep2Error('');
                    }}
                    className="w-full px-4 py-3 rounded-2xl border app-border app-bg-surface text-sm font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 appearance-none cursor-pointer pr-10"
                  >
                    {COMMON_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t app-border">
              <button
                type="button"
                onClick={() => {
                  setStep2Error('');
                  setCurrentStep(1);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border app-border app-bg-surface text-xs font-extrabold app-text-primary hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7C4DBA] hover:bg-[#6B3CA8] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary tracking-tight">
              Communication & Speaking
            </h1>
            <p className="text-xs sm:text-sm app-text-secondary leading-relaxed max-w-2xl">
              Tell us about how your child communicates in everyday situations. There are no right or wrong answers.
            </p>
          </div>

          {step3Error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{step3Error}</span>
            </div>
          )}

          <form onSubmit={handleStep3SaveAndContinue} className="space-y-8">
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA] border-b app-border pb-2">
                <MessageSquare className="w-4 h-4" />
                <span>Expressive Communication & Vocabulary</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  1. How easily does your child express what they want or need?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = expressingNeeds === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setExpressingNeeds(opt);
                          if (step3Error) setStep3Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  2. How easily does your child find the right words when speaking?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = findingWords === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setFindingWords(opt);
                          if (step3Error) setStep3Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA] border-b app-border pb-2">
                <Mic className="w-4 h-4" />
                <span>Sentence Structure & Storytelling</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  3. How easily does your child form complete sentences?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = formingSentences === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setFormingSentences(opt);
                          if (step3Error) setStep3Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  4. How easily can your child explain what happened or tell a short story?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = storytelling === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setStorytelling(opt);
                          if (step3Error) setStep3Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  5. How easily can your child explain an idea or describe something?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = explainingIdeas === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setExplainingIdeas(opt);
                          if (step3Error) setStep3Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Heart className="w-4 h-4 text-[#7C4DBA]" />
                <span>Comfort & Willingness to Speak</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  6. Does your child sometimes avoid speaking because communicating feels difficult?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVOIDANCE_OPTIONS.map((opt) => {
                    const isSelected = speakingAvoidance === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSpeakingAvoidance(opt);
                          if (step3Error) setStep3Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Star className="w-4 h-4" />
                <span>Communication Strengths</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  What does your child communicate particularly well?
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {STRENGTHS_OPTIONS.map((opt) => {
                    const isChecked = communicationStrengths.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleStrengthOption(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-emerald-500/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {communicationStrengths.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={communicationStrengthsOther}
                      onChange={(e) => setCommunicationStrengthsOther(e.target.value)}
                      placeholder="Specify other communication strength"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-3">
              <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                Is there anything you would like us to know about your child's communication?
                <span className="text-[10px] font-normal app-text-muted lowercase ml-1.5">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={parentCommunicationNotes}
                onChange={(e) => setParentCommunicationNotes(e.target.value)}
                placeholder="For example, situations where speaking is easy or difficult, words they often struggle with, or things they communicate particularly well."
                className="w-full p-3.5 rounded-2xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 transition-all"
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t app-border">
              <button
                type="button"
                onClick={() => {
                  setStep3Error('');
                  setCurrentStep(2);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border app-border app-bg-surface text-xs font-extrabold app-text-primary hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7C4DBA] hover:bg-[#6B3CA8] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 4 */}
      {currentStep === 4 && (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary tracking-tight">
              Listening & Understanding
            </h1>
            <p className="text-xs sm:text-sm app-text-secondary leading-relaxed max-w-2xl">
              Tell us how your child understands spoken information, questions, and instructions in everyday situations.
            </p>
          </div>

          {step4Error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{step4Error}</span>
            </div>
          )}

          <form onSubmit={handleStep4SaveAndContinue} className="space-y-8">
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA] border-b app-border pb-2">
                <Ear className="w-4 h-4" />
                <span>Instructions & Spoken Directions</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  1. How easily does your child understand simple instructions?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = simpleInstructions === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSimpleInstructions(opt);
                          if (step4Error) setStep4Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  2. How easily does your child follow instructions with two or more steps?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = multiStepInstructions === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setMultiStepInstructions(opt);
                          if (step4Error) setStep4Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  3. Does your child usually need instructions or questions repeated?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {REPETITION_OPTIONS.map((opt) => {
                    const isSelected = repetitionNeeded === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setRepetitionNeeded(opt);
                          if (step4Error) setStep4Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA] border-b app-border pb-2">
                <Brain className="w-4 h-4" />
                <span>Conversations & Comprehension</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  4. How easily does your child understand questions during everyday conversations?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = conversationUnderstanding === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setConversationUnderstanding(opt);
                          if (step4Error) setStep4Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  5. How easily does your child understand longer spoken explanations or conversations?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = longerExplanations === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setLongerExplanations(opt);
                          if (step4Error) setStep4Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  6. Does your child find it difficult to understand what someone means when it is not said directly?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = impliedMeaning === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setImpliedMeaning(opt);
                          if (step4Error) setStep4Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <VolumeX className="w-4 h-4 text-[#7C4DBA]" />
                <span>Listening Environment</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  Does your child find listening harder when there is background noise?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {NOISE_OPTIONS.map((opt) => {
                    const isSelected = backgroundNoise === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setBackgroundNoise(opt);
                          if (step4Error) setStep4Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Star className="w-4 h-4" />
                <span>Understanding Strengths</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  What does your child understand particularly well?
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {UNDERSTANDING_STRENGTHS_OPTIONS.map((opt) => {
                    const isChecked = understandingStrengths.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleUnderstandingStrengthOption(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-emerald-500/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {understandingStrengths.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={understandingStrengthsOther}
                      onChange={(e) => setUnderstandingStrengthsOther(e.target.value)}
                      placeholder="Specify other understanding strength"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-3">
              <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                Anything else about your child's listening or understanding?
                <span className="text-[10px] font-normal app-text-muted lowercase ml-1.5">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={parentListeningNotes}
                onChange={(e) => setParentListeningNotes(e.target.value)}
                placeholder="For example, situations where your child understands very well, needs repetition, or finds conversations difficult."
                className="w-full p-3.5 rounded-2xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 transition-all"
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t app-border">
              <button
                type="button"
                onClick={() => {
                  setStep4Error('');
                  setCurrentStep(3);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border app-border app-bg-surface text-xs font-extrabold app-text-primary hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7C4DBA] hover:bg-[#6B3CA8] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          STEP 5: VOCABULARY & WORD LEARNING
         ========================================================================= */}
      {currentStep === 5 && (
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary tracking-tight">
              Vocabulary & Word Learning
            </h1>
            <p className="text-xs sm:text-sm app-text-secondary leading-relaxed max-w-2xl">
              Tell us how your child learns, understands, remembers, and uses words in everyday life and learning.
            </p>
          </div>

          {/* Validation Error Banner */}
          {step5Error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{step5Error}</span>
            </div>
          )}

          <form onSubmit={handleStep5SaveAndContinue} className="space-y-8">
            {/* SECTION 1: LEARNING NEW WORDS */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b app-border pb-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                  <BookMarked className="w-4 h-4" />
                  <span>Section 1 — Learning New Words</span>
                </div>
                <span className="text-[11px] text-slate-500 italic">
                  {getAgeGroupHelperText()}
                </span>
              </div>

              {/* Question 1 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  1. How easily does your child learn the meaning of a new word?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = newWordLearning === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setNewWordLearning(opt);
                          if (step5Error) setStep5Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  2. How easily does your child remember a new word after learning it?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = wordRetention === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setWordRetention(opt);
                          if (step5Error) setStep5Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  3. How easily can your child explain what a familiar word means?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = wordMeaning === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setWordMeaning(opt);
                          if (step5Error) setStep5Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 4 */}
              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  4. How easily can your child find the right word when speaking?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = wordFinding === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setWordFinding(opt);
                          if (step5Error) setStep5Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 5 */}
              <div className="space-y-3 pt-3 border-t app-border">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  5. How easily can your child use a newly learned word in a sentence?
                  <span className="text-rose-500 font-bold ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EASE_OPTIONS.map((opt) => {
                    const isSelected = sentenceUse === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSentenceUse(opt);
                          if (step5Error) setStep5Error('');
                        }}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 2: USING & DESCRIBING WORDS */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <MessageSquare className="w-4 h-4 text-[#7C4DBA]" />
                <span>Section 2 — Using & Describing Words</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  Which types of word activities are currently most difficult for your child?
                </label>
                <p className="text-[11px] app-text-secondary">
                  Select all that apply (optional).
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {DIFFICULT_ACTIVITIES_OPTIONS.map((opt) => {
                    const isChecked = difficultWordActivities.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleDifficultActivity(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] text-app-primary ring-1 ring-[#7C4DBA]'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 3: VOCABULARY PRIORITIES */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Target className="w-4 h-4 text-[#7C4DBA]" />
                <span>Section 3 — Vocabulary Priorities</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                    Which vocabulary areas would you most like your child to practice?
                  </label>
                  <span className="text-[11px] font-mono font-bold text-[#7C4DBA] shrink-0">
                    {vocabularyPriorities.length} / 3 selected
                  </span>
                </div>
                <p className="text-[11px] app-text-secondary">
                  Select up to 3 priority areas.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {VOCABULARY_PRIORITIES_OPTIONS.map((opt) => {
                    const isChecked = vocabularyPriorities.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleVocabularyPriority(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {vocabularyPriorities.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={vocabularyPrioritiesOther}
                      onChange={(e) => setVocabularyPrioritiesOther(e.target.value)}
                      placeholder="Specify other vocabulary priority"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 4: REAL-LIFE EXAMPLE */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Lightbulb className="w-4 h-4 text-[#7C4DBA]" />
                <span>Section 4 — Tell us about a word-learning situation</span>
              </div>

              <textarea
                rows={3}
                value={parentVocabularyNotes}
                onChange={(e) => setParentVocabularyNotes(e.target.value)}
                placeholder="For example: words your child often forgets, words they understand but do not use, or situations where they have difficulty finding the right word."
                className="w-full p-3.5 rounded-2xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 transition-all"
              />
            </div>

            {/* SECTION 5: VOCABULARY STRENGTHS */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Star className="w-4 h-4" />
                <span>Section 5 — What does your child already do well?</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  Vocabulary & Word Strengths
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {VOCABULARY_STRENGTHS_OPTIONS.map((opt) => {
                    const isChecked = vocabularyStrengths.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleVocabularyStrength(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-emerald-500/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {vocabularyStrengths.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={vocabularyStrengthsOther}
                      onChange={(e) => setVocabularyStrengthsOther(e.target.value)}
                      placeholder="Specify other vocabulary strength"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons: Back & Save & Continue */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t app-border">
              <button
                type="button"
                onClick={() => {
                  setStep5Error('');
                  setCurrentStep(4);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border app-border app-bg-surface text-xs font-extrabold app-text-primary hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7C4DBA] hover:bg-[#6B3CA8] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          STEP 6: READING, COMPREHENSION & LEARNING
         ========================================================================= */}
      {currentStep === 6 && (
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary tracking-tight">
              Reading, Comprehension & Learning
            </h1>
            <p className="text-xs sm:text-sm app-text-secondary leading-relaxed max-w-2xl">
              Tell us how your child reads, understands information, remembers what they learn, and works with written language.
            </p>
          </div>

          <form onSubmit={handleStep6SaveAndContinue} className="space-y-8">
            {/* SECTION 1: READING */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <BookOpen className="w-4 h-4 text-[#7C4DBA]" />
                <span>Section 1 — Reading</span>
              </div>

              {/* Question 1 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  1. How comfortable is your child when reading age-appropriate text?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setReadingComfort(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        readingComfort === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  2. How easily does your child recognize and read familiar words?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFamiliarWordReading(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        familiarWordReading === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  3. How easily does your child read unfamiliar words?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setUnfamiliarWordReading(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        unfamiliarWordReading === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  4. Does your child avoid or become frustrated during reading activities?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['Rarely', 'Sometimes', 'Often', 'Not sure'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setReadingFrustration(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        readingFrustration === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2: COMPREHENSION */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Brain className="w-4 h-4 text-[#7C4DBA]" />
                <span>Section 2 — Understanding What They Read</span>
              </div>

              {/* Question 5 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  5. How easily does your child understand the main idea of a short passage or story?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMainIdea(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        mainIdea === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 6 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  6. How easily can your child answer questions about what they have read?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setComprehensionQuestions(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        comprehensionQuestions === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 7 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  7. How easily can your child remember important information after reading?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInformationRecall(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        informationRecall === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 8 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  8. How easily can your child explain a story or passage in their own words?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setRetelling(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        retelling === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: THINKING & COMPREHENSION */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Puzzle className="w-4 h-4 text-[#7C4DBA]" />
                <span>Section 3 — Thinking & Comprehension</span>
              </div>

              <p className="text-xs app-text-secondary">
                How easily does your child do the following?
              </p>

              {/* Item 1 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  • Put events in the correct order
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSequencing(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        sequencing === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Item 2 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  • Understand why something happened
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCauseAndEffect(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        causeAndEffect === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Item 3 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  • Understand information that is suggested but not directly stated
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInference(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        inference === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Item 4 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  • Identify important details
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setImportantDetails(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        importantDetails === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 4: OPTIONAL PARENT NOTES */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <MessageSquare className="w-4 h-4 text-[#7C4DBA]" />
                <span>Anything else about your child's reading or learning?</span>
                <span className="text-[10px] font-normal app-text-muted lowercase">(optional)</span>
              </div>

              <textarea
                rows={3}
                value={parentReadingNotes}
                onChange={(e) => setParentReadingNotes(e.target.value)}
                placeholder="For example, what type of reading feels easiest, what causes difficulty, or what helps your child understand and remember information."
                className="w-full p-3.5 rounded-2xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 transition-all"
              />
            </div>

            {step6Error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{step6Error}</span>
              </div>
            )}

            {/* Navigation Buttons: Back & Save & Continue */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t app-border">
              <button
                type="button"
                onClick={() => {
                  setStep6Error('');
                  setCurrentStep(5);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border app-border app-bg-surface text-xs font-extrabold app-text-primary hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7C4DBA] hover:bg-[#6B3CA8] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          STEP 7: EXPRESSION & STORYTELLING
         ========================================================================= */}
      {currentStep === 7 && (
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary tracking-tight">
              Expression & Storytelling
            </h1>
            <p className="text-xs sm:text-sm app-text-secondary leading-relaxed max-w-2xl">
              Tell us how your child expresses ideas, describes experiences, and tells stories.
            </p>
          </div>

          <form onSubmit={handleStep7SaveAndContinue} className="space-y-8">
            {/* SECTION 1: EXPRESSING IDEAS */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <MessageSquare className="w-4 h-4 text-[#7C4DBA]" />
                <span>Section 1 — Expressing Ideas</span>
              </div>

              {/* Question 1 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  1. How easily can your child explain an idea in their own words?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStep7ExplainingIdeas(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        step7ExplainingIdeas === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  2. How easily can your child describe a person, object, or place?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStep7DescribingThings(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        step7DescribingThings === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  3. How easily can your child explain why something happened?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStep7ExplainingWhy(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        step7ExplainingWhy === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  4. How easily can your child answer open-ended questions?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStep7OpenEndedQuestions(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        step7OpenEndedQuestions === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 5 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  5. How easily can your child organize their thoughts before speaking or explaining something?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStep7OrganizingThoughts(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        step7OrganizingThoughts === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2: STORYTELLING */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <BookOpen className="w-4 h-4 text-[#7C4DBA]" />
                <span>Section 2 — Storytelling</span>
              </div>

              {/* Question 6 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  6. How easily can your child tell you what happened in a story or real-life event?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStep7TellingEvents(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        step7TellingEvents === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 7 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  7. How easily can your child tell events in a logical order?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStep7LogicalOrder(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        step7LogicalOrder === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 8 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  8. How easily can your child include important details when telling a story?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStep7ImportantStoryDetails(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        step7ImportantStoryDetails === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 9 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  9. How easily can your child explain what happened first, next, and last?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EASE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStep7FirstNextLast(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        step7FirstNextLast === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: COMMUNICATION IN EVERYDAY LIFE */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Layers className="w-4 h-4 text-[#7C4DBA]" />
                <span>Section 3 — Everyday Expression</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  Which situations are most difficult for your child?
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {EVERYDAY_EXPRESSION_SITUATIONS.map((opt) => {
                    const isChecked = difficultEverydaySituations.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleDifficultEverydaySituation(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] text-[#7C4DBA] shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {difficultEverydaySituations.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={difficultEverydaySituationsOther}
                      onChange={(e) => setDifficultEverydaySituationsOther(e.target.value)}
                      placeholder="Specify other difficult situation"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 4: STRENGTHS */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Star className="w-4 h-4" />
                <span>Section 4 — Expression Strengths</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  What does your child enjoy or do well when communicating?
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {EXPRESSION_STRENGTHS_OPTIONS.map((opt) => {
                    const isChecked = expressionStrengths.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleExpressionStrength(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-emerald-500/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {expressionStrengths.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={expressionStrengthsOther}
                      onChange={(e) => setExpressionStrengthsOther(e.target.value)}
                      placeholder="Specify other expression strength"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 5: PARENT OBSERVATION */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <MessageSquare className="w-4 h-4 text-[#7C4DBA]" />
                <span>Anything else you would like us to know?</span>
                <span className="text-[10px] font-normal app-text-muted lowercase">(optional)</span>
              </div>

              <textarea
                rows={3}
                value={parentExpressionNotes}
                onChange={(e) => setParentExpressionNotes(e.target.value)}
                placeholder="For example, situations where your child communicates confidently, or situations where they need extra time or support."
                className="w-full p-3.5 rounded-2xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 transition-all"
              />
            </div>

            {step7Error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{step7Error}</span>
              </div>
            )}

            {/* Navigation Buttons: Back & Save & Continue */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t app-border">
              <button
                type="button"
                onClick={() => {
                  setStep7Error('');
                  setCurrentStep(6);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border app-border app-bg-surface text-xs font-extrabold app-text-primary hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7C4DBA] hover:bg-[#6B3CA8] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          STEP 8: DAILY ROUTINE, HOME PRACTICE & WELL-BEING
         ========================================================================= */}
      {currentStep === 8 && (
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary tracking-tight">
              Daily Routine & Home Practice
            </h1>
            <p className="text-xs sm:text-sm app-text-secondary leading-relaxed max-w-2xl">
              Tell us about your child's everyday routine and what kind of practice feels realistic and enjoyable at home.
            </p>
          </div>

          <form onSubmit={handleStep8Submit} className="space-y-8">
            {/* SECTION 1 — PRACTICE ROUTINE */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Clock className="w-4 h-4 text-[#7C4DBA]" />
                <span>Home Practice</span>
              </div>

              {/* Question 1 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  1. How much time can your family realistically spend on language or learning activities on most days?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {PRACTICE_TIME_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPracticeTime(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        practiceTime === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  2. How many days per week would your family like to practice?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRACTICE_DAYS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPracticeDays(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        practiceDays === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  3. When does your child usually engage best with learning activities?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRACTICE_TIME_OF_DAY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPracticeTimeOfDay(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        practiceTimeOfDay === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2 — ACTIVITY PREFERENCES */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Heart className="w-4 h-4 text-[#7C4DBA]" />
                <span>What Does Your Child Enjoy?</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  Which activities does your child usually enjoy?
                  <span className="text-[11px] font-normal app-text-muted block mt-0.5">
                    (Select all that apply)
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {CHILD_ENJOYED_ACTIVITIES_OPTIONS.map((opt) => {
                    const isChecked = enjoyedActivities.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleEnjoyedActivity(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] text-[#7C4DBA] shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {enjoyedActivities.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={enjoyedActivitiesOther}
                      onChange={(e) => setEnjoyedActivitiesOther(e.target.value)}
                      placeholder="Specify other activity"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3 — LEARNING SUPPORTS */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Sparkles className="w-4 h-4 text-[#7C4DBA]" />
                <span>What Helps Your Child Learn?</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  Which supports usually help your child stay engaged or understand an activity?
                  <span className="text-[11px] font-normal app-text-muted block mt-0.5">
                    (Select all that apply)
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {LEARNING_SUPPORTS_OPTIONS.map((opt) => {
                    const isChecked = learningSupports.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleLearningSupport(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] text-[#7C4DBA] shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {learningSupports.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={learningSupportsOther}
                      onChange={(e) => setLearningSupportsOther(e.target.value)}
                      placeholder="Specify other learning support"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 4 — DAILY LEARNING CHALLENGES */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <AlertCircle className="w-4 h-4 text-[#7C4DBA]" />
                <span>Daily Learning Challenges</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  What can make learning activities difficult at home?
                  <span className="text-[11px] font-normal app-text-muted block mt-0.5">
                    (Select all that apply)
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {DAILY_CHALLENGES_OPTIONS.map((opt) => {
                    const isChecked = dailyChallenges.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleDailyChallenge(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] text-[#7C4DBA] shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {dailyChallenges.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={dailyChallengesOther}
                      onChange={(e) => setDailyChallengesOther(e.target.value)}
                      placeholder="Specify other difficulty at home"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 5 — MOVEMENT & GENERAL WELL-BEING */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <Activity className="w-4 h-4" />
                  <span>Movement & Everyday Well-being</span>
                </div>
                <p className="text-xs app-text-secondary leading-relaxed pt-1">
                  Regular movement, rest, sleep, and enjoyable activities are part of a healthy daily routine. These questions are for general routine planning and are not a medical assessment.
                </p>
              </div>

              {/* Movement Types Question */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  What types of movement or active play does your child enjoy?
                  <span className="text-[11px] font-normal app-text-muted block mt-0.5">
                    (Select all that apply)
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {MOVEMENT_PLAY_OPTIONS.map((opt) => {
                    const isChecked = movementPlayTypes.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleMovementPlay(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-emerald-500/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {movementPlayTypes.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={movementPlayTypesOther}
                      onChange={(e) => setMovementPlayTypesOther(e.target.value)}
                      placeholder="Specify other type of movement"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>

              {/* Movement Opportunities Question */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  How would you describe your child's usual opportunities for movement during the week?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {MOVEMENT_OPPORTUNITIES_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMovementOpportunities(opt)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        movementOpportunities === opt
                          ? 'bg-[#7C4DBA] text-white border-[#7C4DBA] shadow-xs'
                          : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 6 — REST & ROUTINE */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Layers className="w-4 h-4 text-[#7C4DBA]" />
                <span>Rest & Routine</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  Which parts of your child's daily routine would you most like help organizing?
                  <span className="text-[11px] font-normal app-text-muted block mt-0.5">
                    (Select all that apply)
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {ROUTINE_HELP_ORGANIZING_OPTIONS.map((opt) => {
                    const isChecked = routineHelpAreas.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleRoutineHelpArea(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] text-[#7C4DBA] shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {routineHelpAreas.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={routineHelpAreasOther}
                      onChange={(e) => setRoutineHelpAreasOther(e.target.value)}
                      placeholder="Specify other routine part"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 7 — PARENT NOTES */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <MessageSquare className="w-4 h-4 text-[#7C4DBA]" />
                <span>Anything else about your child's daily routine?</span>
                <span className="text-[10px] font-normal app-text-muted lowercase">(optional)</span>
              </div>

              <textarea
                rows={3}
                value={parentRoutineNotes}
                onChange={(e) => setParentRoutineNotes(e.target.value)}
                placeholder="For example, what makes practice easier, what your child enjoys most, or what tends to make activities difficult at home."
                className="w-full p-3.5 rounded-2xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 transition-all"
              />
            </div>

            {step8Error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{step8Error}</span>
              </div>
            )}

            {/* Navigation Buttons: Back & Save & Continue */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t app-border">
              <button
                type="button"
                onClick={() => {
                  setStep8Error('');
                  setCurrentStep(7);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border app-border app-bg-surface text-xs font-extrabold app-text-primary hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7C4DBA] hover:bg-[#6B3CA8] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          STEP 9: PARENT CONCERNS & GOALS
         ========================================================================= */}
      {currentStep === 9 && (
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary tracking-tight">
              Your Concerns & Goals
            </h1>
            <p className="text-xs sm:text-sm app-text-secondary leading-relaxed max-w-2xl">
              Tell us what matters most to your family. Your answers will help Lingua AI organize relevant activities and support suggestions.
            </p>
          </div>

          <form onSubmit={handleStep9Submit} className="space-y-8">
            {/* SECTION 1 — MAIN CONCERNS */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Target className="w-4 h-4 text-[#7C4DBA]" />
                <span>What would you most like to work on?</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  Select areas of focus
                  <span className="text-[11px] font-normal app-text-muted block mt-0.5">
                    (Select up to 4 areas)
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {MAIN_CONCERNS_OPTIONS.map((opt) => {
                    const isChecked = mainConcerns.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleMainConcern(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] text-[#7C4DBA] shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {mainConcerns.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={mainConcernsOther}
                      onChange={(e) => setMainConcernsOther(e.target.value)}
                      placeholder="Specify other main concern area"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2 — TOP PRIORITIES */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Star className="w-4 h-4 text-[#7C4DBA]" />
                <span>Choose Your Top Priorities</span>
              </div>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm app-text-secondary leading-relaxed">
                  Select up to 3 areas that you would most like Lingua AI to focus on.
                </p>

                {mainConcerns.filter((c) => c !== 'Not sure').length === 0 ? (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>Please select at least one area above before choosing priorities.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {mainConcerns
                      .filter((c) => c !== 'Not sure')
                      .map((opt) => {
                        const displayLabel = opt === 'Other' && mainConcernsOther.trim() ? mainConcernsOther.trim() : opt;
                        const isChecked = topPriorities.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleTopPriority(opt)}
                            className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                              isChecked
                                ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] text-[#7C4DBA] shadow-2xs'
                                : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                            }`}
                          >
                            <span>{displayLabel}</span>
                            {isChecked && (
                              <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3 — FAMILY GOAL */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Heart className="w-4 h-4 text-[#7C4DBA]" />
                <span>What would you most like your child to achieve?</span>
                <span className="text-[10px] font-normal app-text-muted lowercase">(optional)</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold app-text-primary">
                  Your main goal
                </label>
                <textarea
                  rows={3}
                  value={familyGoal}
                  onChange={(e) => setFamilyGoal(e.target.value)}
                  placeholder="For example: understand instructions more easily, learn and use new words, explain ideas clearly, enjoy reading more, tell stories, or communicate more confidently."
                  className="w-full p-3.5 rounded-2xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 transition-all"
                />
              </div>
            </div>

            {/* SECTION 4 — ADDITIONAL CONCERNS OR NOTES */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <MessageSquare className="w-4 h-4 text-[#7C4DBA]" />
                <span>Is there anything else you would like us to know?</span>
                <span className="text-[10px] font-normal app-text-muted lowercase">(optional)</span>
              </div>

              <textarea
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Share any additional context, specific goals, or observations that could help us tailor your experience."
                className="w-full p-3.5 rounded-2xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 transition-all"
              />
            </div>

            {/* SECTION 5 — WHAT HAS HELPED BEFORE */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                <Sparkles className="w-4 h-4 text-[#7C4DBA]" />
                <span>What Has Helped Before?</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  What has helped your child learn or communicate in the past?
                  <span className="text-[11px] font-normal app-text-muted block mt-0.5">
                    (Select all that apply)
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {PAST_HELPED_OPTIONS.map((opt) => {
                    const isChecked = pastHelpedSupports.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => togglePastHelpedSupport(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] text-[#7C4DBA] shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {pastHelpedSupports.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={pastHelpedSupportsOther}
                      onChange={(e) => setPastHelpedSupportsOther(e.target.value)}
                      placeholder="Specify other support that helped before"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 6 — PROFESSIONAL SUPPORT CONTEXT */}
            <div className="p-6 rounded-3xl app-bg-surface-secondary border app-border space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA]">
                  <User className="w-4 h-4 text-[#7C4DBA]" />
                  <span>Current Support</span>
                </div>
                <p className="text-xs app-text-secondary leading-relaxed pt-0.5">
                  This information is optional and helps keep parent observations separate from professional assessment.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold app-text-primary">
                  Is your child currently receiving support from any professional?
                  <span className="text-[11px] font-normal app-text-muted block mt-0.5">
                    (Select all that apply)
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {PROFESSIONAL_SUPPORT_OPTIONS.map((opt) => {
                    const isChecked = professionalSupports.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleProfessionalSupport(opt)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#7C4DBA]/10 border-[#7C4DBA] text-[#7C4DBA] shadow-2xs'
                            : 'app-bg-surface border-app-border app-text-primary hover:border-[#7C4DBA]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <div className="w-4 h-4 rounded-full bg-[#7C4DBA] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {professionalSupports.includes('Other') && (
                  <div className="pt-2 max-w-sm animate-fade-in">
                    <input
                      type="text"
                      value={professionalSupportsOther}
                      onChange={(e) => setProfessionalSupportsOther(e.target.value)}
                      placeholder="Specify other professional support"
                      className="w-full px-4 py-2.5 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold app-text-primary">
                  Anything you would like to note about current support?
                  <span className="text-[10px] font-normal app-text-muted lowercase ml-1">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={professionalSupportNotes}
                  onChange={(e) => setProfessionalSupportNotes(e.target.value)}
                  placeholder="Anything you would like to note about current support?"
                  className="w-full p-3.5 rounded-2xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA]/50 transition-all"
                />
              </div>
            </div>

            {/* SECTION 7 — PROFESSIONAL SUPPORT NOTICE */}
            <div className="p-4.5 rounded-2xl bg-[#7C4DBA]/5 border border-[#7C4DBA]/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#7C4DBA] shrink-0 mt-0.5" />
              <p className="text-xs app-text-secondary leading-relaxed">
                Lingua AI provides learning and communication support. It does not diagnose developmental or medical conditions. If you have ongoing concerns about your child's communication, learning, hearing, or development, consider discussing your observations with an appropriately qualified professional.
              </p>
            </div>

            {step9Error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{step9Error}</span>
              </div>
            )}

            {/* Navigation Buttons: Back & Save & Continue */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t app-border">
              <button
                type="button"
                onClick={() => {
                  setStep9Error('');
                  setCurrentStep(8);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border app-border app-bg-surface text-xs font-extrabold app-text-primary hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7C4DBA] hover:bg-[#6B3CA8] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          CAREGIVER INTELLIGENCE & CLINICAL GROWTH HUB
         ========================================================================= */}
      {currentStep >= 10 && (
        <div className="space-y-6 animate-fade-in">
          {/* Master Card Container */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6 transition-all">
            {/* Top Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black app-text-primary flex items-center gap-2">
                    Caregiver Intelligence Hub 🌿
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm app-text-secondary">
                  Personalized clinical scaffolding & home routines for {preferredName.trim() || childName || 'Khushi'} (Age {age || 7}).
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setIsEditModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 self-start sm:self-center shrink-0"
              >
                <Edit3 className="w-4 h-4 text-purple-500" />
                <span>Edit Assessment Responses ✏️</span>
              </button>
            </div>

            {/* Daily DLD Clinical Growth Insights */}
            <ClinicalGrowthInsights />

            {/* Daily NeuroPlay Challenges */}
            <DailyNeuroPlayChallenges />

            {/* Three High-Tech Interactive Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 w-fit">
              <button
                type="button"
                onClick={() => setActiveHubTab('BLUEPRINT')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  activeHubTab === 'BLUEPRINT'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'app-text-secondary hover:app-text-primary hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>📋 Learner Blueprint</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveHubTab('ROUTINES')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  activeHubTab === 'ROUTINES'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'app-text-secondary hover:app-text-primary hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>🎯 Targeted Home Routines</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveHubTab('CLINICAL')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  activeHubTab === 'CLINICAL'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'app-text-secondary hover:app-text-primary hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>🩺 Clinical Recommendations</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="pt-2">
              {/* TAB 1: LEARNER BLUEPRINT */}
              {activeHubTab === 'BLUEPRINT' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-fade-in">
                  {/* Card 1: Identity & Style */}
                  <div className="p-5 rounded-2xl app-bg-surface-secondary border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 flex flex-col justify-between shadow-xs hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold text-purple-600 dark:text-purple-400 tracking-wider">
                        1. Identity & Style
                      </span>
                      <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="font-extrabold app-text-primary text-sm block">
                        {educationLevel || 'Primary School'} · {learningStyle || 'Multimodal (Visual + Audio)'}
                      </span>
                      <span className="text-[11px] app-text-secondary mt-1 block">
                        Name: {preferredName.trim() || childName || 'Khushi'} (Age {age || 7})
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Adaptive Visual Cues</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Card 2: Bilingual Root */}
                  <div className="p-5 rounded-2xl app-bg-surface-secondary border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 flex flex-col justify-between shadow-xs hover:border-blue-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
                        2. Bilingual Root
                      </span>
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300">
                        <Languages className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="font-extrabold app-text-primary text-sm block">
                        Home: {homeLanguage || 'Hindi'} · School: {schoolLanguage || 'English'}
                      </span>
                      <span className="text-[11px] app-text-secondary mt-1 block">
                        Comfort Level: Balanced Bilingual
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                      <span>Bilingual Scaffolding</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Card 3: Speaking & Expression */}
                  <div className="p-5 rounded-2xl app-bg-surface-secondary border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 flex flex-col justify-between shadow-xs hover:border-amber-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold text-amber-600 dark:text-amber-400 tracking-wider">
                        3. Speaking & Expression
                      </span>
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="font-extrabold app-text-primary text-sm block">
                        Everyday Needs: Fluid · Storytelling: Growing
                      </span>
                      <span className="text-[11px] app-text-secondary mt-1 block">
                        Focus: Consonant Blends & Multi-clause sentences
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                      <span>Phoneme Assist Active</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Card 4: Practice Cadence */}
                  <div className="p-5 rounded-2xl app-bg-surface-secondary border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 flex flex-col justify-between shadow-xs hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
                        4. Practice Cadence
                      </span>
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="font-extrabold app-text-primary text-sm block">
                        {practiceTime || '10–20 mins/day'} · {practiceDays || '3–4 days weekly'}
                      </span>
                      <span className="text-[11px] app-text-secondary mt-1 block">
                        Preferred Window: {practiceTimeOfDay || 'Afternoons'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Optimal NeuroPlay Time</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TARGETED HOME ROUTINES */}
              {activeHubTab === 'ROUTINES' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
                  {/* Routine 1: 5-Second Wait Rule */}
                  <div className="p-5 rounded-2xl app-bg-surface-secondary border border-slate-200/80 dark:border-slate-700/80 space-y-4 flex flex-col justify-between shadow-xs hover:border-indigo-500/40 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                          Speech Independence
                        </span>
                        <span className="text-xl">⏳</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold app-text-primary">
                          The 5-Second Wait Rule
                        </h4>
                        <p className="text-xs app-text-secondary leading-relaxed">
                          Give pause before prompting to build speech independence and allow phoneme processing time.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTriedRoutines(prev => ({ ...prev, wait_rule: !prev['wait_rule'] }))}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        triedRoutines['wait_rule']
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {triedRoutines['wait_rule'] ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Tried Today ✓</span>
                        </>
                      ) : (
                        <span>Mark Tried Today ✓</span>
                      )}
                    </button>
                  </div>

                  {/* Routine 2: One New Word Daily */}
                  <div className="p-5 rounded-2xl app-bg-surface-secondary border border-slate-200/80 dark:border-slate-700/80 space-y-4 flex flex-col justify-between shadow-xs hover:border-purple-500/40 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                          Lexical Recall
                        </span>
                        <span className="text-xl">📖</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold app-text-primary">
                          One New Word Daily
                        </h4>
                        <p className="text-xs app-text-secondary leading-relaxed">
                          Pick 1 novel word from bedtime stories, connect it to visual imagery, and practice context usage.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTriedRoutines(prev => ({ ...prev, new_word: !prev['new_word'] }))}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        triedRoutines['new_word']
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {triedRoutines['new_word'] ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Tried Today ✓</span>
                        </>
                      ) : (
                        <span>Mark Tried Today ✓</span>
                      )}
                    </button>
                  </div>

                  {/* Routine 3: Visual Daily Routine Checklist */}
                  <div className="p-5 rounded-2xl app-bg-surface-secondary border border-slate-200/80 dark:border-slate-700/80 space-y-4 flex flex-col justify-between shadow-xs hover:border-emerald-500/40 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                          Self-Guided Tasks
                        </span>
                        <span className="text-xl">🖼️</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold app-text-primary">
                          Visual Daily Routine Checklist
                        </h4>
                        <p className="text-xs app-text-secondary leading-relaxed">
                          3-item picture board for self-guided daily tasks to reinforce sequencing and focus.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTriedRoutines(prev => ({ ...prev, visual_checklist: !prev['visual_checklist'] }))}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        triedRoutines['visual_checklist']
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {triedRoutines['visual_checklist'] ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Tried Today ✓</span>
                        </>
                      ) : (
                        <span>Mark Tried Today ✓</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: CLINICAL RECOMMENDATIONS & NEXT STEPS */}
              {activeHubTab === 'CLINICAL' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Focus Modules */}
                    <div className="p-5 rounded-2xl app-bg-surface-secondary border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <h3 className="text-sm font-extrabold app-text-primary">
                          Focus Modules
                        </h3>
                      </div>
                      <p className="text-xs app-text-secondary">
                        Direct quick-launch modules recommended for Khushi based on active speech & vocabulary milestones:
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('read-listen')}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <span>🗣️ Speech & Expression Coach</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('language-tools')}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <span>📚 Visual Vocabulary Bank</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Right: Professional Support Network */}
                    <div className="p-5 rounded-2xl app-bg-surface-secondary border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                        <User className="w-4 h-4 text-blue-500" />
                        <h3 className="text-sm font-extrabold app-text-primary">
                          Professional Support Network
                        </h3>
                      </div>
                      <p className="text-xs app-text-secondary">
                        Guidance for sharing observations with certified developmental specialists:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs font-bold flex items-center gap-1.5">
                          <span>🩺 Speech-Language Pathologist</span>
                        </span>
                        <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-bold flex items-center gap-1.5">
                          <span>🎓 Special Educator</span>
                        </span>
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
                          <span>🩺 Pediatrician Review</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate('read-listen');
                    }}
                    className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-sm shadow-lg hover:shadow-indigo-500/25 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Launch Recommended Daily Practice →</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Assurance Footer */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 app-text-secondary text-xs font-bold border border-slate-200 dark:border-slate-700/80 shadow-2xs text-center">
                <span>🛡️ Research-Informed DLD Framework · Non-Diagnostic Clinical Scaffolding · Data Encrypted & Private</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ASSESSMENT MODAL DRAWER */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#0B0F19] border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 relative text-white animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">
                    Edit Assessment Responses
                  </h2>
                  <p className="text-xs text-slate-400">
                    Update learner responses for {preferredName || childName || 'Khushi'}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Selection Bar */}
            <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-800 pb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sNum) => (
                <button
                  key={sNum}
                  type="button"
                  onClick={() => setCurrentStep(sNum)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentStep === sNum
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  Step {sNum}
                </button>
              ))}
            </div>

            <p className="text-xs text-purple-300 font-medium">
              Editing Step {currentStep <= 9 ? currentStep : 1}. Select a step above or click "Done Editing" below when finished.
            </p>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(10);
                  setIsEditModalOpen(false);
                }}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Done Editing & Return to Hub</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Non-Medical Disclaimer Footer Note */}
      <div className="pt-2 border-t app-border flex items-center gap-2 text-[11px] app-text-muted">
        <ShieldCheck className="w-4 h-4 text-[#7C4DBA] shrink-0" />
        <span>
          Lingua AI provides learning-support and activity customization. It is not a clinical diagnostic tool.
        </span>
      </div>
    </div>
  );
};
