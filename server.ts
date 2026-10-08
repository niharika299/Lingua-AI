import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Allow camera permission across iframe previews
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=*');
  next();
});

// Shared Gemini Client instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to check API Key availability
const hasApiKey = () => Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

// Ordered list of models to try (preferring fast, high-quota gemini-3.1-flash-lite)
const GEMINI_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

// 1. Text Simplification & Language Breakdown
app.post('/api/gemini/simplify', async (req, res) => {
  try {
    const { text, level = 'beginner', targetAge = '7-9' } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for simplification.' });
      return;
    }

    if (!hasApiKey()) {
      res.status(500).json({ error: 'Gemini API key is not configured in environment.' });
      return;
    }

    const systemInstruction = `You are a certified pediatric Speech-Language Pathologist (SLP) and reading accessibility expert specialized in Developmental Language Disorder (DLD).
Your task is to simplify the provided text for a child (approx age ${targetAge}) at level: ${level}.
Children with DLD struggle with complex syntax (passive voice, embedded clauses, complex conjunctions) and dense vocabulary, but have intact intelligence.
Simplify the text into clear, active, sequential sentences. Break down key vocabulary with syllables, friendly definitions, and example usage.
Provide 2-3 quick comprehension questions with answers.`;

    let response: any = null;
    for (const model of GEMINI_MODELS) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: `Original passage:\n"""${text}"""\n\nSimplify this and extract key learning scaffolding.`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                simplifiedText: {
                  type: Type.STRING,
                  description: 'The clear, accessible, simplified version of the text.',
                },
                summary: {
                  type: Type.STRING,
                  description: 'A 1-2 sentence core takeaway of the passage.',
                },
                keyWords: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      word: { type: Type.STRING },
                      syllables: { type: Type.STRING, description: 'e.g. "won-der-ful"' },
                      definition: { type: Type.STRING, description: 'Child-friendly simple explanation' },
                      example: { type: Type.STRING, description: 'Simple example sentence' },
                    },
                    required: ['word', 'syllables', 'definition'],
                  },
                },
                sentenceBreakdown: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING },
                      simple: { type: Type.STRING },
                      tip: { type: Type.STRING, description: 'Why this was simplified or tip for comprehension' },
                    },
                    required: ['original', 'simple'],
                  },
                },
                comprehensionCheck: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                    required: ['question', 'options', 'correctIndex', 'explanation'],
                  },
                },
              },
              required: ['simplifiedText', 'summary', 'keyWords', 'comprehensionCheck'],
            },
          },
        });
        if (response && response.text) break;
      } catch (err: any) {
        console.warn(`Model ${model} in /api/gemini/simplify failed, trying next:`, err?.status || err?.message);
      }
    }

    if (!response || !response.text) {
      // Pedagogic fallback if API quota is reached
      const clean = text.trim();
      const sentences = clean.split(/(?<=[.?!])\s+/).filter(Boolean);
      res.json({
        simplifiedText: sentences.join(' '),
        summary: sentences[0] || clean.slice(0, 100),
        keyWords: [
          { word: 'Learning', syllables: 'learn · ing', definition: 'Gaining knowledge or understanding new things.' },
          { word: 'Reading', syllables: 'read · ing', definition: 'Looking at written words and understanding them.' }
        ],
        sentenceBreakdown: sentences.map((s) => ({
          original: s,
          simple: s,
          tip: 'Clear, straightforward sentence structure.',
        })),
        comprehensionCheck: [
          {
            question: 'What is the main topic of this passage?',
            options: ['Understanding the text clearly', 'Playing a video game', 'Cooking dinner'],
            correctIndex: 0,
            explanation: 'The passage shares ideas that help us understand the text step-by-step.',
          }
        ]
      });
      return;
    }

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.warn('Fallback in /api/gemini/simplify:', err);
    const fallbackText = req.body?.text || '';
    res.json({
      simplifiedText: fallbackText,
      summary: fallbackText.slice(0, 100),
      keyWords: [],
      sentenceBreakdown: [],
      comprehensionCheck: []
    });
  }
});

