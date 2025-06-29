import { 
  InterviewQuestion, 
  QuestionCategory, 
  Priority, 
  SensitivityLevel, 
  DifficultyLevel,
  InterviewTemplate,
  InterviewStyle,
  DocumentAnalysis,
  ConversationFlow,
  FollowUpSuggestion,
  EmotionalTone,
  QuestionContext,
  CulturalAdaptation
} from '../types/interview';

export class InterviewAI {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static async analyzeDocument(filename: string, content: string): Promise<DocumentAnalysis> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const themes = this.extractThemes(content);
    const characters = this.extractCharacters(content);
    const sensitiveTopics = this.identifySensitiveTopics(content);
    const culturalContext = this.analyzeCulturalContext(content);
    const timelineEvents = this.extractTimelineEvents(content);
    const emotionalMarkers = this.identifyEmotionalMarkers(content);
    const factualClaims = this.extractFactualClaims(content);
    const relationships = this.mapRelationships(content, characters);

    return {
      id: this.generateId(),
      filename,
      content,
      themes,
      characters,
      sensitiveTopics,
      culturalContext,
      timelineEvents,
      emotionalMarkers,
      factualClaims,
      relationships
    };
  }

  private static extractThemes(content: string): string[] {
    const themeKeywords = {
      'Family Dynamics': ['family', 'parent', 'child', 'sibling', 'relative', 'household'],
      'Loss & Grief': ['death', 'loss', 'grief', 'mourning', 'funeral', 'passed away'],
      'Trauma & Recovery': ['trauma', 'abuse', 'recovery', 'healing', 'therapy', 'ptsd'],
      'Identity & Heritage': ['identity', 'culture', 'heritage', 'tradition', 'belonging'],
      'Social Justice': ['discrimination', 'inequality', 'justice', 'rights', 'activism'],
      'Love & Relationships': ['love', 'marriage', 'relationship', 'romance', 'partnership'],
      'Career & Achievement': ['career', 'job', 'achievement', 'success', 'professional'],
      'Health & Wellness': ['health', 'illness', 'medical', 'mental health', 'wellness'],
      'Migration & Displacement': ['immigration', 'refugee', 'displacement', 'migration'],
      'War & Conflict': ['war', 'conflict', 'violence', 'military', 'combat']
    };

    const themes: string[] = [];
    const contentLower = content.toLowerCase();

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      const matches = keywords.filter(keyword => contentLower.includes(keyword));
      if (matches.length >= 2) {
        themes.push(theme);
      }
    });

    return themes;
  }

  private static extractCharacters(content: string): string[] {
    // Simple name extraction - in production would use NLP
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const names = content.match(namePattern) || [];
    
    // Count occurrences and filter by frequency
    const nameCounts: { [key: string]: number } = {};
    names.forEach(name => {
      nameCounts[name] = (nameCounts[name] || 0) + 1;
    });

    return Object.entries(nameCounts)
      .filter(([_, count]) => count > 1)
      .map(([name, _]) => name)
      .slice(0, 10);
  }

  private static identifySensitiveTopics(content: string): string[] {
    const sensitiveKeywords = {
      'Sexual Abuse': ['sexual abuse', 'rape', 'assault', 'molestation'],
      'Domestic Violence': ['domestic violence', 'abuse', 'beating', 'violence at home'],
      'Mental Health Crisis': ['suicide', 'self-harm', 'depression', 'mental breakdown'],
      'Substance Abuse': ['addiction', 'alcoholism', 'drug abuse', 'overdose'],
      'Child Abuse': ['child abuse', 'neglect', 'child endangerment'],
      'Discrimination': ['racism', 'sexism', 'homophobia', 'discrimination'],
      'Financial Hardship': ['poverty', 'homeless', 'bankruptcy', 'financial crisis'],
      'Legal Issues': ['arrest', 'prison', 'criminal', 'legal trouble'],
      'Medical Trauma': ['terminal illness', 'medical malpractice', 'chronic pain'],
      'Religious Trauma': ['religious abuse', 'cult', 'spiritual abuse']
    };

    const topics: string[] = [];
    const contentLower = content.toLowerCase();

    Object.entries(sensitiveKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => contentLower.includes(keyword))) {
        topics.push(topic);
      }
    });

    return topics;
  }

  private static analyzeCulturalContext(content: string): string[] {
    const culturalMarkers = {
      'Latino/Hispanic': ['latino', 'hispanic', 'mexican', 'spanish', 'familia'],
      'African American': ['african american', 'black', 'soul food', 'church'],
      'Asian': ['asian', 'chinese', 'japanese', 'korean', 'vietnamese'],
      'Middle Eastern': ['middle eastern', 'arab', 'muslim', 'islamic'],
      'Indigenous': ['native american', 'indigenous', 'tribal', 'reservation'],
      'Jewish': ['jewish', 'hebrew', 'synagogue', 'kosher', 'shabbat'],
      'LGBTQ+': ['gay', 'lesbian', 'transgender', 'queer', 'pride'],
      'Rural': ['farm', 'rural', 'countryside', 'small town'],
      'Urban': ['city', 'urban', 'metropolitan', 'downtown'],
      'Military': ['military', 'veteran', 'army', 'navy', 'marines']
    };

    const contexts: string[] = [];
    const contentLower = content.toLowerCase();

    Object.entries(culturalMarkers).forEach(([context, markers]) => {
      if (markers.some(marker => contentLower.includes(marker))) {
        contexts.push(context);
      }
    });

    return contexts;
  }

  private static extractTimelineEvents(content: string): any[] {
    // Simplified timeline extraction
    const datePattern = /\b\d{4}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi;
    const dates = content.match(datePattern) || [];
    
    return dates.slice(0, 10).map(date => ({
      date,
      event: `Event on ${date}`,
      significance: 'medium' as Priority,
      emotionalWeight: 0.5
    }));
  }

  private static identifyEmotionalMarkers(content: string): any[] {
    const emotionalKeywords = {
      'trauma': ['traumatic', 'devastating', 'horrific', 'nightmare'],
      'joy': ['happy', 'joyful', 'celebration', 'wonderful'],
      'loss': ['lost', 'died', 'gone', 'missing'],
      'achievement': ['proud', 'accomplished', 'success', 'achievement'],
      'conflict': ['fight', 'argument', 'conflict', 'disagreement'],
      'love': ['love', 'adore', 'cherish', 'devoted']
    };

    const markers: any[] = [];
    const contentLower = content.toLowerCase();

    Object.entries(emotionalKeywords).forEach(([type, keywords]) => {
      keywords.forEach(keyword => {
        if (contentLower.includes(keyword)) {
          markers.push({
            topic: keyword,
            intensity: Math.random() * 0.5 + 0.5,
            type,
            context: `Context around "${keyword}"`
          });
        }
      });
    });

    return markers.slice(0, 15);
  }

  private static extractFactualClaims(content: string): any[] {
    // Simplified factual claim extraction
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    return sentences.slice(0, 10).map(claim => ({
      claim: claim.trim(),
      confidence: Math.random() * 0.4 + 0.6,
      needsVerification: Math.random() > 0.7,
      sources: []
    }));
  }

  private static mapRelationships(content: string, characters: string[]): any[] {
    const relationships: any[] = [];
    
    characters.forEach((char1, i) => {
      characters.slice(i + 1).forEach(char2 => {
        if (content.includes(char1) && content.includes(char2)) {
          relationships.push({
            person1: char1,
            person2: char2,
            relationship: 'Unknown',
            significance: 'medium' as Priority,
            emotionalDynamics: ['Complex']
          });
        }
      });
    });

    return relationships.slice(0, 8);
  }

  static generateQuestions(analysis: DocumentAnalysis, template: InterviewTemplate): InterviewQuestion[] {
    const questions: InterviewQuestion[] = [];
    let order = 1;

    // Generate opening questions
    questions.push(...this.generateOpeningQuestions(analysis, order));
    order += questions.length;

    // Generate theme-based questions
    analysis.themes.forEach(theme => {
      questions.push(...this.generateThemeQuestions(theme, analysis, order));
      order += 2;
    });

    // Generate character-based questions
    analysis.characters.slice(0, 3).forEach(character => {
      questions.push(...this.generateCharacterQuestions(character, analysis, order));
      order += 2;
    });

    // Generate sensitive topic questions
    analysis.sensitiveTopics.forEach(topic => {
      questions.push(...this.generateSensitiveQuestions(topic, analysis, order));
      order += 1;
    });

    // Generate timeline questions
    if (analysis.timelineEvents.length > 0) {
      questions.push(...this.generateTimelineQuestions(analysis, order));
      order += 3;
    }

    // Generate closing questions
    questions.push(...this.generateClosingQuestions(analysis, order));

    return this.optimizeQuestionOrder(questions, template);
  }

  private static generateOpeningQuestions(analysis: DocumentAnalysis, startOrder: number): InterviewQuestion[] {
    return [
      {
        id: this.generateId(),
        question: "Could you start by telling me a bit about yourself and what brings you here today?",
        category: 'personal',
        priority: 'critical',
        sensitivity: 'low',
        difficulty: 'easy',
        estimatedTime: 3,
        followUpSuggestions: [
          "What would you like people to understand about your story?",
          "Is there anything you'd like to clarify before we begin?"
        ],
        basedOnContent: 'Opening rapport building',
        culturalConsiderations: ['Allow extra time for relationship building in collectivist cultures'],
        tags: ['opening', 'rapport', 'introduction'],
        order: startOrder,
        isRequired: true,
        alternatives: [
          "Thank you for sharing your time with me. How are you feeling about this conversation?",
          "I appreciate you being here. What's most important for you to share today?"
        ],
        context: {
          documentSource: analysis.filename,
          relatedThemes: [],
          suggestedTiming: 'opening',
          prerequisites: [],
          warningFlags: []
        }
      }
    ];
  }

  private static generateThemeQuestions(theme: string, analysis: DocumentAnalysis, startOrder: number): InterviewQuestion[] {
    const sensitivity = this.assessThemeSensitivity(theme);
    const questions: InterviewQuestion[] = [];

    questions.push({
      id: this.generateId(),
      question: `I noticed that ${theme.toLowerCase()} seems to be an important part of your story. Could you tell me more about that?`,
      category: 'contextual',
      priority: 'high',
      sensitivity,
      difficulty: 'moderate',
      estimatedTime: 5,
      followUpSuggestions: this.generateThemeFollowUps(theme),
      basedOnContent: `Theme: ${theme}`,
      culturalConsiderations: this.getCulturalConsiderations(theme, analysis.culturalContext),
      tags: ['theme', theme.toLowerCase().replace(/\s+/g, '-')],
      order: startOrder,
      isRequired: false,
      alternatives: [
        `How has ${theme.toLowerCase()} shaped your experience?`,
        `What role has ${theme.toLowerCase()} played in your life?`
      ],
      context: {
        documentSource: analysis.filename,
        relatedThemes: [theme],
        suggestedTiming: 'middle',
        prerequisites: ['rapport established'],
        warningFlags: sensitivity === 'high' ? ['sensitive topic'] : []
      }
    });

    return questions;
  }

  private static generateCharacterQuestions(character: string, analysis: DocumentAnalysis, startOrder: number): InterviewQuestion[] {
    return [
      {
        id: this.generateId(),
        question: `Can you tell me about ${character} and their role in your story?`,
        category: 'relationship',
        priority: 'medium',
        sensitivity: 'medium',
        difficulty: 'moderate',
        estimatedTime: 4,
        followUpSuggestions: [
          `How would you describe your relationship with ${character}?`,
          `What impact did ${character} have on the events you've described?`,
          `Is there something about ${character} that others might not understand?`
        ],
        basedOnContent: `Character: ${character}`,
        culturalConsiderations: ['Be mindful of family hierarchy in traditional cultures'],
        tags: ['character', 'relationship'],
        order: startOrder,
        isRequired: false,
        alternatives: [
          `What was ${character} like as a person?`,
          `How did ${character} influence your experience?`
        ],
        context: {
          documentSource: analysis.filename,
          relatedThemes: [],
          suggestedTiming: 'middle',
          prerequisites: [],
          warningFlags: []
        }
      }
    ];
  }

  private static generateSensitiveQuestions(topic: string, analysis: DocumentAnalysis, startOrder: number): InterviewQuestion[] {
    return [
      {
        id: this.generateId(),
        question: this.craftSensitiveQuestion(topic),
        category: 'emotional',
        priority: 'high',
        sensitivity: 'high',
        difficulty: 'difficult',
        estimatedTime: 8,
        followUpSuggestions: [
          "Take your time with this. There's no pressure to share more than you're comfortable with.",
          "How are you feeling right now? Do you need a moment?",
          "What would you want others to understand about this experience?"
        ],
        basedOnContent: `Sensitive topic: ${topic}`,
        culturalConsiderations: [
          'Approach with extreme cultural sensitivity',
          'Consider trauma-informed interviewing techniques',
          'Be prepared to pause or redirect if needed'
        ],
        tags: ['sensitive', 'trauma-informed', topic.toLowerCase().replace(/\s+/g, '-')],
        order: startOrder,
        isRequired: false,
        alternatives: [
          "If you're comfortable sharing, could you help me understand this part of your experience?",
          "This seems like it might be difficult to talk about. How would you like to approach this?"
        ],
        context: {
          documentSource: analysis.filename,
          relatedThemes: [topic],
          suggestedTiming: 'late',
          prerequisites: ['strong rapport', 'consent confirmed'],
          warningFlags: ['trauma risk', 'emotional intensity', 'potential retraumatization']
        }
      }
    ];
  }

  private static generateTimelineQuestions(analysis: DocumentAnalysis, startOrder: number): InterviewQuestion[] {
    return [
      {
        id: this.generateId(),
        question: "Could you help me understand the timeline of these events? What happened first?",
        category: 'timeline',
        priority: 'medium',
        sensitivity: 'low',
        difficulty: 'moderate',
        estimatedTime: 6,
        followUpSuggestions: [
          "What was happening in your life around that time?",
          "How did one event lead to another?",
          "Looking back, what stands out most about that period?"
        ],
        basedOnContent: 'Timeline events from document',
        culturalConsiderations: ['Some cultures have different concepts of linear time'],
        tags: ['timeline', 'chronology', 'sequence'],
        order: startOrder,
        isRequired: false,
        alternatives: [
          "Can you walk me through how these events unfolded?",
          "What was the sequence of events as you remember them?"
        ],
        context: {
          documentSource: analysis.filename,
          relatedThemes: [],
          suggestedTiming: 'middle',
          prerequisites: [],
          warningFlags: []
        }
      }
    ];
  }

  private static generateClosingQuestions(analysis: DocumentAnalysis, startOrder: number): InterviewQuestion[] {
    return [
      {
        id: this.generateId(),
        question: "As we wrap up, is there anything important that we haven't talked about that you'd like to share?",
        category: 'reflection',
        priority: 'high',
        sensitivity: 'low',
        difficulty: 'easy',
        estimatedTime: 4,
        followUpSuggestions: [
          "What would you want people to take away from your story?",
          "How are you feeling about our conversation today?",
          "Is there anything you'd like to add or clarify?"
        ],
        basedOnContent: 'Closing and reflection',
        culturalConsiderations: ['Allow time for proper closure in relationship-focused cultures'],
        tags: ['closing', 'reflection', 'wrap-up'],
        order: startOrder,
        isRequired: true,
        alternatives: [
          "What haven't I asked that you think is important?",
          "What would you like people to understand most about your experience?"
        ],
        context: {
          documentSource: analysis.filename,
          relatedThemes: [],
          suggestedTiming: 'closing',
          prerequisites: [],
          warningFlags: []
        }
      }
    ];
  }

  private static assessThemeSensitivity(theme: string): SensitivityLevel {
    const highSensitivity = ['Loss & Grief', 'Trauma & Recovery', 'Social Justice'];
    const mediumSensitivity = ['Family Dynamics', 'Identity & Heritage', 'Health & Wellness'];
    
    if (highSensitivity.includes(theme)) return 'high';
    if (mediumSensitivity.includes(theme)) return 'medium';
    return 'low';
  }

  private static generateThemeFollowUps(theme: string): string[] {
    const followUps: { [key: string]: string[] } = {
      'Family Dynamics': [
        "How would you describe your family relationships?",
        "What role did family play in this situation?",
        "How has your family changed over time?"
      ],
      'Loss & Grief': [
        "How did this loss affect you?",
        "What helped you through this difficult time?",
        "How do you remember them now?"
      ],
      'Identity & Heritage': [
        "How important is your cultural background to this story?",
        "What traditions or values influenced your decisions?",
        "How do you see yourself in relation to your community?"
      ]
    };

    return followUps[theme] || [
      "Can you elaborate on that?",
      "What was that experience like for you?",
      "How did that affect you?"
    ];
  }

  private static getCulturalConsiderations(theme: string, culturalContext: string[]): string[] {
    const considerations: string[] = [];
    
    if (culturalContext.includes('Latino/Hispanic')) {
      considerations.push('Consider the importance of family honor and collective identity');
    }
    if (culturalContext.includes('Asian')) {
      considerations.push('Be mindful of concepts of face and indirect communication styles');
    }
    if (culturalContext.includes('Indigenous')) {
      considerations.push('Respect traditional storytelling approaches and community consent');
    }
    
    return considerations;
  }

  private static craftSensitiveQuestion(topic: string): string {
    const sensitiveQuestions: { [key: string]: string } = {
      'Sexual Abuse': "I understand this may be very difficult to discuss. If you're comfortable, could you help me understand what happened, at whatever level of detail feels right for you?",
      'Domestic Violence': "This sounds like it was a very challenging and potentially dangerous situation. Would you be willing to share what that experience was like for you?",
      'Mental Health Crisis': "It sounds like you went through a very difficult time with your mental health. If you're comfortable, could you help me understand what that was like?",
      'Substance Abuse': "Addiction affects so many families. If you're willing to share, what was that experience like for you and your loved ones?"
    };

    return sensitiveQuestions[topic] || "This seems like it might be a difficult topic. How would you like to approach talking about this?";
  }

  private static optimizeQuestionOrder(questions: InterviewQuestion[], template: InterviewTemplate): InterviewQuestion[] {
    // Sort by suggested timing and sensitivity
    return questions.sort((a, b) => {
      const timingOrder = { 'opening': 1, 'early': 2, 'middle': 3, 'late': 4, 'closing': 5 };
      const aOrder = timingOrder[a.context.suggestedTiming];
      const bOrder = timingOrder[b.context.suggestedTiming];
      
      if (aOrder !== bOrder) return aOrder - bOrder;
      
      // Within same timing, put less sensitive questions first
      const sensitivityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'extreme': 4 };
      return sensitivityOrder[a.sensitivity] - sensitivityOrder[b.sensitivity];
    });
  }

  static generateFollowUpSuggestions(
    currentQuestion: string, 
    previousAnswer: string, 
    conversationState: any
  ): FollowUpSuggestion[] {
    const suggestions: FollowUpSuggestion[] = [];
    
    // Analyze emotional content of answer
    const emotionalWords = ['sad', 'happy', 'angry', 'scared', 'proud', 'ashamed'];
    const detectedEmotions = emotionalWords.filter(emotion => 
      previousAnswer.toLowerCase().includes(emotion)
    );

    if (detectedEmotions.length > 0) {
      suggestions.push({
        question: `You mentioned feeling ${detectedEmotions[0]}. Can you tell me more about that?`,
        reasoning: 'Following up on emotional content',
        sensitivity: 'medium',
        category: 'emotional',
        timing: 'immediate'
      });
    }

    // Check for incomplete thoughts
    if (previousAnswer.includes('...') || previousAnswer.endsWith('but')) {
      suggestions.push({
        question: "It sounds like there might be more to that story. Would you like to continue?",
        reasoning: 'Incomplete thought detected',
        sensitivity: 'low',
        category: 'contextual',
        timing: 'immediate'
      });
    }

    // Check for new characters mentioned
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const newNames = previousAnswer.match(namePattern) || [];
    if (newNames.length > 0) {
      suggestions.push({
        question: `You mentioned ${newNames[0]}. Could you tell me about them?`,
        reasoning: 'New character introduced',
        sensitivity: 'low',
        category: 'relationship',
        timing: 'after-pause'
      });
    }

    return suggestions;
  }

  static assessConversationFlow(questions: InterviewQuestion[], timeElapsed: number): any {
    const totalEstimatedTime = questions.reduce((sum, q) => sum + q.estimatedTime, 0);
    const questionsAsked = questions.filter(q => q.order <= timeElapsed / 5).length;
    
    return {
      pacing: timeElapsed / totalEstimatedTime,
      coverage: questionsAsked / questions.length,
      recommendations: this.generateFlowRecommendations(timeElapsed, questionsAsked, questions)
    };
  }

  private static generateFlowRecommendations(timeElapsed: number, questionsAsked: number, questions: InterviewQuestion[]): string[] {
    const recommendations: string[] = [];
    
    if (timeElapsed > 60 && questionsAsked < questions.length * 0.5) {
      recommendations.push("Consider picking up the pace - you're covering questions slowly");
    }
    
    if (questionsAsked > questions.length * 0.8 && timeElapsed < 45) {
      recommendations.push("You're moving quickly - consider allowing more time for detailed responses");
    }
    
    const sensitiveQuestionsRemaining = questions
      .slice(questionsAsked)
      .filter(q => q.sensitivity === 'high' || q.sensitivity === 'extreme');
    
    if (sensitiveQuestionsRemaining.length > 0 && timeElapsed > 45) {
      recommendations.push("Sensitive topics remain - ensure adequate time and emotional space");
    }
    
    return recommendations;
  }

  static getInterviewTemplates(): InterviewTemplate[] {
    return [
      {
        id: 'documentary',
        name: 'Documentary Interview',
        description: 'Comprehensive storytelling approach for documentary filmmaking',
        style: 'documentary',
        duration: 90,
        questionCategories: ['personal', 'contextual', 'emotional', 'timeline', 'reflection'],
        culturalAdaptations: [],
        structure: {
          opening: ['personal'],
          body: ['contextual', 'timeline', 'emotional'],
          closing: ['reflection'],
          transitionSuggestions: [
            "Let's talk about...",
            "I'd like to understand more about...",
            "Can you help me picture..."
          ]
        }
      },
      {
        id: 'trauma-informed',
        name: 'Trauma-Informed Interview',
        description: 'Sensitive approach for survivors and those with traumatic experiences',
        style: 'trauma-informed',
        duration: 120,
        questionCategories: ['personal', 'background', 'emotional', 'reflection'],
        culturalAdaptations: [],
        structure: {
          opening: ['personal', 'background'],
          body: ['emotional'],
          closing: ['reflection'],
          transitionSuggestions: [
            "When you're ready...",
            "If you're comfortable sharing...",
            "Take your time with this..."
          ]
        }
      },
      {
        id: 'oral-history',
        name: 'Oral History',
        description: 'Comprehensive life story documentation',
        style: 'oral-history',
        duration: 180,
        questionCategories: ['background', 'timeline', 'contextual', 'personal', 'reflection'],
        culturalAdaptations: [],
        structure: {
          opening: ['background'],
          body: ['timeline', 'contextual', 'personal'],
          closing: ['reflection'],
          transitionSuggestions: [
            "Tell me about the time when...",
            "What was it like growing up...",
            "How did things change when..."
          ]
        }
      }
    ];
  }
}