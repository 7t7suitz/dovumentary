import { DocumentAnalysis, Theme, Character, ExtractedDate, NarrativeArc, EmotionalBeat, MetadataTag, DocumentSummary, InterviewQuestion, LegalConcern, CinematicAnalysis, TimelineEvent } from '../types/document';
import { format, parse, isValid } from 'date-fns';

export class DocumentAnalyzer {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static async analyzeDocument(filename: string, content: string): Promise<DocumentAnalysis> {
    const id = this.generateId();
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const themes = this.extractThemes(content);
    const characters = this.extractCharacters(content);
    const dates = this.extractDates(content);
    const narrativeArcs = this.analyzeNarrativeStructure(content);
    const emotionalBeats = this.analyzeEmotionalBeats(content);
    const metadata = this.generateMetadata(content, themes, characters);
    const summary = this.generateSummary(content, themes, characters);
    const interviewQuestions = this.generateInterviewQuestions(content, themes, characters);
    const legalConcerns = this.flagLegalConcerns(content);
    const cinematicPotential = this.analyzeCinematicPotential(content, narrativeArcs, emotionalBeats);

    return {
      id,
      filename,
      content,
      uploadDate: new Date(),
      themes,
      characters,
      dates,
      narrativeArcs,
      emotionalBeats,
      metadata,
      summary,
      relationships: [], // Will be populated when comparing with other documents
      interviewQuestions,
      legalConcerns,
      cinematicPotential
    };
  }

  private static extractThemes(content: string): Theme[] {
    const themeKeywords = {
      'Family': ['family', 'mother', 'father', 'parent', 'child', 'sibling', 'relative'],
      'Love': ['love', 'romance', 'relationship', 'marriage', 'partner', 'heart'],
      'Loss': ['death', 'loss', 'grief', 'mourning', 'funeral', 'goodbye'],
      'Journey': ['journey', 'travel', 'adventure', 'quest', 'path', 'destination'],
      'Conflict': ['war', 'fight', 'battle', 'struggle', 'conflict', 'opposition'],
      'Growth': ['growth', 'change', 'development', 'evolution', 'transformation'],
      'Identity': ['identity', 'self', 'who am i', 'belonging', 'culture', 'heritage'],
      'Justice': ['justice', 'fairness', 'right', 'wrong', 'law', 'court'],
      'Survival': ['survival', 'endure', 'overcome', 'persevere', 'resilience'],
      'Dreams': ['dream', 'aspiration', 'goal', 'ambition', 'hope', 'future']
    };

    const themes: Theme[] = [];
    const words = content.toLowerCase().split(/\s+/);

    Object.entries(themeKeywords).forEach(([themeName, keywords]) => {
      const occurrences = keywords.reduce((count, keyword) => {
        return count + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
      }, 0);

      if (occurrences > 0) {
        const contexts = keywords.flatMap(keyword => {
          const regex = new RegExp(`.{0,50}${keyword}.{0,50}`, 'gi');
          return content.match(regex) || [];
        }).slice(0, 3);

        themes.push({
          id: this.generateId(),
          name: themeName,
          confidence: Math.min(occurrences / 10, 1),
          occurrences,
          context: contexts,
          relevance: occurrences > 5 ? 'high' : occurrences > 2 ? 'medium' : 'low'
        });
      }
    });

    return themes.sort((a, b) => b.occurrences - a.occurrences);
  }

  private static extractCharacters(content: string): Character[] {
    // Simple name extraction - in real implementation, would use NLP
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const potentialNames = content.match(namePattern) || [];
    
    const characterCounts: { [key: string]: number } = {};
    potentialNames.forEach(name => {
      characterCounts[name] = (characterCounts[name] || 0) + 1;
    });

    const characters: Character[] = Object.entries(characterCounts)
      .filter(([_, count]) => count > 1)
      .map(([name, mentions]) => ({
        id: this.generateId(),
        name,
        role: this.inferCharacterRole(name, content),
        mentions,
        relationships: this.findCharacterRelationships(name, content),
        significance: mentions > 10 ? 'primary' : mentions > 5 ? 'secondary' : 'minor',
        emotionalArc: this.analyzeCharacterEmotionalArc(name, content)
      }))
      .sort((a, b) => b.mentions - a.mentions);

    return characters;
  }