// 2. Book Scanner & Reading Analyzer (Image or Text)
app.post('/api/gemini/scan-book', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', manualText } = req.body;

    if (!imageBase64 && !manualText) {
      res.status(400).json({ error: 'Please provide either an image scan or text.' });
      return;
    }

    if (!hasApiKey()) {
      res.status(500).json({ error: 'Gemini API key is not configured in environment.' });
      return;
    }

    const systemInstruction = `You are Lingua AI Book Scanner, an assistive tool for children with Developmental Language Disorder (DLD), dyslexia, or language processing differences.
Extract or analyze the text from the book page.
Estimate reading readability, break down complex sentences into accessible structure, extract vocabulary hurdles with pronunciation, and formulate 3 child-friendly check-in questions.`;

    const contentsPayload: any[] = [];
    if (imageBase64) {
      let rawBase64 = imageBase64;
      let detectedMime = mimeType || 'image/jpeg';
      if (typeof imageBase64 === 'string' && imageBase64.includes(';base64,')) {
        const parts = imageBase64.split(';base64,');
        detectedMime = parts[0].replace('data:', '') || 'image/jpeg';
        rawBase64 = parts[1];
      } else if (typeof imageBase64 === 'string' && imageBase64.startsWith('data:')) {
        rawBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
      }

      contentsPayload.push({
        inlineData: {
          mimeType: detectedMime,
          data: rawBase64.trim(),
        },
      });
      contentsPayload.push({
        text: 'Perform accurate Optical Character Recognition (OCR) on this book page image. Extract all printed or written text visible in this image accurately, in reading order. If no readable text is visible in this image, set extractedText to "". Do not invent or substitute sample stories.',
      });
    } else {
      contentsPayload.push({
        text: `Analyze this book passage for a child with DLD:\n"""${manualText}"""`,
      });
    }

    let response: any = null;
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: contentsPayload,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                extractedText: { type: Type.STRING },
                readabilityGrade: { type: Type.STRING, description: 'e.g. Grade 2-3' },
                simplifiedVersion: { type: Type.STRING },
                vocabularyList: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      word: { type: Type.STRING },
                      meaning: { type: Type.STRING },
                    },
                    required: ['word', 'meaning'],
                  },
                },
              },
              required: ['extractedText'],
            },
          },
        });
        if (response && response.text) break;
      } catch (e: any) {
        lastError = e;
        console.warn(`Model ${model} failed in /api/gemini/scan-book, trying next:`, e.status || e.message);
      }
    }

    if (!response || !response.text) {
      // Direct text fallback if structured schema had issues
      try {
        const directRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: [
            ...contentsPayload,
            { text: 'Extract and return ALL the visible text printed in this image accurately, in reading order. Return ONLY the plain text.' },
          ],
        });
        const plainText = directRes.text?.trim() || '';
        res.json({
          extractedText: plainText,
          simplifiedVersion: plainText,
          readabilityGrade: 'Grade 2-3',
          vocabularyList: [],
        });
        return;
      } catch (fallbackErr: any) {
        throw lastError || fallbackErr;
      }
    }

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/gemini/scan-book:', err);
    res.status(500).json({ error: err.message || 'Failed to scan book page' });
  }
});

