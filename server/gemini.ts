import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Intelligent fallback engines will be used.');
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return aiClient;
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

export interface CoachChatPayload {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  context: {
    goalTitle: string;
    goalWhy: string;
    targetDate: string;
    daysRemaining: number;
    currentPhase: string;
    dailyAvailableHours: number;
    todayTasks: { title: string; subject: string; status: string; durationMinutes: number }[];
    completedMinutesToday: number;
    currentStreak: number;
    recentMood?: string;
  };
}

export async function askNexusCoach(payload: CoachChatPayload): Promise<{ reply: string; suggestedAction?: any }> {
  const ai = getAIClient();
  const { message, history = [], context } = payload;

  const systemInstruction = `You are "NEXUS COACH" — an empathetic, intelligent, and highly practical personal goal navigator and accountability partner.
You are helping the user stay committed to their life-defining long-term goal: "${context.goalTitle}".
Their core reason WHY they started: "${context.goalWhy}".
Deadline: ${context.targetDate} (${context.daysRemaining} days remaining).
Current Phase: ${context.currentPhase}.
Daily time commitment: ${context.dailyAvailableHours} hours.
Today's progress: ${context.completedMinutesToday} minutes completed. Current active streak: ${context.currentStreak} days.
Recent mood/energy: ${context.recentMood || 'neutral'}.

YOUR PERSONALITY & RULES:
1. Speak with calm, grounded authority, supportive warmth, and zero fluff.
2. NEVER shame or guilt the user (e.g. if they say "I wasted the whole day" or "I don't feel like studying", validate their human experience, normalize it, and immediately offer ONE clear, low-friction micro-step to restart).
3. Do NOT sound like a generic cheerleader or robotic assistant. Sound like a world-class mentor who remembers their exact destination and why it matters.
4. Keep answers concise, actionable, and structured (typically 2-4 short punchy paragraphs or bullet points).
5. Always emphasize "The One Next Step" philosophy. When the user is overwhelmed or behind, simplify their world to the next 15-30 minutes.`;

  if (!ai) {
    // Intelligent fallback responses based on keywords
    return generateFallbackCoachResponse(message, context);
  }

  try {
    const formattedContents = [
      ...history.slice(-6).map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: formattedContents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm right here with you. Take a deep breath. What is the single smallest step we can take in the next 15 minutes?";
    return { reply };
  } catch (error) {
    console.error('Error in askNexusCoach Gemini call:', error);
    return generateFallbackCoachResponse(message, context);
  }
}

export async function getNextBestAction(context: any): Promise<any> {
  const ai = getAIClient();

  const unfinished = (context.todayTasks || []).filter((t: any) => t.status !== 'completed');
  const highestTask = unfinished[0] || {
    title: 'High-Yield Concept Review',
    subject: 'Core Subject',
    durationMinutes: 30,
  };

  if (!ai) {
    return {
      taskTitle: highestTask.title,
      subject: highestTask.subject || 'Priority Focus',
      durationMinutes: highestTask.durationMinutes || 45,
      rationale: `This is today's highest-leverage unfinished action for ${context.goalTitle}. Taking this single action locks in today's momentum.`,
      microAction: `Open your notes on ${highestTask.title} and focus for the first 10 minutes without judging your speed.`,
    };
  }

  try {
    const prompt = `Analyze this user's current goal situation and identify their SINGLE highest-value next action right now.
Goal: ${context.goalTitle}
Why: ${context.goalWhy}
Days Remaining: ${context.daysRemaining}
Remaining Tasks today: ${JSON.stringify(unfinished)}
Completed focus today: ${context.completedMinutesToday} min
Current local time / context: ${new Date().toLocaleTimeString()}

Return JSON with:
- taskTitle: string (specific, crisp action)
- subject: string
- durationMinutes: number (realistic, usually 25-50 min)
- rationale: string (1-2 sentences explaining why this specifically moves their North Star forward now)
- microAction: string (the exact 2-minute starting hook to eliminate friction)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            taskTitle: { type: Type.STRING },
            subject: { type: Type.STRING },
            durationMinutes: { type: Type.NUMBER },
            rationale: { type: Type.STRING },
            microAction: { type: Type.STRING },
          },
          required: ['taskTitle', 'subject', 'durationMinutes', 'rationale', 'microAction'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (err) {
    console.error('Error generating Next Best Action:', err);
    return {
      taskTitle: highestTask.title,
      subject: highestTask.subject || 'Priority Focus',
      durationMinutes: highestTask.durationMinutes || 45,
      rationale: `This is today's highest-leverage unfinished action for ${context.goalTitle}. Taking this single action locks in today's momentum.`,
      microAction: `Open your workspace and commit to just 10 minutes on ${highestTask.title}.`,
    };
  }
}

export async function generateJourneyPlan(goalInput: {
  title: string;
  why: string;
  targetDate: string;
  dailyHours: number;
  commitmentLevel: number;
}): Promise<any> {
  const ai = getAIClient();

  if (!ai) {
    return generateFallbackJourney(goalInput);
  }

  try {
    const prompt = `Generate a comprehensive, realistic multi-phase journey and Day 1 mission for this major long-term goal:
Goal: "${goalInput.title}"
Why: "${goalInput.why}"
Target Date: "${goalInput.targetDate}"
Daily Available Hours: ${goalInput.dailyHours} hours/day
Commitment: ${goalInput.commitmentLevel}/5

Create:
1. 4 to 6 logical sequential phases from start to achievement (e.g. Foundation, Depth/Syllabus, Practice, Mock Drills, Final Peak Revision).
2. Key milestones across the journey.
3. 3-5 high-yield Day 1 tasks tailored to their available time.
4. 3 measurable target outcomes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            outcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  durationWeeks: { type: Type.NUMBER },
                },
                required: ['name', 'description', 'durationWeeks'],
              },
            },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ['title', 'category'],
              },
            },
            day1Tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER },
                  priority: { type: Type.STRING },
                },
                required: ['title', 'subject', 'durationMinutes', 'priority'],
              },
            },
          },
          required: ['outcomes', 'phases', 'milestones', 'day1Tasks'],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('Error generating AI Journey:', err);
    return generateFallbackJourney(goalInput);
  }
}