  private static inferCharacterRole(name: string, content: string): string {
    const context = content.toLowerCase();
    const nameLower = name.toLowerCase();
    
    if (context.includes(`${nameLower} said`) || context.includes(`${nameLower} told`)) {
      return 'Narrator/Interviewee';
    }
    if (context.includes(`dr. ${nameLower}`) || context.includes(`doctor ${nameLower}`)) {
      return 'Medical Professional';
    }
    if (context.includes(`professor ${nameLower}`) || context.includes(`teacher ${nameLower}`)) {
      return 'Educator';
    }
    return 'Individual';
  }

  private static findCharacterRelationships(name: string, content: string): string[] {
    const relationships = [];
    const nameLower = name.toLowerCase();
    
    if (content.toLowerCase().includes(`${nameLower}'s wife`) || content.toLowerCase().includes(`${nameLower}'s husband`)) {
      relationships.push('Spouse');
    }
    if (content.toLowerCase().includes(`${nameLower}'s child`) || content.toLowerCase().includes(`${nameLower}'s son`) || content.toLowerCase().includes(`${nameLower}'s daughter`)) {
      relationships.push('Parent');
    }
    if (content.toLowerCase().includes(`${nameLower}'s friend`)) {
      relationships.push('Friend');
    }
    
    return relationships;
  }

  private static analyzeCharacterEmotionalArc(name: string, content: string): string {
    // Simplified emotional arc analysis
    const emotions = ['happy', 'sad', 'angry', 'hopeful', 'fearful', 'determined'];
    const nameLower = name.toLowerCase();
    
    const emotionalContexts = emotions.filter(emotion => 
      content.toLowerCase().includes(`${nameLower} was ${emotion}`) ||
      content.toLowerCase().includes(`${nameLower} felt ${emotion}`)
    );
    
    return emotionalContexts.length > 0 ? emotionalContexts.join(' → ') : 'Neutral';
  }