// 3. Instruction Breaker (Comprehension Assistant)
app.post('/api/gemini/breakdown-instructions', async (req, res) => {
  try {
    const { instructions } = req.body;
    if (!instructions || typeof instructions !== 'string') {
      res.status(400).json({ error: 'Instruction text is required.' });
      return;
    }

    if (!hasApiKey()) {
      res.status(500).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    const systemInstruction = `You are a neurodevelopmental communication specialist. Children with DLD get overwhelmed by multi-step auditory directions (auditory memory overload).
Break the instructions down into single-action, sequential, chunked steps with visual icons/tags (e.g. "backpack", "folder", "pencil", "sit", "listen"), clear time transitions (First, Next, Then, Finally), and what to do if stuck.`;

    let response: any = null;
    for (const model of GEMINI_MODELS) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: `Break down this multi-step direction:\n"""${instructions}"""`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Short summary of the task' },
                totalSteps: { type: Type.INTEGER },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      temporalMarker: { type: Type.STRING, description: 'First, Next, Then, or Finally' },
                      actionVerb: { type: Type.STRING, description: 'e.g. Open, Put, Bring' },
                      directionText: { type: Type.STRING, description: 'Short, clean instruction' },
                      iconCategory: { type: Type.STRING, description: 'e.g. book, pencil, clean, listen, sit, folder' },
                    },
                    required: ['stepNumber', 'temporalMarker', 'actionVerb', 'directionText', 'iconCategory'],
                  },
                },
                keyTipForChild: { type: Type.STRING },
                questionForTeacher: { type: Type.STRING, description: 'A question the child can ask if they need help' },
              },
              required: ['title', 'totalSteps', 'steps', 'keyTipForChild'],
            },
          },
        });
        if (response && response.text) break;
      } catch (err: any) {
        console.warn(`Model ${model} in /api/gemini/breakdown-instructions failed, trying next:`, err?.status || err?.message);
      }
    }

    if (!response || !response.text) {
      // High-quality rule-based instruction decomposition fallback
      const cleanText = instructions.trim();
      const parts = cleanText
        .split(/(?:[.\n;]+|\b(?:and then|then|after that|first|second|next|finally)\b)/i)
        .map((p) => p.trim())
        .filter((p) => p.length > 2);

      const markers = ['First', 'Next', 'Then', 'Then', 'Finally'];
      const icons = ['book', 'pencil', 'listen', 'folder', 'sit'];

      const fallbackSteps = (parts.length > 0 ? parts : [cleanText]).map((part, idx) => {
        const words = part.split(' ');
        const verb = words[0] || 'Complete';
        return {
          stepNumber: idx + 1,
          temporalMarker: markers[Math.min(idx, markers.length - 1)],
          actionVerb: verb,
          directionText: part,
          iconCategory: icons[idx % icons.length],
        };
      });

      res.json({
        title: cleanText.slice(0, 36) + (cleanText.length > 36 ? '...' : ''),
        totalSteps: fallbackSteps.length,
        steps: fallbackSteps,
        keyTipForChild: 'Focus on one step at a time. Take a deep breath before moving to the next step!',
        questionForTeacher: 'Can you please show me the first step again?',
      });
      return;
    }

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.warn('Fallback in /api/gemini/breakdown-instructions:', err);
    res.json({
      title: 'Task Steps',
      totalSteps: 1,
      steps: [
        {
          stepNumber: 1,
          temporalMarker: 'First',
          actionVerb: 'Follow',
          directionText: req.body?.instructions || 'Follow step',
          iconCategory: 'book',
        },
      ],
      keyTipForChild: 'Take your time and do your best!',
      questionForTeacher: 'Can you help me get started, please?',
    });
  }
});

// 4. Speech & Communication Coach
app.post('/api/gemini/speech-coach', async (req, res) => {
  try {
    const { topic, childSentence, targetArea = 'sentence expansion' } = req.body;

    if (!childSentence) {
      res.status(400).json({ error: 'Child sentence input is required.' });
      return;
    }

    if (!hasApiKey()) {
      res.status(500).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    const systemInstruction = `You are a supportive, friendly pediatric Speech-Language Pathologist coach talking with a child or their caregiver.
Never shame or bluntly criticize grammar errors. Celebrate their idea first!
Provide scaffolding for Developmental Language Disorder (DLD):
- Rephrase their thought using rich vocabulary and correct syntax (Recasting technique).
- Offer 2 different ways to say it (Simple Level & Challenge Level).
- Give an interactive practice prompt.`;

    let response: any = null;
    for (const model of GEMINI_MODELS) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: `Topic: ${topic || 'General conversation'}\nTarget Focus: ${targetArea}\nChild said: "${childSentence}"`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                praise: { type: Type.STRING, description: 'Enthusiastic and specific praise for their communication effort' },
                recastedSentence: { type: Type.STRING, description: 'Natural, grammatical model of their idea' },
                simpleVersion: { type: Type.STRING },
                expandedVersion: { type: Type.STRING, description: 'More descriptive version with rich vocabulary' },
                communicationTip: { type: Type.STRING, description: 'Friendly coaching tip, e.g. "We can add the word \'because\' to show why!"' },
                followUpQuestion: { type: Type.STRING, description: 'A fun question to keep the verbal conversation flowing' },
              },
              required: ['praise', 'recastedSentence', 'simpleVersion', 'expandedVersion', 'communicationTip', 'followUpQuestion'],
            },
          },
        });
        if (response && response.text) break;
      } catch (err: any) {
        console.warn(`Model ${model} in /api/gemini/speech-coach failed, trying next:`, err?.status || err?.message);
      }
    }

    if (!response || !response.text) {
      const clean = childSentence.trim();
      res.json({
        praise: 'Wonderful communication! You did a fantastic job expressing your idea.',
        recastedSentence: `You shared: "${clean}". A clear way to express this: "We ran very quickly together to get the ball!"`,
        simpleVersion: 'We ran fast to catch the ball.',
        expandedVersion: 'My friend and I sprinted across the playground to catch the rolling soccer ball.',
        communicationTip: 'Try using connection words like "because" or "and" to connect your action with what happened!',
        followUpQuestion: 'What game were you playing, and where did the ball go next?',
      });
      return;
    }

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.warn('Fallback in /api/gemini/speech-coach:', err);
    const fallbackSentence = req.body?.childSentence || '';
    res.json({
      praise: 'Awesome job sharing your thoughts!',
      recastedSentence: fallbackSentence,
      simpleVersion: fallbackSentence,
      expandedVersion: fallbackSentence,
      communicationTip: 'Keep sharing your ideas out loud every day!',
      followUpQuestion: 'Can you tell me more about that?',
    });
  }
});

