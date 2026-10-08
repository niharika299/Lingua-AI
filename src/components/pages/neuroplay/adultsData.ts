// Dataset for Tier 3: Adults (18+ Years)
// 8 real-world functional exercises per module

export const ADULT_VOCAB_EXERCISES = [
  {
    id: 1,
    informal: 'I can\'t do this work right now, I\'m too busy.',
    executive: 'I will prioritize this initiative in Q2 to ensure thorough execution alongside our current commitments.',
    options: [
      { id: 'a', text: 'I will prioritize this initiative in Q2 to ensure thorough execution alongside our current commitments.', isExecutive: true },
      { id: 'b', text: 'I am too busy today, ask someone else.', isExecutive: false },
      { id: 'c', text: 'Forget about this task for now.', isExecutive: false },
    ],
    explanation: 'Executive tone reframes unavailability as strategic scheduling.',
  },
  {
    id: 2,
    informal: 'You made a huge mistake on the financial report.',
    executive: 'Let\'s align on the updated financial metrics to ensure complete accuracy before stakeholder review.',
    options: [
      { id: 'a', text: 'Let\'s align on the updated financial metrics to ensure complete accuracy before stakeholder review.', isExecutive: true },
      { id: 'b', text: 'Your report is full of wrong numbers.', isExecutive: false },
      { id: 'c', text: 'Fix your mistake immediately.', isExecutive: false },
    ],
    explanation: 'Polite corporate phrasing focuses on constructive alignment rather than blame.',
  },
  {
    id: 3,
    informal: 'I forgot to send the email attachment.',
    executive: 'Please find the supplementary document attached for your reference.',
    options: [
      { id: 'a', text: 'Please find the supplementary document attached for your reference.', isExecutive: true },
      { id: 'b', text: 'Oops, I forgot the file in my previous email.', isExecutive: false },
      { id: 'c', text: 'Here is what I missed earlier.', isExecutive: false },
    ],
    explanation: 'Clean professional phrasing delivers the missing information smoothly.',
  },
  {
    id: 4,
    informal: 'I don\'t understand what you want me to do.',
    executive: 'Could you please clarify the specific deliverables and scope so I can align my workflow accordingly?',
    options: [
      { id: 'a', text: 'Could you please clarify the specific deliverables and scope so I can align my workflow accordingly?', isExecutive: true },
      { id: 'b', text: 'Your instructions make no sense at all.', isExecutive: false },
      { id: 'c', text: 'What are you talking about?', isExecutive: false },
    ],
    explanation: 'Executive inquiry requests clarity while showing eagerness to execute.',
  },
  {
    id: 5,
    informal: 'This meeting is a waste of time.',
    executive: 'To maximize productivity, let\'s distill our remaining action items into key decision points.',
    options: [
      { id: 'a', text: 'To maximize productivity, let\'s distill our remaining action items into key decision points.', isExecutive: true },
      { id: 'b', text: 'Why are we sitting in this useless meeting?', isExecutive: false },
      { id: 'c', text: 'I am leaving this call now.', isExecutive: false },
    ],
    explanation: 'Constructive meeting management steers the conversation toward concrete outcomes.',
  },
  {
    id: 6,
    informal: 'I need a higher salary.',
    executive: 'Based on my recent contributions and expanded project ownership, I would like to review my compensation structure.',
    options: [
      { id: 'a', text: 'Based on my recent contributions and expanded project ownership, I would like to review my compensation structure.', isExecutive: true },
      { id: 'b', text: 'Give me a raise because prices are going up.', isExecutive: false },
      { id: 'c', text: 'Pay me more or I will resign.', isExecutive: false },
    ],
    explanation: 'Data-driven compensation discussions highlight value creation.',
  },
  {
    id: 7,
    informal: 'That idea won\'t work.',
    executive: 'I foresee potential operational constraints with that approach; let\'s explore an alternative framework.',
    options: [
      { id: 'a', text: 'I foresee potential operational constraints with that approach; let\'s explore an alternative framework.', isExecutive: true },
      { id: 'b', text: 'That idea is terrible and won\'t work.', isExecutive: false },
      { id: 'c', text: 'No way we are doing that.', isExecutive: false },
    ],
    explanation: 'Reframing objections as "operational constraints" maintains professional rapport.',
  },
  {
    id: 8,
    informal: 'I want to quit this project.',
    executive: 'I recommend reallocating my bandwidth to core strategic initiatives where my skill set delivers maximum ROI.',
    options: [
      { id: 'a', text: 'I recommend reallocating my bandwidth to core strategic initiatives where my skill set delivers maximum ROI.', isExecutive: true },
      { id: 'b', text: 'I am tired of working on this project.', isExecutive: false },
      { id: 'c', text: 'Assign someone else, I am out.', isExecutive: false },
    ],
    explanation: 'Bandwidth reallocation focuses on organizational ROI.',
  },
];