  private static extractDates(content: string): ExtractedDate[] {
    const datePatterns = [
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
      /\b\d{1,2}-\d{1,2}-\d{4}\b/g,
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
      /\b\d{4}\b/g
    ];

    const dates: ExtractedDate[] = [];
    
    datePatterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      matches.forEach(match => {
        const context = this.getDateContext(content, match);
        const dateObj = this.parseDate(match);
        
        if (dateObj && isValid(dateObj)) {
          dates.push({
            id: this.generateId(),
            date: dateObj,
            context,
            type: this.inferDateType(context),
            confidence: this.calculateDateConfidence(match, context),
            significance: this.assessDateSignificance(context)
          });
        }
      });
    });

    return dates.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private static getDateContext(content: string, dateStr: string): string {
    const index = content.indexOf(dateStr);
    const start = Math.max(0, index - 100);
    const end = Math.min(content.length, index + dateStr.length + 100);
    return content.substring(start, end);
  }

  private static parseDate(dateStr: string): Date | null {
    try {
      // Try different date formats
      const formats = ['MM/dd/yyyy', 'MM-dd-yyyy', 'MMMM dd, yyyy', 'yyyy'];
      
      for (const formatStr of formats) {
        try {
          const parsed = parse(dateStr, formatStr, new Date());
          if (isValid(parsed)) return parsed;
        } catch (e) {
          continue;
        }
      }
      
      // Fallback to native Date parsing
      const parsed = new Date(dateStr);
      return isValid(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  private static inferDateType(context: string): 'event' | 'birth' | 'death' | 'milestone' | 'reference' {
    const contextLower = context.toLowerCase();
    if (contextLower.includes('born') || contextLower.includes('birth')) return 'birth';
    if (contextLower.includes('died') || contextLower.includes('death') || contextLower.includes('passed')) return 'death';
    if (contextLower.includes('graduated') || contextLower.includes('married') || contextLower.includes('started')) return 'milestone';
    if (contextLower.includes('happened') || contextLower.includes('occurred')) return 'event';
    return 'reference';
  }

  private static calculateDateConfidence(dateStr: string, context: string): number {
    let confidence = 0.5;
    
    // More specific date formats get higher confidence
    if (dateStr.includes('/') || dateStr.includes('-')) confidence += 0.2;
    if (context.toLowerCase().includes('on ') || context.toLowerCase().includes('in ')) confidence += 0.2;
    if (dateStr.length > 4) confidence += 0.1;
    
    return Math.min(confidence, 1);
  }

  private static assessDateSignificance(context: string): 'high' | 'medium' | 'low' {
    const contextLower = context.toLowerCase();
    const highSignificanceWords = ['born', 'died', 'married', 'graduated', 'started', 'founded'];
    const mediumSignificanceWords = ['moved', 'met', 'began', 'ended'];
    
    if (highSignificanceWords.some(word => contextLower.includes(word))) return 'high';
    if (mediumSignificanceWords.some(word => contextLower.includes(word))) return 'medium';
    return 'low';
  }

  private static analyzeNarrativeStructure(content: string): NarrativeArc[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalLength = sentences.length;
    
    const arcs: NarrativeArc[] = [];
    
    // Simple narrative structure detection
    const expositionEnd = Math.floor(totalLength * 0.25);
    const risingActionEnd = Math.floor(totalLength * 0.75);
    const climaxEnd = Math.floor(totalLength * 0.85);
    
    arcs.push({
      id: this.generateId(),
      type: 'exposition',
      startPosition: 0,
      endPosition: expositionEnd,
      intensity: 0.3,
      description: 'Setting up the story and introducing key elements'
    });
    
    arcs.push({
      id: this.generateId(),
      type: 'rising_action',
      startPosition: expositionEnd,
      endPosition: risingActionEnd,
      intensity: 0.7,
      description: 'Building tension and developing the narrative'
    });
    
    arcs.push({
      id: this.generateId(),
      type: 'climax',
      startPosition: risingActionEnd,
      endPosition: climaxEnd,
      intensity: 1.0,
      description: 'Peak dramatic moment'
    });
    
    arcs.push({
      id: this.generateId(),
      type: 'resolution',
      startPosition: climaxEnd,
      endPosition: totalLength,
      intensity: 0.4,
      description: 'Concluding the narrative'
    });
    
    return arcs;
  }

  private static analyzeEmotionalBeats(content: string): EmotionalBeat[] {
    const emotionWords = {
      'joy': ['happy', 'joyful', 'excited', 'elated', 'cheerful', 'delighted'],
      'sadness': ['sad', 'depressed', 'melancholy', 'sorrowful', 'grief', 'mourning'],
      'anger': ['angry', 'furious', 'rage', 'mad', 'irritated', 'frustrated'],
      'fear': ['afraid', 'scared', 'terrified', 'anxious', 'worried', 'nervous'],
      'surprise': ['surprised', 'shocked', 'amazed', 'astonished', 'stunned'],
      'love': ['love', 'affection', 'adoration', 'devotion', 'caring'],
      'hope': ['hopeful', 'optimistic', 'confident', 'determined', 'inspired']
    };

    const beats: EmotionalBeat[] = [];
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach((sentence, index) => {
      const sentenceLower = sentence.toLowerCase();
      
      Object.entries(emotionWords).forEach(([emotion, words]) => {
        const matchedWords = words.filter(word => sentenceLower.includes(word));
        
        if (matchedWords.length > 0) {
          beats.push({
            id: this.generateId(),
            emotion,
            intensity: Math.min(matchedWords.length / 2, 1),
            position: index / sentences.length,
            context: sentence.trim(),
            duration: 1,
            triggers: matchedWords
          });
        }
      });
    });

    return beats.sort((a, b) => a.position - b.position);
  }

  private static generateMetadata(content: string, themes: Theme[], characters: Character[]): MetadataTag[] {
    const metadata: MetadataTag[] = [];
    
    // Add theme-based metadata
    themes.forEach(theme => {
      metadata.push({
        id: this.generateId(),
        category: 'theme',
        value: theme.name,
        confidence: theme.confidence,
        searchable: true
      });
    });
    
    // Add character-based metadata
    characters.forEach(character => {
      metadata.push({
        id: this.generateId(),
        category: 'character',
        value: character.name,
        confidence: 0.9,
        searchable: true
      });
    });
    
    // Add content-based metadata
    const wordCount = content.split(/\s+/).length;
    metadata.push({
      id: this.generateId(),
      category: 'statistics',
      value: `${wordCount} words`,
      confidence: 1.0,
      searchable: false
    });
    
    // Detect language and genre
    metadata.push({
      id: this.generateId(),
      category: 'language',
      value: 'English',
      confidence: 0.95,
      searchable: true
    });
    
    return metadata;
  }

  private static generateSummary(content: string, themes: Theme[], characters: Character[]): DocumentSummary {
    const wordCount = content.split(/\s+/).length;
    const primaryThemes = themes.filter(t => t.relevance === 'high').map(t => t.name);
    const primaryCharacters = characters.filter(c => c.significance === 'primary').map(c => c.name);
    
    const brief = `A ${wordCount}-word document focusing on ${primaryThemes.slice(0, 2).join(' and ')}${primaryCharacters.length > 0 ? `, featuring ${primaryCharacters.slice(0, 2).join(' and ')}` : ''}.`;
    
    const detailed = `This document explores themes of ${primaryThemes.join(', ')} through ${characters.length > 0 ? `the experiences of ${primaryCharacters.join(', ')} and others` : 'various perspectives'}. The narrative structure suggests strong potential for documentary adaptation, with clear emotional beats and character development.`;
    
    const cinematicPotential = this.calculateCinematicPotential(themes, characters, content);
    
    return {
      brief,
      detailed,
      cinematicPotential,
      keyPoints: this.extractKeyPoints(content),
      genre: this.inferGenre(themes),
      tone: this.analyzeTone(content),
      targetAudience: this.identifyTargetAudience(themes, content)
    };
  }

  private static calculateCinematicPotential(themes: Theme[], characters: Character[], content: string): number {
    let score = 0;
    
    // Theme diversity and relevance
    score += Math.min(themes.length * 0.1, 0.3);
    score += themes.filter(t => t.relevance === 'high').length * 0.1;
    
    // Character development
    score += Math.min(characters.length * 0.05, 0.2);
    score += characters.filter(c => c.significance === 'primary').length * 0.1;
    
    // Content richness
    const wordCount = content.split(/\s+/).length;
    score += Math.min(wordCount / 10000, 0.2);
    
    return Math.min(score, 1);
  }

  private static extractKeyPoints(content: string): string[] {
    // Simple key point extraction - look for sentences with strong indicators
    const sentences = content.split(/[.!?]+/);
    const keyIndicators = ['important', 'significant', 'crucial', 'key', 'main', 'primary', 'essential'];
    
    return sentences
      .filter(sentence => keyIndicators.some(indicator => sentence.toLowerCase().includes(indicator)))
      .slice(0, 5)
      .map(sentence => sentence.trim());
  }

  private static inferGenre(themes: Theme[]): string[] {
    const genreMap: { [key: string]: string[] } = {
      'Family': ['Family Drama', 'Biography'],
      'Love': ['Romance', 'Drama'],
      'Loss': ['Drama', 'Biography'],
      'Journey': ['Adventure', 'Travel'],
      'Conflict': ['War', 'Historical'],
      'Justice': ['Legal', 'Social Issues'],
      'Survival': ['Survival', 'Human Interest']
    };
    
    const genres = new Set<string>();
    themes.forEach(theme => {
      const themeGenres = genreMap[theme.name] || ['Documentary'];
      themeGenres.forEach(genre => genres.add(genre));
    });
    
    return Array.from(genres).slice(0, 3);
  }

  private static analyzeTone(content: string): string {
    const positiveWords = ['happy', 'joy', 'success', 'achievement', 'love', 'hope'];
    const negativeWords = ['sad', 'loss', 'death', 'failure', 'anger', 'fear'];
    const neutralWords = ['said', 'told', 'explained', 'described', 'mentioned'];
    
    const contentLower = content.toLowerCase();
    const positiveCount = positiveWords.reduce((count, word) => count + (contentLower.match(new RegExp(word, 'g')) || []).length, 0);
    const negativeCount = negativeWords.reduce((count, word) => count + (contentLower.match(new RegExp(word, 'g')) || []).length, 0);
    
    if (positiveCount > negativeCount * 1.5) return 'Optimistic';
    if (negativeCount > positiveCount * 1.5) return 'Somber';
    return 'Balanced';
  }

  private static identifyTargetAudience(themes: Theme[], content: string): string[] {
    const audiences = [];
    
    if (themes.some(t => t.name === 'Family')) audiences.push('General Audience');
    if (themes.some(t => t.name === 'Justice' || t.name === 'Conflict')) audiences.push('Social Issues Viewers');
    if (themes.some(t => t.name === 'Love')) audiences.push('Drama Enthusiasts');
    if (content.toLowerCase().includes('historical') || content.toLowerCase().includes('history')) audiences.push('History Buffs');
    
    return audiences.length > 0 ? audiences : ['General Audience'];
  }

  private static generateInterviewQuestions(content: string, themes: Theme[], characters: Character[]): InterviewQuestion[] {
    const questions: InterviewQuestion[] = [];
    
    // Theme-based questions
    themes.slice(0, 3).forEach(theme => {
      questions.push({
        id: this.generateId(),
        question: `Can you tell me more about how ${theme.name.toLowerCase()} played a role in this story?`,
        category: 'thematic',
        priority: theme.relevance === 'high' ? 'high' : 'medium',
        sensitivity: this.assessQuestionSensitivity(theme.name),
        followUpSuggestions: [
          `How did ${theme.name.toLowerCase()} affect the people involved?`,
          `What would you want others to understand about ${theme.name.toLowerCase()}?`
        ],
        basedOnContent: `Theme: ${theme.name} (${theme.occurrences} mentions)`
      });
    });
    
    // Character-based questions
    characters.slice(0, 2).forEach(character => {
      questions.push({
        id: this.generateId(),
        question: `What can you tell me about ${character.name} and their role in this story?`,
        category: 'personal',
        priority: character.significance === 'primary' ? 'high' : 'medium',
        sensitivity: 'medium',
        followUpSuggestions: [
          `How would you describe your relationship with ${character.name}?`,
          `What impact did ${character.name} have on the events?`
        ],
        basedOnContent: `Character: ${character.name} (${character.mentions} mentions)`
      });
    });
    
    // Contextual questions
    questions.push({
      id: this.generateId(),
      question: 'What details might not be obvious to someone hearing this story for the first time?',
      category: 'contextual',
      priority: 'high',
      sensitivity: 'low',
      followUpSuggestions: [
        'What context would help people understand the significance?',
        'Are there any misconceptions you\'d like to address?'
      ],
      basedOnContent: 'General context and background'
    });
    
    return questions;
  }

  private static assessQuestionSensitivity(themeName: string): 'low' | 'medium' | 'high' {
    const sensitiveThemes = ['Loss', 'Conflict', 'Justice'];
    const moderateThemes = ['Family', 'Identity'];
    
    if (sensitiveThemes.includes(themeName)) return 'high';
    if (moderateThemes.includes(themeName)) return 'medium';
    return 'low';
  }

  private static flagLegalConcerns(content: string): LegalConcern[] {
    const concerns: LegalConcern[] = [];
    const contentLower = content.toLowerCase();
    
    // Privacy concerns
    const phonePattern = /\b\d{3}-\d{3}-\d{4}\b/g;
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
    
    if (content.match(phonePattern)) {
      concerns.push({
        id: this.generateId(),
        type: 'privacy',
        severity: 'medium',
        description: 'Phone numbers detected in content',
        recommendation: 'Consider redacting or obtaining consent before publication',
        affectedContent: 'Phone number references'
      });
    }
    
    if (content.match(emailPattern)) {
      concerns.push({
        id: this.generateId(),
        type: 'privacy',
        severity: 'medium',
        description: 'Email addresses detected in content',
        recommendation: 'Consider redacting or obtaining consent before publication',
        affectedContent: 'Email address references'
      });
    }
    
    if (content.match(ssnPattern)) {
      concerns.push({
        id: this.generateId(),
        type: 'sensitive_info',
        severity: 'critical',
        description: 'Potential Social Security Numbers detected',
        recommendation: 'Immediately redact all SSN references',
        affectedContent: 'Social Security Number patterns'
      });
    }
    
    // Defamation concerns
    const defamatoryWords = ['accused', 'alleged', 'criminal', 'fraud', 'liar', 'corrupt'];
    const foundDefamatoryWords = defamatoryWords.filter(word => contentLower.includes(word));
    
    if (foundDefamatoryWords.length > 0) {
      concerns.push({
        id: this.generateId(),
        type: 'defamation',
        severity: 'high',
        description: 'Potentially defamatory language detected',
        recommendation: 'Review statements for factual accuracy and consider legal review',
        affectedContent: `Words: ${foundDefamatoryWords.join(', ')}`
      });
    }
    
    // Consent concerns
    if (contentLower.includes('minor') || contentLower.includes('child') || contentLower.includes('underage')) {
      concerns.push({
        id: this.generateId(),
        type: 'consent',
        severity: 'high',
        description: 'References to minors detected',
        recommendation: 'Ensure proper parental consent and consider privacy protections',
        affectedContent: 'Minor/child references'
      });
    }
    
    return concerns;
  }

  private static analyzeCinematicPotential(content: string, narrativeArcs: NarrativeArc[], emotionalBeats: EmotionalBeat[]): CinematicAnalysis {
    const visualPotential = this.assessVisualPotential(content);
    const dramaticTension = this.assessDramaticTension(narrativeArcs, emotionalBeats);
    const characterDevelopment = this.assessCharacterDevelopment(content);
    const narrativeStructure = this.assessNarrativeStructure(narrativeArcs);
    const emotionalImpact = this.assessEmotionalImpact(emotionalBeats);
    
    const overallScore = (visualPotential + dramaticTension + characterDevelopment + narrativeStructure + emotionalImpact) / 5;
    
    const recommendations = this.generateCinematicRecommendations(overallScore, {
      visualPotential,
      dramaticTension,
      characterDevelopment,
      narrativeStructure,
      emotionalImpact
    });
    
    return {
      visualPotential,
      dramaticTension,
      characterDevelopment,
      narrativeStructure,
      emotionalImpact,
      overallScore,
      recommendations
    };
  }

  private static assessVisualPotential(content: string): number {
    const visualWords = ['see', 'look', 'watch', 'view', 'scene', 'image', 'picture', 'color', 'light', 'shadow'];
    const contentLower = content.toLowerCase();
    const visualCount = visualWords.reduce((count, word) => count + (contentLower.match(new RegExp(word, 'g')) || []).length, 0);
    
    return Math.min(visualCount / 20, 1);
  }

  private static assessDramaticTension(narrativeArcs: NarrativeArc[], emotionalBeats: EmotionalBeat[]): number {
    const climaxArc = narrativeArcs.find(arc => arc.type === 'climax');
    const highIntensityBeats = emotionalBeats.filter(beat => beat.intensity > 0.7);
    
    let score = 0;
    if (climaxArc) score += climaxArc.intensity * 0.5;
    score += Math.min(highIntensityBeats.length / 5, 0.5);
    
    return Math.min(score, 1);
  }

  private static assessCharacterDevelopment(content: string): number {
    const developmentWords = ['changed', 'grew', 'learned', 'realized', 'became', 'transformed'];
    const contentLower = content.toLowerCase();
    const developmentCount = developmentWords.reduce((count, word) => count + (contentLower.match(new RegExp(word, 'g')) || []).length, 0);
    
    return Math.min(developmentCount / 10, 1);
  }

  private static assessNarrativeStructure(narrativeArcs: NarrativeArc[]): number {
    // Check for complete narrative structure
    const hasExposition = narrativeArcs.some(arc => arc.type === 'exposition');
    const hasRisingAction = narrativeArcs.some(arc => arc.type === 'rising_action');
    const hasClimax = narrativeArcs.some(arc => arc.type === 'climax');
    const hasResolution = narrativeArcs.some(arc => arc.type === 'resolution');
    
    const structureScore = [hasExposition, hasRisingAction, hasClimax, hasResolution].filter(Boolean).length / 4;
    return structureScore;
  }

  private static assessEmotionalImpact(emotionalBeats: EmotionalBeat[]): number {
    if (emotionalBeats.length === 0) return 0;
    
    const averageIntensity = emotionalBeats.reduce((sum, beat) => sum + beat.intensity, 0) / emotionalBeats.length;
    const emotionVariety = new Set(emotionalBeats.map(beat => beat.emotion)).size;
    
    return Math.min((averageIntensity + emotionVariety / 10), 1);
  }

  private static generateCinematicRecommendations(overallScore: number, scores: any): string[] {
    const recommendations = [];
    
    if (overallScore > 0.8) {
      recommendations.push('Excellent cinematic potential - strong candidate for documentary adaptation');
    } else if (overallScore > 0.6) {
      recommendations.push('Good cinematic potential with some areas for enhancement');
    } else {
      recommendations.push('Moderate cinematic potential - consider additional story development');
    }
    
    if (scores.visualPotential < 0.5) {
      recommendations.push('Consider adding more visual descriptions and scene-setting details');
    }
    
    if (scores.dramaticTension < 0.5) {
      recommendations.push('Enhance dramatic tension through conflict development and pacing');
    }
    
    if (scores.characterDevelopment < 0.5) {
      recommendations.push('Develop character arcs and transformation stories');
    }
    
    if (scores.emotionalImpact < 0.5) {
      recommendations.push('Strengthen emotional beats and audience connection points');
    }
    
    return recommendations;
  }

  static generateTimelineEvents(documents: DocumentAnalysis[]): TimelineEvent[] {
    const events: TimelineEvent[] = [];
    
    documents.forEach(doc => {
      doc.dates.forEach(date => {
        events.push({
          id: this.generateId(),
          date: date.date,
          title: this.generateEventTitle(date),
          description: date.context,
          type: date.type,
          importance: date.significance === 'high' ? 1 : date.significance === 'medium' ? 0.7 : 0.4,
          documentId: doc.id,
          characters: doc.characters.map(c => c.name),
          themes: doc.themes.map(t => t.name)
        });
      });
    });
    
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private static generateEventTitle(date: ExtractedDate): string {
    switch (date.type) {
      case 'birth': return 'Birth Event';
      case 'death': return 'Death Event';
      case 'milestone': return 'Milestone Event';
      case 'event': return 'Significant Event';
      default: return 'Timeline Event';
    }
  }

  static findDocumentRelationships(documents: DocumentAnalysis[]): void {
    documents.forEach(doc => {
      doc.relationships = [];
      
      documents.forEach(otherDoc => {
        if (doc.id === otherDoc.id) return;
        
        const relationship = this.calculateRelationship(doc, otherDoc);
        if (relationship.strength > 0.3) {
          doc.relationships.push(relationship);
        }
      });
    });
  }

  private static calculateRelationship(doc1: DocumentAnalysis, doc2: DocumentAnalysis): any {
    const sharedCharacters = doc1.characters.filter(c1 => 
      doc2.characters.some(c2 => c2.name === c1.name)
    ).map(c => c.name);
    
    const sharedThemes = doc1.themes.filter(t1 => 
      doc2.themes.some(t2 => t2.name === t1.name)
    ).map(t => t.name);
    
    const chronologicalOverlap = this.calculateChronologicalOverlap(doc1.dates, doc2.dates);
    
    let strength = 0;
    let relationshipType = 'thematic';
    let sharedElements: string[] = [];
    
    if (sharedCharacters.length > 0) {
      strength += sharedCharacters.length * 0.3;
      relationshipType = 'character';
      sharedElements = [...sharedElements, ...sharedCharacters];
    }
    
    if (sharedThemes.length > 0) {
      strength += sharedThemes.length * 0.2;
      sharedElements = [...sharedElements, ...sharedThemes];
    }
    
    if (chronologicalOverlap > 0) {
      strength += chronologicalOverlap * 0.4;
      if (relationshipType === 'thematic') relationshipType = 'chronological';
    }
    
    return {
      id: this.generateId(),
      relatedDocumentId: doc2.id,
      relationshipType,
      strength: Math.min(strength, 1),
      description: this.generateRelationshipDescription(relationshipType, sharedElements),
      sharedElements
    };
  }

  private static calculateChronologicalOverlap(dates1: ExtractedDate[], dates2: ExtractedDate[]): number {
    if (dates1.length === 0 || dates2.length === 0) return 0;
    
    const range1 = { 
      start: Math.min(...dates1.map(d => d.date.getTime())), 
      end: Math.max(...dates1.map(d => d.date.getTime())) 
    };
    const range2 = { 
      start: Math.min(...dates2.map(d => d.date.getTime())), 
      end: Math.max(...dates2.map(d => d.date.getTime())) 
    };
    
    const overlapStart = Math.max(range1.start, range2.start);
    const overlapEnd = Math.min(range1.end, range2.end);
    
    if (overlapStart >= overlapEnd) return 0;
    
    const overlapDuration = overlapEnd - overlapStart;
    const totalDuration = Math.max(range1.end - range1.start, range2.end - range2.start);
    
    return overlapDuration / totalDuration;
  }

  private static generateRelationshipDescription(type: string, sharedElements: string[]): string {
    switch (type) {
      case 'character':
        return `Documents share characters: ${sharedElements.slice(0, 3).join(', ')}`;
      case 'chronological':
        return `Documents cover overlapping time periods`;
      case 'thematic':
        return `Documents share themes: ${sharedElements.slice(0, 3).join(', ')}`;
      default:
        return 'Documents have related content';
    }
  }
}