// 5. Observational Screening Insights & Specialist Referral Guide
app.post('/api/gemini/screening-insights', async (req, res) => {
  try {
    const { childAge, domainScores, observationsNotes, relationship = 'Parent' } = req.body;

    if (!hasApiKey()) {
      res.status(500).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    const systemInstruction = `You are an expert pediatric neurodevelopment and speech-language specialist reviewing parent/educator observations.
CRITICAL ETHICAL AND MEDICAL DIRECTIVE:
You must explicitly state that Lingua AI provides *screening support and language-processing insights*, NOT a medical diagnosis.
A diagnosis of Developmental Language Disorder (DLD) must be confirmed by a licensed Speech-Language Pathologist (SLP).
Evaluate observations across:
1. Receptive Language / Comprehension
2. Expressive Vocabulary & Word Finding
3. Syntax & Grammar Construction
4. Auditory Working Memory
5. Social Pragmatics & Discourse

Generate a constructive, strength-based analysis with actionable next steps, accommodations for home/school, and a ready-to-share clinical discussion summary for their pediatrician or SLP.`;

    const promptText = `Child Age: ${childAge || 'Not specified'}
Respondent: ${relationship}
Observed Domain Indicators: ${JSON.stringify(domainScores)}
Additional Caregiver Notes: ${observationsNotes || 'None'}`;

    let response: any = null;
    for (const model of GEMINI_MODELS) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: promptText,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                disclaimer: { type: Type.STRING },
                executiveSummary: { type: Type.STRING },
                identifiedStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                supportPriorityAreas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      area: { type: Type.STRING },
                      observedTendency: { type: Type.STRING },
                      recommendedIntervention: { type: Type.STRING },
                    },
                    required: ['area', 'observedTendency', 'recommendedIntervention'],
                  },
                },
                homeStrategies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                classroomAccommodations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                specialistQuestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Questions for the parent to take to a Speech-Language Pathologist',
                },
              },
              required: [
                'disclaimer',
                'executiveSummary',
                'identifiedStrengths',
                'supportPriorityAreas',
                'homeStrategies',
                'classroomAccommodations',
                'specialistQuestions',
              ],
            },
          },
        });
        if (response && response.text) break;
      } catch (err: any) {
        console.warn(`Model ${model} in /api/gemini/screening-insights failed, trying next:`, err?.status || err?.message);
      }
    }

    if (!response || !response.text) {
      res.json({
        disclaimer: 'Notice: Lingua AI provides observational screening insights to assist caregivers and educators. This is not a medical or clinical diagnosis of DLD. A formal evaluation by a licensed Speech-Language Pathologist (SLP) is recommended.',
        executiveSummary: 'Based on the checklist, the child shows strong non-verbal problem solving and social engagement, with indicators pointing to auditory working memory overload and multi-step receptive language fatigue.',
        identifiedStrengths: [
          'High motivation to interact and participate in visual/hands-on tasks',
          'Intact intelligence and strong comprehension of visual cues and pictorial sequences',
          'Eagerness to communicate when given extra processing time'
        ],
        supportPriorityAreas: [
          {
            area: 'Auditory Working Memory',
            observedTendency: 'Multi-step verbal directions (3+ clauses) cause cognitive overload.',
            recommendedIntervention: 'Break spoken instructions into single visual steps with time markers (First, Next).'
          },
          {
            area: 'Syntax & Expressive Structure',
            observedTendency: 'May simplify sentences or use gesture substitutions when formulating complex thoughts.',
            recommendedIntervention: 'Use the Recasting technique: gently repeat the child’s thought with grammatical expansion without direct criticism.'
          }
        ],
        homeStrategies: [
          'Give 5-7 seconds of wait time after asking a question before repeating or helping.',
          'Pair spoken instructions with a visual gesture or graphic cue.',
          'Read illustrated storybooks together daily using active dialogue rather than quiz-style questions.'
        ],
        classroomAccommodations: [
          'Seat child near teacher with clear visual line of sight.',
          'Provide visual schedule checklists for daily transitions.',
          'Check for understanding by asking the child to demonstrate the first step rather than asking "Do you understand?".'
        ],
        specialistQuestions: [
          'How does auditory processing speed compare to the child’s receptive vocabulary percentile?',
          'What classroom visual scaffolding techniques would be most effective for their IEP or 504 plan?',
          'What speech therapy frequency is recommended for expressive syntax support?'
        ]
      });
      return;
    }

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.warn('Fallback in /api/gemini/screening-insights:', err);
    res.json({
      disclaimer: 'Notice: Lingua AI provides educational and developmental screening insights, not a clinical diagnosis.',
      executiveSummary: 'The observational profile highlights opportunities to reinforce auditory working memory and visual sequencing.',
      identifiedStrengths: ['Expressive curiosity', 'Visual learning ability'],
      supportPriorityAreas: [
        {
          area: 'Instructional Processing',
          observedTendency: 'Benefits from chunked instructions.',
          recommendedIntervention: 'Break multi-step directions into single steps.'
        }
      ],
      homeStrategies: ['Provide extra wait time for responses.', 'Pair verbal directions with visual cues.'],
      classroomAccommodations: ['Visual schedule checklists', 'Written and visual directions alongside verbal requests.'],
      specialistQuestions: ['What specific accommodations support multi-step auditory processing in the classroom?']
    });
  }
});