export const ADULT_DOC_EXERCISES = [
  {
    id: 1,
    title: 'Document 1: Residential Lease Agreement Clause 14',
    text: '"Tenant shall give sixty (60) days written notice prior to lease expiration. Failure to submit notice incurs automatic month-to-month renewal at a 15% rate escalation."',
    prompt: 'Identify key legal takeaway:',
    answer: 'Tenant must submit written notice 60 days in advance to avoid automatic renewal with a 15% rent increase.',
  },
  {
    id: 2,
    title: 'Document 2: Commercial Electricity Bill Summary',
    text: '"Peak demand charges apply between 2 PM and 8 PM weekdays at $0.24/kWh. Off-peak rates are $0.09/kWh. Late payment fee of 5% applies after the 15th of the month."',
    prompt: 'Identify key financial takeaway:',
    answer: 'Shift high energy usage away from 2 PM - 8 PM peak hours to reduce bill by over 60%, and pay before the 15th.',
  },
  {
    id: 3,
    title: 'Document 3: Non-Disclosure Agreement (NDA) Scope',
    text: '"Recipient agrees not to disclose Proprietary IP for a period of three (3) years post-termination. Exclusions include information independently known prior to disclosure or mandated by court order."',
    prompt: 'Identify key legal scope:',
    answer: 'Confidentiality obligations remain active for 3 years after leaving the company, unless ordered by a court.',
  },
  {
    id: 4,
    title: 'Document 4: Medical Prescription Dosage Guide',
    text: '"Take 1 tablet (500mg) twice daily with meals for 10 consecutive days. Do not combine with dairy products within 2 hours of administration. Complete full course even if symptoms subside."',
    prompt: 'Identify key health instruction:',
    answer: 'Take twice daily with meals, avoid milk/dairy 2 hours before/after, and complete all 10 days.',
  },
  {
    id: 5,
    title: 'Document 5: Employment Offer Probation Clause',
    text: '"Employee is subject to a 90-day probationary evaluation. Health insurance coverage commences on the 1st day of the calendar month following 30 days of continuous employment."',
    prompt: 'Identify key HR benefit timeline:',
    answer: 'Probation lasts 90 days; health insurance starts on the 1st of the month after 30 days of employment.',
  },
  {
    id: 6,
    title: 'Document 6: Bank Loan Fixed vs Floating Interest Clause',
    text: '"Fixed interest rate of 8.5% is guaranteed for initial 24 months, after which loan transitions automatically to floating benchmark repo rate + 2.25% spread."',
    prompt: 'Identify key financial transition:',
    answer: 'Rate is locked at 8.5% for 2 years, then adjusts dynamically based on bank repo rates + 2.25%.',
  },
  {
    id: 7,
    title: 'Document 7: Health Insurance Claim Co-Pay Terms',
    text: '"In-network hospitalizations require a 10% co-payment. Out-of-network facilities require a 30% co-payment and mandatory pre-authorization within 24 hours of admission."',
    prompt: 'Identify key insurance requirement:',
    answer: 'In-network saves 20% in co-pay; emergency out-of-network claims require notification within 24 hours.',
  },
  {
    id: 8,
    title: 'Document 8: Tax Audit Compliance Notice',
    text: '"Taxpayer must provide supporting receipts for claimed business travel deductions above $500 within 30 calendar days of receipt of this notice to prevent assessment penalties."',
    prompt: 'Identify key tax audit requirement:',
    answer: 'Submit travel expense receipts over $500 within 30 days to avoid penalty fines.',
  },
];