export async function generateDriftRecovery(payload: {
  goalTitle: string;
  why: string;
  missedHours: number;
  reason?: string;
  availableHoursToday: number;
}): Promise<any> {
  const ai = getAIClient();

  if (!ai) {
    return {
      message: "You drifted. That's completely normal in any major journey. We are not going to double your workload or punish you. We start with a calm ramp-up.",
      rampUpDays: [
        { dayNumber: 1, recommendedMinutes: 90, focusAreas: ['One core foundational topic', '15 min quick review'] },
        { dayNumber: 2, recommendedMinutes: 135, focusAreas: ['High-priority subject drill', 'Summary flashcards'] },
        { dayNumber: 3, recommendedMinutes: 180, focusAreas: ['Balanced 2-subject blocks', 'Error log update'] },
        { dayNumber: 4, recommendedMinutes: 240, focusAreas: ['Standard full rhythm restored'] },
      ],
      immediateAction: "Take a 5-minute break to clear your desk, get water, and do 15 minutes of uninterrupted focus.",
    };
  }

  try {
    const prompt = `A user has drifted from their goal "${payload.goalTitle}".
Reason: "${payload.reason || 'Procrastination / Lost momentum'}".
Normal daily commitment: ${payload.availableHoursToday}h.
Generate a non-judgmental, psychologically safe 4-day realistic ramp-up recovery plan that does NOT overwork them, but gently restores momentum.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            immediateAction: { type: Type.STRING },
            rampUpDays: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.NUMBER },
                  recommendedMinutes: { type: Type.NUMBER },
                  focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['dayNumber', 'recommendedMinutes', 'focusAreas'],
              },
            },
          },
          required: ['message', 'immediateAction', 'rampUpDays'],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('Error generating Drift Recovery:', err);
    return {
      message: "You drifted. That's part of the journey. No guilt, no double-shifts. Let's restart with a simple, light session today.",
      rampUpDays: [
        { dayNumber: 1, recommendedMinutes: 90, focusAreas: ['One core topic', '15m review'] },
        { dayNumber: 2, recommendedMinutes: 140, focusAreas: ['Key chapter drill'] },
        { dayNumber: 3, recommendedMinutes: 180, focusAreas: ['Balanced focus'] },
        { dayNumber: 4, recommendedMinutes: 240, focusAreas: ['Full rhythm'] },
      ],
      immediateAction: "Reset right now with a 15-minute micro-session.",
    };
  }
}

// Fallback logic
function generateFallbackCoachResponse(message: string, context: any): { reply: string } {
  const lower = message.toLowerCase();

  if (lower.includes('wasted') || lower.includes('failed') || lower.includes('behind') || lower.includes('procrastinated')) {
    return {
      reply: `I hear you. The most important thing to know right now is: **the last few hours do not define your journey to ${context.goalTitle}.**

You don't need to compensate by studying for 10 hours straight tonight. That only leads to burnout.

Instead, let's win the next **20 minutes**. Pick one topic, set a timer, and put your phone in another room. Your North Star is still right where you left it.`,
    };
  }

  if (lower.includes("don't feel like") || lower.includes('no motivation') || lower.includes('lazy') || lower.includes('tired')) {
    return {
      reply: `Remember: **Motivation is an emotion; commitment is a decision.**

You started this because: *"${context.goalWhy}"*.

On days like today, you don't need to feel energetic. You only need to reduce the friction. Lower your target: commit to just **15 minutes** of reading or solving 5 simple questions. Often, once you start, momentum takes over.`,
    };
  }

  if (lower.includes('what should i do') || lower.includes('next')) {
    return {
      reply: `Right now, your highest-leverage action is to tackle **${context.todayTasks?.[0]?.title || 'your highest priority subject'}**. 

Dedicate 40 focused minutes. When that timer rings, you'll feel the mental shift immediately. Ready?`,
    };
  }

  if (lower.includes('scared') || lower.includes('fear') || lower.includes('what if i fail')) {
    return {
      reply: `It is completely natural to feel afraid when pursuing something as meaningful as ${context.goalTitle}. The fear just means this matters deeply to you.

Remember: you don't have to conquer the whole exam or destination today. You only have to win today's study block. Take one breath, anchor into your reason, and take the next step.`,
    };
  }

  return {
    reply: `You are on Day ${context.currentStreak || 1} of your path to **${context.goalTitle}**.

You have ${context.daysRemaining} days remaining. Consistency on ordinary days is what creates extraordinary outcomes.

What is on your mind right now, and how can I help you take the next step?`,
  };
}