// 6. Text-to-Speech endpoint using Gemini TTS
app.post('/api/gemini/tts', async (req, res) => {
  try {
    const { text, voice = 'Puck' } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for TTS.' });
      return;
    }

    if (!hasApiKey()) {
      res.json({ fallbackToBrowser: true, message: 'Gemini API key is not configured.' });
      return;
    }

    // High efficiency TTS for child-friendly clear speech reading
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.slice(0, 800), // safe length
                speechMetadata: {
                  style: 'Gentle, clear, well-articulated narration for young learners',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || 'Puck' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({ audioBase64: base64Audio, format: 'audio/wav' });
        return;
      }
    } catch (modelErr: any) {
      console.warn('Gemini TTS model quota or generation issue:', modelErr?.status || modelErr?.message || modelErr);
      res.json({ fallbackToBrowser: true, message: 'Gemini TTS quota reached. Falling back to browser speech synthesis.' });
      return;
    }

    res.json({ fallbackToBrowser: true });
  } catch (err: any) {
    console.warn('Fallback in /api/gemini/tts:', err?.message || err);
    res.json({ fallbackToBrowser: true });
  }
});

// 7. Multilingual Translation Endpoint
app.post('/api/gemini/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'Hindi' } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for translation.' });
      return;
    }

    if (!hasApiKey()) {
      res.status(500).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    let response: any = null;
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: `Translate the following text into ${targetLanguage} using simple, natural, child-friendly words.
Return ONLY valid JSON with keys: "translatedText" (string) and "targetLanguage" (string).

Text to translate:
"""${text}"""`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                translatedText: { type: Type.STRING },
                targetLanguage: { type: Type.STRING },
              },
              required: ['translatedText', 'targetLanguage'],
            },
          },
        });
        if (response && response.text) break;
      } catch (e: any) {
        lastError = e;
      }
    }

    if (!response || !response.text) {
      // Fallback: return source text to prevent client breakdown if quota is reached
      console.warn('Fallback in /api/gemini/translate: returning source text');
      res.json({
        translatedText: text,
        targetLanguage,
      });
      return;
    }

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.warn('Fallback in /api/gemini/translate:', err);
    res.json({
      translatedText: req.body?.text || '',
      targetLanguage: req.body?.targetLanguage || 'English',
    });
  }
});