export const ADULT_EMAIL_EXERCISES = [
  {
    id: 1,
    rawEmail: 'Hey John, why haven\'t you sent the report yet? We are waiting and client is mad.',
    polishedEmail: 'Dear John,\n\nFollowing up on our project timeline for the client status report. Please let us know the estimated completion time so we can update the client accordingly.\n\nBest regards,',
    prompt: 'Transform into executive corporate correspondence:',
  },
  {
    id: 2,
    rawEmail: 'I won\'t come to office tomorrow. Feeling sick.',
    polishedEmail: 'Dear Team,\n\nI am feeling unwell today and will be taking a sick leave. I will monitor emails intermittently for urgent matters. Please reach out to Sarah for ongoing project support.\n\nBest regards,',
    prompt: 'Polish formal leave notification:',
  },
  {
    id: 3,
    rawEmail: 'Your budget numbers are wrong. Change them now.',
    polishedEmail: 'Dear Finance Team,\n\nUpon reviewing the Q3 budget allocation, I noticed a discrepancy in line item 4. Could we schedule a quick 10-minute sync to review and adjust these figures?\n\nBest regards,',
    prompt: 'Polish constructive feedback email:',
  },
  {
    id: 4,
    rawEmail: 'I cannot attend your meeting at 4 PM.',
    polishedEmail: 'Dear Team,\n\nThank you for the invitation. Due to a prior calendar conflict at 4 PM, I am unable to attend. I will review the meeting minutes and follow up on assigned action items.\n\nBest regards,',
    prompt: 'Polish professional meeting decline:',
  },
  {
    id: 5,
    rawEmail: 'Thanks for the quick call.',
    polishedEmail: 'Dear Alex,\n\nThank you for your time today. As discussed, I will draft the project proposal by Thursday EOD and circulate it for leadership review.\n\nBest regards,',
    prompt: 'Polish post-call confirmation email:',
  },
  {
    id: 6,
    rawEmail: 'We need more money to finish this software project.',
    polishedEmail: 'Dear Steering Committee,\n\nTo accommodate the expanded security scope, we request a budget adjustment of $15,000. This investment will ensure compliance and robust delivery.\n\nBest regards,',
    prompt: 'Polish budget request proposal:',
  },
  {
    id: 7,
    rawEmail: 'Sorry for late reply.',
    polishedEmail: 'Dear Client,\n\nThank you for your patience. I have reviewed your inquiry and attached the detailed technical specifications below.\n\nBest regards,',
    prompt: 'Polish client response email:',
  },
  {
    id: 8,
    rawEmail: 'Can you give me feedback on my work?',
    polishedEmail: 'Dear Supervisor,\n\nI would appreciate your feedback on my performance during the Q2 product launch to identify areas for growth and strategic alignment.\n\nBest regards,',
    prompt: 'Polish review request email:',
  },
];