function generateFallbackJourney(goalInput: { title: string; why: string; targetDate: string; dailyHours: number }): any {
  return {
    outcomes: [
      `Complete 100% syllabus for ${goalInput.title}`,
      `Achieve top-tier mastery & consistent high test scores`,
      `Build unbreakable daily study discipline`
    ],
    phases: [
      { name: 'Phase 1: Foundation & Core Concepts', description: 'Master fundamental syllabus principles and build routine', durationWeeks: 10 },
      { name: 'Phase 2: Depth & Syllabus Completion', description: 'Complete all chapter concepts and in-depth problem sets', durationWeeks: 14 },
      { name: 'Phase 3: High-Yield Question Drills', description: 'Intense past papers and speed/accuracy drills', durationWeeks: 8 },
      { name: 'Phase 4: Full Mock Tests & Diagnostics', description: 'Simulate full exams and eliminate recurring errors', durationWeeks: 6 },
      { name: 'Phase 5: Peak Revision & Final Readiness', description: 'Formula sheets, high-frequency revision, mental peak state', durationWeeks: 4 },
    ],
    milestones: [
      { title: 'Started Journey & Established North Star', category: 'Foundation' },
      { title: 'First 20 Hours of Deep Focus', category: 'Momentum' },
      { title: '7-Day Solid Consistency Streak', category: 'Habit' },
      { title: '50% Syllabus Diagnostic Complete', category: 'Milestone' },
      { title: 'First Full Mock Test Score', category: 'Exam' },
      { title: `🎯 Achieve ${goalInput.title}`, category: 'Destination' },
    ],
    day1Tasks: [
      { title: 'Core Concept Intro & Diagnostic Reading', subject: 'Core Topic 1', durationMinutes: 45, priority: 'high' },
      { title: 'Practice Problem Solving & Examples', subject: 'Core Topic 2', durationMinutes: 50, priority: 'high' },
      { title: 'Flashcards & Summary Notes Review', subject: 'Revision', durationMinutes: 30, priority: 'medium' },
      { title: 'Daily Check-In & Tomorrow Calibration', subject: 'Review', durationMinutes: 15, priority: 'low' },
    ],
  };
}