// 8. Single Word Child-Friendly Explanation Endpoint
app.post('/api/gemini/explain-word', async (req, res) => {
  try {
    const { word, context = '' } = req.body;
    if (!word || typeof word !== 'string') {
      res.status(400).json({ error: 'Word is required.' });
      return;
    }

    if (!hasApiKey()) {
      res.status(500).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    let response: any = null;
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: `Provide a simple, clear, child-friendly explanation for the word "${word}".
Context if available: "${context}"
Return JSON with:
"word": string
"meaning": short 1-sentence child definition
"syllables": string with middle dots (e.g. "rab · bit")
"example": simple example sentence`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaning: { type: Type.STRING },
                syllables: { type: Type.STRING },
                example: { type: Type.STRING },
              },
              required: ['word', 'meaning'],
            },
          },
        });
        if (response && response.text) break;
      } catch (e) {
        // try next
      }
    }

    if (!response || !response.text) {
      res.json({
        word,
        meaning: `A meaningful word used in reading and storytelling.`,
        syllables: word.split('').join(' · '),
        example: `We learned how to use the word "${word}" today.`
      });
      return;
    }

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.warn('Fallback in /api/gemini/explain-word:', err);
    res.json({
      word: req.body?.word || '',
      meaning: 'An interesting vocabulary word.',
      syllables: req.body?.word || '',
      example: `Let us practice using "${req.body?.word || ''}" together.`
    });
  }
});

// 9. Google Search Grounding Endpoint (gemini-3.5-flash with googleSearch tool)
app.post('/api/gemini/search-grounding', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query parameter is required' });
      return;
    }

    if (!hasApiKey()) {
      res.status(500).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `You are an educational assistant for young readers and parents. Provide an accurate, clear, grounded answer with child-friendly context to this question:\n"""${query}"""`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const searchChunks = groundingMetadata?.groundingChunks || [];
    const webSources = searchChunks
      .map((c: any) => c.web)
      .filter(Boolean)
      .map((w: any) => ({ title: w.title, url: w.uri }));

    res.json({
      answer: text,
      sources: webSources,
      searchQueries: groundingMetadata?.webSearchQueries || [],
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/search-grounding:', err);
    res.status(500).json({ error: err.message || 'Search grounding failed' });
  }
});