export const ADULT_SOCIAL_EXERCISES = [
  {
    id: 1,
    scenario: 'In a performance review, your director critiques your presentation structure. How do you respond professionally?',
    options: [
      { id: 'a', text: '"Thank you for the feedback. Could you highlight specific slides where adding data visuals would enhance clarity?"', isCorrect: true },
      { id: 'b', text: '"You don\'t understand how much effort I put into those slides!"', isCorrect: false },
      { id: 'c', text: 'Remain silent and look upset for the rest of the meeting.', isCorrect: false },
    ],
    explanation: 'Active listening and seeking specific actionable details turns criticism into growth.',
  },
  {
    id: 2,
    scenario: 'Two department leads disagree heatedly during a budget allocation meeting. How do you de-escalate?',
    options: [
      { id: 'a', text: '"Let\'s list our shared priorities first, then evaluate remaining funds against projected ROI for both teams."', isCorrect: true },
      { id: 'b', text: '"You two need to stop arguing right now!"', isCorrect: false },
      { id: 'c', text: 'Pick one side and yell at the other department lead.', isCorrect: false },
    ],
    explanation: 'De-escalation anchors disagreement to shared objective criteria.',
  },
  {
    id: 3,
    scenario: 'A client calls angrily claiming a deliverable is late, even though the deadline is tomorrow. How do you respond?',
    options: [
      { id: 'a', text: '"I understand your urgency. As per our agreed milestone chart, delivery is scheduled for tomorrow 5 PM. I will send a preview draft today."', isCorrect: true },
      { id: 'b', text: '"Read the contract! Tomorrow is the deadline, stop calling me!"', isCorrect: false },
      { id: 'c', text: 'Hang up the phone immediately.', isCorrect: false },
    ],
    explanation: 'Reassuring tone combined with clear contractual facts resolves client anxiety.',
  },
  {
    id: 4,
    scenario: 'Your manager asks you to take on an urgent project, but your capacity is completely full. How do you decline politely?',
    options: [
      { id: 'a', text: '"I am eager to assist. Currently my bandwidth is full with Project X. Which of these two tasks should I deprioritize?"', isCorrect: true },
      { id: 'b', text: '"No way, I am already overworked!"', isCorrect: false },
      { id: 'c', text: 'Accept the work and fail to deliver both projects.', isCorrect: false },
    ],
    explanation: 'Framing capacity around trade-offs empowers leadership to prioritize effectively.',
  },
  {
    id: 5,
    scenario: 'A junior team member makes a mistake on a client invoice. How do you handle coaching?',
    options: [
      { id: 'a', text: 'Private 1-on-1: "Let\'s review the invoice workflow together so you know how to catch this discrepancy next time."', isCorrect: true },
      { id: 'b', text: 'Reprimand them publicly in the team Slack channel.', isCorrect: false },
      { id: 'c', text: 'Fix it quietly without telling them, so they never learn.', isCorrect: false },
    ],
    explanation: 'Private coaching preserves dignity while building competency.',
  },
  {
    id: 6,
    scenario: 'You missed a deadline due to unexpected vendor delays. How do you communicate to stakeholders?',
    options: [
      { id: 'a', text: 'Proactive update: "Due to vendor delay, our new completion date is Friday. Here is our mitigation plan to avoid future risk."', isCorrect: true },
      { id: 'b', text: 'Wait until stakeholders ask, then blame the vendor.', isCorrect: false },
      { id: 'c', text: 'Pretend the project was completed on time.', isCorrect: false },
    ],
    explanation: 'Proactive ownership with mitigation plans maintains stakeholder trust.',
  },
  {
    id: 7,
    scenario: 'In a company town hall, an executive mispronounces your team\'s achievement. How do you handle it?',
    options: [
      { id: 'a', text: 'Let the town hall proceed, then gently clarify in a follow-up email summary.', isCorrect: true },
      { id: 'b', text: 'Interrupt the executive mid-speech to correct them loudly.', isCorrect: false },
      { id: 'c', text: 'Complain bitterly to colleagues after the meeting.', isCorrect: false },
    ],
    explanation: 'Tactful follow-up respects public decorum while maintaining accurate records.',
  },
  {
    id: 8,
    scenario: 'You are onboarding a new team member who seems overwhelmed by documentation. How do you support them?',
    options: [
      { id: 'a', text: 'Break the onboarding guide into 3 daily milestone checklists and schedule a 15-minute daily Q&A sync.', isCorrect: true },
      { id: 'b', text: 'Tell them: "Read all 200 pages by tomorrow."', isCorrect: false },
      { id: 'c', text: 'Leave them to figure it out on their own.', isCorrect: false },
    ],
    explanation: 'Structured chunking accelerates onboarding comprehension.',
  },
];

export const ADULT_PHONOLOGY_TERMS = [
  { term: 'Entrepreneurship', syllables: 'En-tre-pre-neur-ship (5)', stress: 'Stress on "neur"', audioPrompt: 'En-tre-pre-neur-ship' },
  { term: 'Sustainability', syllables: 'Sus-tain-a-bil-i-ty (6)', stress: 'Stress on "bil"', audioPrompt: 'Sus-tain-a-bil-i-ty' },
  { term: 'Multidisciplinary', syllables: 'Mul-ti-dis-ci-pli-nar-y (7)', stress: 'Stress on "nar"', audioPrompt: 'Mul-ti-dis-ci-pli-nar-y' },
  { term: 'Implementation', syllables: 'Im-ple-men-ta-tion (5)', stress: 'Stress on "ta"', audioPrompt: 'Im-ple-men-ta-tion' },
  { term: 'Organizational', syllables: 'Or-gan-i-za-tion-al (6)', stress: 'Stress on "za"', audioPrompt: 'Or-gan-i-za-tion-al' },
  { term: 'Synchronization', syllables: 'Syn-chro-ni-za-tion (5)', stress: 'Stress on "za"', audioPrompt: 'Syn-chro-ni-za-tion' },
  { term: 'Infrastructural', syllables: 'In-fra-struc-tur-al (5)', stress: 'Stress on "struc"', audioPrompt: 'In-fra-struc-tur-al' },
  { term: 'Interoperability', syllables: 'In-ter-op-er-a-bil-i-ty (8)', stress: 'Stress on "bil"', audioPrompt: 'In-ter-op-er-a-bil-i-ty' },
];

export const ADULT_MEMORY_WORKFLOWS = [
  {
    id: 1,
    title: 'Executive Task Mnemonic 1: S.M.A.R.T. Goal Coding',
    mnemonic: 'S.M.A.R.T. = Specific, Measurable, Achievable, Relevant, Time-bound',
    prompt: 'Recall the 5 components of SMART goals in sequence:',
    options: [
      { id: 'a', text: 'Specific, Measurable, Achievable, Relevant, Time-bound', isCorrect: true },
      { id: 'b', text: 'Simple, Fast, Active, Real, Tough', isCorrect: false },
      { id: 'c', text: 'Slow, Medium, Average, Rapid, Total', isCorrect: false },
    ],
  },
  {
    id: 2,
    title: 'Executive Task Mnemonic 2: P.D.C.A. Quality Cycle',
    mnemonic: 'P.D.C.A. = Plan, Do, Check, Act',
    prompt: 'Recall the 4 stages of PDCA continuous improvement cycle:',
    options: [
      { id: 'a', text: 'Plan, Do, Check, Act', isCorrect: true },
      { id: 'b', text: 'Prepare, Delay, Cancel, Audit', isCorrect: false },
      { id: 'c', text: 'Pay, Deliver, Charge, Accept', isCorrect: false },
    ],
  },
  {
    id: 3,
    title: 'Executive Task Mnemonic 3: R.A.C.I. Matrix Alignment',
    mnemonic: 'R.A.C.I. = Responsible, Accountable, Consulted, Informed',
    prompt: 'Recall the 4 RACI governance roles:',
    options: [
      { id: 'a', text: 'Responsible, Accountable, Consulted, Informed', isCorrect: true },
      { id: 'b', text: 'Random, Active, Creative, Independent', isCorrect: false },
      { id: 'c', text: 'Review, Approve, Cancel, Inspect', isCorrect: false },
    ],
  },
  {
    id: 4,
    title: 'Executive Task Mnemonic 4: S.W.O.T. Strategic Analysis',
    mnemonic: 'S.W.O.T. = Strengths, Weaknesses, Opportunities, Threats',
    prompt: 'Recall the 4 SWOT analysis quadrants:',
    options: [
      { id: 'a', text: 'Strengths, Weaknesses, Opportunities, Threats', isCorrect: true },
      { id: 'b', text: 'Sales, Work, Output, Targets', isCorrect: false },
      { id: 'c', text: 'Speed, Weight, Order, Time', isCorrect: false },
    ],
  },
  {
    id: 5,
    title: 'Executive Task Mnemonic 5: S.T.A.R. Interview Framework',
    mnemonic: 'S.T.A.R. = Situation, Task, Action, Result',
    prompt: 'Recall the 4 STAR behavioral response steps:',
    options: [
      { id: 'a', text: 'Situation, Task, Action, Result', isCorrect: true },
      { id: 'b', text: 'Start, Try, Ask, Repeat', isCorrect: false },
      { id: 'c', text: 'Speech, Tone, Accent, Rate', isCorrect: false },
    ],
  },
  {
    id: 6,
    title: 'Executive Task Mnemonic 6: O.O.D.A. Decision Loop',
    mnemonic: 'O.O.D.A. = Observe, Orient, Decide, Act',
    prompt: 'Recall the 4 OODA rapid decision-making steps:',
    options: [
      { id: 'a', text: 'Observe, Orient, Decide, Act', isCorrect: true },
      { id: 'b', text: 'Open, Organize, Draft, Analyze', isCorrect: false },
      { id: 'c', text: 'Offer, Order, Discount, Acquire', isCorrect: false },
    ],
  },
  {
    id: 7,
    title: 'Executive Task Mnemonic 7: P.E.S.T. Environmental Scan',
    mnemonic: 'P.E.S.T. = Political, Economic, Social, Technological',
    prompt: 'Recall the 4 PEST macro-environmental factors:',
    options: [
      { id: 'a', text: 'Political, Economic, Social, Technological', isCorrect: true },
      { id: 'b', text: 'People, Energy, Speed, Time', isCorrect: false },
      { id: 'c', text: 'Price, Export, Storage, Tax', isCorrect: false },
    ],
  },
  {
    id: 8,
    title: 'Executive Task Mnemonic 8: K.P.I. Performance Metrics',
    mnemonic: 'K.P.I. = Key Performance Indicator',
    prompt: 'Recall the meaning of KPI:',
    options: [
      { id: 'a', text: 'Key Performance Indicator', isCorrect: true },
      { id: 'b', text: 'Knowledge Process Integration', isCorrect: false },
      { id: 'c', text: 'Kept Private Information', isCorrect: false },
    ],
  },
];