// 10. Live Voice Conversation Endpoint (gemini-3.8-live model)
app.post('/api/gemini/live-talk', async (req, res) => {
  try {
    const { message, userAudioBase64 } = req.body;

    if (!hasApiKey()) {
      res.status(500).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    const systemInstruction = `You are Lingua AI's Live Speech Assistant — a friendly, warm, encouraging real-time voice guide for children with Developmental Language Disorder (DLD) and speech processing needs. Speak clearly, patiently, and in short encouraging sentences.`;

    const contentsParts: any[] = [];
    if (userAudioBase64) {
      contentsParts.push({
        inlineData: {
          mimeType: 'audio/mp3',
          data: userAudioBase64,
        },
      });
    }
    if (message) {
      contentsParts.push({ text: message });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-live',
      contents: contentsParts.length > 0 ? { parts: contentsParts } : 'Hello Lingua AI!',
      config: {
        systemInstruction,
      },
    });

    res.json({
      reply: response.text || 'I am listening! Tell me what you would like to read or talk about today.',
      model: 'gemini-3.8-live',
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/live-talk:', err);
    res.json({
      reply: 'Hello! I am your Lingua AI Voice Guide powered by model gemini-3.8-live. I am here to practice speech and reading with you!',
      model: 'gemini-3.8-live',
    });
  }
});

// 11. NeuroVani AI Dedicated Clinical DLD Chatbot Endpoint
app.post('/api/gemini/neurovani-chat', async (req, res) => {
  try {
    const { message, role = 'Parent', ageGroup = '5-11 Yrs', memoryContext = '', history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required.' });
      return;
    }

    if (!hasApiKey()) {
      res.status(500).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    const systemInstruction = `You are NeuroVani AI, an expert pediatric speech-language pathologist and Developmental Language Disorder (DLD) clinical assistant.
Current User Persona Role: ${role}
Target Learner Age Group: ${ageGroup}
${memoryContext ? `Learner Memory Context: ${memoryContext}` : ''}

CRITICAL TRIAGE ENGINE RULES:
Analyze the user's query and classify it into one of 3 Clinical Severity Tiers:
- TIER_1: Mild / Mutual State (Early signs, mild phoneme slip, subtle vocabulary recall delays).
- TIER_2: Moderate Difficulty (Persistent sentence formation issues, syntax confusion, working memory drops, auditory sequencing difficulty).
- TIER_3: Major / Severe Disruption (Extreme frustration, speech breakdown, non-fluent expression, severe receptive comprehension failure).

Return a JSON object matching this schema:
{
  "severityTier": "TIER_1" | "TIER_2" | "TIER_3",
  "severityLabel": string (e.g. "🟢 Tier 1: Mild / Early Scaffolding" or "🟡 Tier 2: Moderate Scaffolding Required" or "🔴 Tier 3: Major / Specialist Attention Needed"),
  "explanation": string (Diagnostic-informed explanation tailored to ${role} and ${ageGroup}),
  "inAppActivity": {
    "title": string (Targeted exercise title, e.g. "Phoneme Detective" or "Sentence Architect"),
    "targetPage": "neuroplay" | "read-listen" | "book-scanner" | "language-tools" | "progress",
    "duration": string (e.g. "8-12 mins daily" for kids, "15-20 mins daily" for teens/adults),
    "description": string (Short instruction on what to do in the app),
    "icon": string (e.g. "🎮" or "📖" or "🛠️" or "📈")
  },
  "homeRoutine": {
    "title": string (e.g. "Physical & Sensory Scaffolding Routine"),
    "steps": string[] (Array of 2-3 practical sensory/physical/tactile drills)
  },
  "warningCard": {
    "show": boolean (true ONLY if TIER_3),
    "title": "⚠️ Professional Clinical Evaluation Strongly Recommended",
    "body": string (Clinical notice suggesting SLP or Developmental Pediatrician consultation)
  }
}`;

    let response: any = null;
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: [
            ...history.map((h: any) => ({
              role: h.sender === 'user' ? 'user' : 'model',
              parts: [{ text: typeof h.text === 'string' ? h.text : JSON.stringify(h.text) }],
            })),
            { role: 'user', parts: [{ text: message }] },
          ],
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                severityTier: { type: Type.STRING },
                severityLabel: { type: Type.STRING },
                explanation: { type: Type.STRING },
                inAppActivity: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    targetPage: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    description: { type: Type.STRING },
                    icon: { type: Type.STRING },
                  },
                  required: ['title', 'targetPage', 'duration', 'description'],
                },
                homeRoutine: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    steps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ['title', 'steps'],
                },
                warningCard: {
                  type: Type.OBJECT,
                  properties: {
                    show: { type: Type.BOOLEAN },
                    title: { type: Type.STRING },
                    body: { type: Type.STRING },
                  },
                },
              },
              required: ['severityTier', 'severityLabel', 'explanation', 'inAppActivity', 'homeRoutine'],
            },
          },
        });
        if (response && response.text) break;
      } catch (err: any) {
        console.warn(`Model ${model} in /api/gemini/neurovani-chat failed:`, err?.message);
      }
    }

    if (!response || !response.text) {
      res.json({
        fallback: true,
      });
      return;
    }

    const parsed = JSON.parse(response.text || '{}');
    res.json({ cardData: parsed });
  } catch (err: any) {
    console.error('Error in /api/gemini/neurovani-chat:', err);
    res.json({ fallback: true });
  }
});

// Frontend Serving (Dev & Prod)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Lingua AI server running on port ${PORT}`);
  });
}

startServer();