export const ADULT_DISCOURSE_EXERCISES = [
  {
    id: 1,
    title: 'Elevator Pitch 1: AI Accessibility Platform 🚀',
    steps: [
      { label: 'Hook', text: 'Over 7% of children suffer from Developmental Language Disorder, often misdiagnosed as cognitive deficit.' },
      { label: 'Solution', text: 'Lingua AI provides real-time speech scaffolding, visual chunking, and camera OCR to boost reading confidence.' },
      { label: 'Call to Action', text: 'We are seeking clinic partners to deploy our assistive software across 50 regional schools.' },
    ],
  },
  {
    id: 2,
    title: 'Elevator Pitch 2: Renewable Energy Micro-Grid ☀️',
    steps: [
      { label: 'Hook', text: 'Rural clinics lose power during monsoon storms, endangering vaccine refrigeration.' },
      { label: 'Solution', text: 'Our modular solar micro-grids deliver 24/7 uninterrupted power with zero diesel emissions.' },
      { label: 'Call to Action', text: 'Join us in powering 100 rural healthcare centers this fiscal year.' },
    ],
  },
  {
    id: 3,
    title: 'Elevator Pitch 3: Tele-Speech Pathology App 🩺',
    steps: [
      { label: 'Hook', text: 'Families in remote areas wait up to 14 months for a licensed Speech Language Pathologist evaluation.' },
      { label: 'Solution', text: 'Our app connects families directly with certified SLPs for async home therapy guidance.' },
      { label: 'Call to Action', text: 'Partner with us to expand pediatric care accessibility.' },
    ],
  },
  {
    id: 4,
    title: 'Elevator Pitch 4: Eco-Packaging Logistics 📦',
    steps: [
      { label: 'Hook', text: 'E-commerce shipping generates millions of tons of single-use plastic waste daily.' },
      { label: 'Solution', text: 'We manufacture 100% biodegradable seaweed-based mailers that decompose in 30 days.' },
      { label: 'Call to Action', text: 'Switch your enterprise shipping to zero-waste packaging today.' },
    ],
  },
  {
    id: 5,
    title: 'Elevator Pitch 5: Workplace Mental Wellness 🧠',
    steps: [
      { label: 'Hook', text: 'Employee burnout accounts for over $300 billion in lost corporate productivity annually.' },
      { label: 'Solution', text: 'Our app offers guided micro-breaks and stress de-escalation tools integrated into Slack.' },
      { label: 'Call to Action', text: 'Schedule a pilot program for your team this quarter.' },
    ],
  },
  {
    id: 6,
    title: 'Elevator Pitch 6: Urban Rooftop Farming 🌿',
    steps: [
      { label: 'Hook', text: 'Metropolitan cities import 90% of fresh produce from hundreds of miles away.' },
      { label: 'Solution', text: 'We transform unused commercial rooftops into high-yield hydroponic organic farms.' },
      { label: 'Call to Action', text: 'Invest in localized sustainable food security.' },
    ],
  },
  {
    id: 7,
    title: 'Elevator Pitch 7: Cyber-Security Awareness Training 🔒',
    steps: [
      { label: 'Hook', text: '95% of corporate data breaches stem from human error and phishing email traps.' },
      { label: 'Solution', text: 'Our interactive gamified drills train employees to spot digital threats in under 3 minutes a week.' },
      { label: 'Call to Action', text: 'Fortify your company\'s digital defense today.' },
    ],
  },
  {
    id: 8,
    title: 'Elevator Pitch 8: Clean Water Filtration Pods 💧',
    steps: [
      { label: 'Hook', text: 'Contaminated drinking water causes severe health issues in underprivileged communities.' },
      { label: 'Solution', text: 'Our low-cost gravity filtration pods remove 99.9% of pathogens without electricity.' },
      { label: 'Call to Action', text: 'Help us bring clean water to 10,000 households.' },
    ],
  },
];
