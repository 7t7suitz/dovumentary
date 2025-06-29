import { StoryAnalysis, NarrativeStructure, PlotPoint, CharacterAnalysis, PacingAnalysis, StoryGap, StructuralSuggestion, Synopsis, Logline, GenreAnalysis, StoryVisualization, StructureType } from '../types/story';

export class StoryAnalyzer {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static async analyzeStory(title: string, content: string): Promise<StoryAnalysis> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const structure = this.analyzeNarrativeStructure(content);
    const plotPoints = this.identifyPlotPoints(content, structure.type);
    const characters = this.analyzeCharacters(content);
    const pacing = this.analyzePacing(content, structure);
    const gaps = this.identifyStoryGaps(content, plotPoints, characters);
    const suggestions = this.generateSuggestions(structure, plotPoints, characters, pacing, gaps);
    const synopsis = this.generateSynopsis(content, characters, plotPoints);
    const loglines = this.generateLoglines(content, characters, plotPoints);
    const genre = this.analyzeGenre(content, plotPoints, characters);
    const visualData = this.generateVisualizationData(structure, plotPoints, characters, pacing);

    return {
      id: this.generateId(),
      title,
      content,
      uploadDate: new Date(),
      structure,
      plotPoints,
      characters,
      pacing,
      gaps,
      suggestions,
      synopsis,
      loglines,
      genre,
      visualData
    };
  }

  private static analyzeNarrativeStructure(content: string): NarrativeStructure {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalLength = sentences.length;
    
    // Detect structure type based on content patterns
    const structureType = this.detectStructureType(content);
    const acts = this.identifyActs(content, structureType);
    
    const completeness = this.calculateCompleteness(acts, structureType);
    const adherence = this.calculateAdherence(acts, structureType);
    const recommendations = this.generateStructureRecommendations(acts, structureType, completeness, adherence);

    return {
      type: structureType,
      acts,
      completeness,
      adherence,
      recommendations
    };
  }

  private static detectStructureType(content: string): StructureType {
    const contentLower = content.toLowerCase();
    
    // Hero's Journey indicators
    const heroJourneyKeywords = ['journey', 'quest', 'mentor', 'threshold', 'ordeal', 'return', 'transformation'];
    const heroJourneyScore = heroJourneyKeywords.reduce((score, keyword) => 
      score + (contentLower.includes(keyword) ? 1 : 0), 0);
    
    // Three-act indicators
    const threeActKeywords = ['beginning', 'middle', 'end', 'setup', 'confrontation', 'resolution'];
    const threeActScore = threeActKeywords.reduce((score, keyword) => 
      score + (contentLower.includes(keyword) ? 1 : 0), 0);
    
    // Save the Cat indicators
    const saveTheCatKeywords = ['catalyst', 'debate', 'break into two', 'midpoint', 'dark night', 'finale'];
    const saveTheCatScore = saveTheCatKeywords.reduce((score, keyword) => 
      score + (contentLower.includes(keyword) ? 1 : 0), 0);

    if (heroJourneyScore >= threeActScore && heroJourneyScore >= saveTheCatScore) {
      return 'hero-journey';
    } else if (saveTheCatScore > threeActScore) {
      return 'save-the-cat';
    } else {
      return 'three-act';
    }
  }

  private static identifyActs(content: string, structureType: StructureType): any[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalLength = sentences.length;

    switch (structureType) {
      case 'three-act':
        return [
          {
            id: this.generateId(),
            name: 'Act I - Setup',
            startPosition: 0,
            endPosition: Math.floor(totalLength * 0.25),
            purpose: 'Introduce characters, world, and inciting incident',
            content: sentences.slice(0, Math.floor(totalLength * 0.25)).join('. '),
            strength: this.calculateActStrength(sentences.slice(0, Math.floor(totalLength * 0.25)), 'setup'),
            issues: [],
            suggestions: []
          },
          {
            id: this.generateId(),
            name: 'Act II - Confrontation',
            startPosition: Math.floor(totalLength * 0.25),
            endPosition: Math.floor(totalLength * 0.75),
            purpose: 'Develop conflict, obstacles, and character growth',
            content: sentences.slice(Math.floor(totalLength * 0.25), Math.floor(totalLength * 0.75)).join('. '),
            strength: this.calculateActStrength(sentences.slice(Math.floor(totalLength * 0.25), Math.floor(totalLength * 0.75)), 'confrontation'),
            issues: [],
            suggestions: []
          },
          {
            id: this.generateId(),
            name: 'Act III - Resolution',
            startPosition: Math.floor(totalLength * 0.75),
            endPosition: totalLength,
            purpose: 'Climax, resolution, and character transformation',
            content: sentences.slice(Math.floor(totalLength * 0.75)).join('. '),
            strength: this.calculateActStrength(sentences.slice(Math.floor(totalLength * 0.75)), 'resolution'),
            issues: [],
            suggestions: []
          }
        ];

      case 'hero-journey':
        return [
          {
            id: this.generateId(),
            name: 'Ordinary World',
            startPosition: 0,
            endPosition: Math.floor(totalLength * 0.1),
            purpose: 'Establish hero in normal environment',
            content: sentences.slice(0, Math.floor(totalLength * 0.1)).join('. '),
            strength: 0.7,
            issues: [],
            suggestions: []
          },
          {
            id: this.generateId(),
            name: 'Special World',
            startPosition: Math.floor(totalLength * 0.25),
            endPosition: Math.floor(totalLength * 0.75),
            purpose: 'Hero faces challenges and grows',
            content: sentences.slice(Math.floor(totalLength * 0.25), Math.floor(totalLength * 0.75)).join('. '),
            strength: 0.8,
            issues: [],
            suggestions: []
          },
          {
            id: this.generateId(),
            name: 'Return',
            startPosition: Math.floor(totalLength * 0.75),
            endPosition: totalLength,
            purpose: 'Hero returns transformed',
            content: sentences.slice(Math.floor(totalLength * 0.75)).join('. '),
            strength: 0.6,
            issues: [],
            suggestions: []
          }
        ];

      default:
        return this.identifyActs(content, 'three-act');
    }
  }

  private static calculateActStrength(sentences: string[], actType: string): number {
    const content = sentences.join(' ').toLowerCase();
    
    const strengthIndicators: { [key: string]: string[] } = {
      'setup': ['introduce', 'establish', 'begin', 'start', 'meet', 'discover'],
      'confrontation': ['conflict', 'challenge', 'struggle', 'fight', 'oppose', 'difficult'],
      'resolution': ['resolve', 'conclude', 'end', 'final', 'victory', 'defeat', 'transform']
    };

    const indicators = strengthIndicators[actType] || [];
    const score = indicators.reduce((count, indicator) => 
      count + (content.includes(indicator) ? 1 : 0), 0);
    
    return Math.min(score / indicators.length + 0.3, 1);
  }

  private static calculateCompleteness(acts: any[], structureType: StructureType): number {
    const expectedActs = structureType === 'three-act' ? 3 : structureType === 'five-act' ? 5 : 3;
    return Math.min(acts.length / expectedActs, 1);
  }

  private static calculateAdherence(acts: any[], structureType: StructureType): number {
    // Calculate how well the story adheres to the expected structure
    let adherenceScore = 0;
    
    acts.forEach((act, index) => {
      const expectedLength = structureType === 'three-act' ? 
        (index === 1 ? 0.5 : 0.25) : 1 / acts.length;
      
      const actualLength = (act.endPosition - act.startPosition) / 100; // Normalize
      const lengthScore = 1 - Math.abs(expectedLength - actualLength);
      adherenceScore += lengthScore * act.strength;
    });
    
    return adherenceScore / acts.length;
  }

  private static generateStructureRecommendations(acts: any[], structureType: StructureType, completeness: number, adherence: number): string[] {
    const recommendations = [];
    
    if (completeness < 0.8) {
      recommendations.push(`Consider developing the ${structureType.replace('-', ' ')} structure more fully`);
    }
    
    if (adherence < 0.6) {
      recommendations.push('Story structure could be more balanced - consider adjusting act lengths');
    }
    
    if (acts.length > 0 && acts[0].strength < 0.5) {
      recommendations.push('Opening act needs strengthening - consider a stronger hook or clearer setup');
    }
    
    if (acts.length > 1 && acts[acts.length - 1].strength < 0.5) {
      recommendations.push('Ending needs more impact - consider a stronger resolution or transformation');
    }
    
    return recommendations;
  }

  private static identifyPlotPoints(content: string, structureType: StructureType): PlotPoint[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalLength = sentences.length;
    
    const plotPointTemplates = this.getPlotPointTemplates(structureType);
    const plotPoints: PlotPoint[] = [];
    
    plotPointTemplates.forEach(template => {
      const position = Math.floor(totalLength * template.idealPosition);
      const contextStart = Math.max(0, position - 2);
      const contextEnd = Math.min(totalLength, position + 2);
      const context = sentences.slice(contextStart, contextEnd).join('. ');
      
      const strength = this.calculatePlotPointStrength(context, template.type);
      const present = strength > 0.3;
      
      plotPoints.push({
        id: this.generateId(),
        name: template.name,
        type: template.type,
        position: template.idealPosition,
        description: context || `${template.name} should occur around ${Math.round(template.idealPosition * 100)}% through the story`,
        strength,
        present,
        suggestions: present ? [] : [`Consider adding a clear ${template.name.toLowerCase()}`],
        relatedCharacters: this.extractCharactersFromContext(context)
      });
    });
    
    return plotPoints;
  }

  private static getPlotPointTemplates(structureType: StructureType): any[] {
    switch (structureType) {
      case 'three-act':
        return [
          { name: 'Inciting Incident', type: 'inciting-incident', idealPosition: 0.12 },
          { name: 'Plot Point 1', type: 'plot-point-1', idealPosition: 0.25 },
          { name: 'Midpoint', type: 'midpoint', idealPosition: 0.5 },
          { name: 'Plot Point 2', type: 'plot-point-2', idealPosition: 0.75 },
          { name: 'Climax', type: 'climax', idealPosition: 0.88 },
          { name: 'Resolution', type: 'resolution', idealPosition: 0.95 }
        ];
      
      case 'hero-journey':
        return [
          { name: 'Call to Adventure', type: 'call-to-adventure', idealPosition: 0.1 },
          { name: 'Refusal of Call', type: 'refusal-of-call', idealPosition: 0.15 },
          { name: 'Meeting the Mentor', type: 'meeting-mentor', idealPosition: 0.2 },
          { name: 'Crossing Threshold', type: 'crossing-threshold', idealPosition: 0.25 },
          { name: 'Tests, Allies, Enemies', type: 'tests-allies-enemies', idealPosition: 0.4 },
          { name: 'Approach Inmost Cave', type: 'approach-inmost-cave', idealPosition: 0.6 },
          { name: 'Ordeal', type: 'ordeal', idealPosition: 0.75 },
          { name: 'Reward', type: 'reward', idealPosition: 0.8 },
          { name: 'Road Back', type: 'road-back', idealPosition: 0.85 },
          { name: 'Resurrection', type: 'resurrection', idealPosition: 0.9 },
          { name: 'Return with Elixir', type: 'return-elixir', idealPosition: 0.95 }
        ];
      
      default:
        return this.getPlotPointTemplates('three-act');
    }
  }

  private static calculatePlotPointStrength(context: string, plotPointType: string): number {
    const contextLower = context.toLowerCase();
    
    const plotPointKeywords: { [key: string]: string[] } = {
      'inciting-incident': ['suddenly', 'unexpected', 'changed', 'disrupted', 'began'],
      'climax': ['final', 'ultimate', 'decisive', 'confrontation', 'battle', 'peak'],
      'resolution': ['resolved', 'ended', 'concluded', 'finally', 'peace', 'settled'],
      'call-to-adventure': ['called', 'summoned', 'invited', 'opportunity', 'quest'],
      'ordeal': ['faced', 'confronted', 'challenged', 'tested', 'trial']
    };
    
    const keywords = plotPointKeywords[plotPointType] || [];
    const score = keywords.reduce((count, keyword) => 
      count + (contextLower.includes(keyword) ? 1 : 0), 0);
    
    return Math.min(score / Math.max(keywords.length, 1) + 0.2, 1);
  }

  private static extractCharactersFromContext(context: string): string[] {
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const names = context.match(namePattern) || [];
    return [...new Set(names)].slice(0, 3);
  }

  private static analyzeCharacters(content: string): CharacterAnalysis[] {
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const names = content.match(namePattern) || [];
    
    const characterCounts: { [key: string]: number } = {};
    names.forEach(name => {
      characterCounts[name] = (characterCounts[name] || 0) + 1;
    });

    const characters: CharacterAnalysis[] = Object.entries(characterCounts)
      .filter(([_, count]) => count > 1)
      .slice(0, 8)
      .map(([name, mentions], index) => ({
        id: this.generateId(),
        name,
        role: this.inferCharacterRole(name, content, index),
        arcType: this.inferCharacterArc(name, content),
        development: this.analyzeCharacterDevelopment(name, content),
        relationships: this.analyzeCharacterRelationships(name, content, Object.keys(characterCounts)),
        screenTime: mentions / names.length,
        importance: mentions > 5 ? 1 : mentions > 3 ? 0.7 : 0.4,
        suggestions: this.generateCharacterSuggestions(name, content, mentions)
      }));

    return characters;
  }

  private static inferCharacterRole(name: string, content: string, index: number): any {
    const context = content.toLowerCase();
    const nameLower = name.toLowerCase();
    
    if (index === 0) return 'protagonist';
    if (context.includes(`${nameLower} opposed`) || context.includes(`${nameLower} enemy`)) return 'antagonist';
    if (context.includes(`${nameLower} taught`) || context.includes(`${nameLower} guided`)) return 'mentor';
    if (context.includes(`${nameLower} helped`) || context.includes(`${nameLower} supported`)) return 'ally';
    if (context.includes(`${nameLower} loved`) || context.includes(`${nameLower} romance`)) return 'love-interest';
    
    return 'supporting';
  }

  private static inferCharacterArc(name: string, content: string): any {
    const context = content.toLowerCase();
    const nameLower = name.toLowerCase();
    
    if (context.includes(`${nameLower} changed`) || context.includes(`${nameLower} grew`)) return 'positive-change';
    if (context.includes(`${nameLower} fell`) || context.includes(`${nameLower} corrupted`)) return 'negative-change';
    if (context.includes(`${nameLower} redeemed`) || context.includes(`${nameLower} forgiven`)) return 'redemption-arc';
    
    return 'flat-arc';
  }

  private static analyzeCharacterDevelopment(name: string, content: string): any {
    const sentences = content.split(/[.!?]+/).filter(s => s.includes(name));
    const firstMention = sentences[0] || '';
    const lastMention = sentences[sentences.length - 1] || '';
    
    return {
      startState: this.extractCharacterState(firstMention),
      endState: this.extractCharacterState(lastMention),
      changeStrength: sentences.length > 2 ? 0.7 : 0.3,
      motivations: this.extractMotivations(name, content),
      conflicts: this.extractConflicts(name, content),
      growth: this.extractGrowth(name, content),
      weaknesses: this.extractWeaknesses(name, content)
    };
  }

  private static extractCharacterState(sentence: string): string {
    const emotions = ['happy', 'sad', 'angry', 'confused', 'determined', 'afraid', 'confident'];
    const foundEmotion = emotions.find(emotion => sentence.toLowerCase().includes(emotion));
    return foundEmotion || 'neutral';
  }

  private static extractMotivations(name: string, content: string): string[] {
    const motivationKeywords = ['wanted', 'needed', 'sought', 'desired', 'hoped'];
    const motivations: string[] = [];
    
    motivationKeywords.forEach(keyword => {
      const regex = new RegExp(`${name}[^.]*${keyword}[^.]*`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        motivations.push(...matches.slice(0, 2));
      }
    });
    
    return motivations.slice(0, 3);
  }

  private static extractConflicts(name: string, content: string): string[] {
    const conflictKeywords = ['fought', 'struggled', 'opposed', 'challenged', 'confronted'];
    const conflicts: string[] = [];
    
    conflictKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(`${name.toLowerCase()} ${keyword}`)) {
        conflicts.push(`${name} ${keyword}`);
      }
    });
    
    return conflicts.slice(0, 3);
  }

  private static extractGrowth(name: string, content: string): string[] {
    const growthKeywords = ['learned', 'realized', 'understood', 'discovered', 'became'];
    const growth: string[] = [];
    
    growthKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(`${name.toLowerCase()} ${keyword}`)) {
        growth.push(`${name} ${keyword}`);
      }
    });
    
    return growth.slice(0, 3);
  }

  private static extractWeaknesses(name: string, content: string): string[] {
    const weaknessKeywords = ['failed', 'couldn\'t', 'unable', 'weak', 'struggled'];
    const weaknesses: string[] = [];
    
    weaknessKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(`${name.toLowerCase()} ${keyword}`)) {
        weaknesses.push(`${name} ${keyword}`);
      }
    });
    
    return weaknesses.slice(0, 2);
  }

  private static analyzeCharacterRelationships(name: string, content: string, allCharacters: string[]): any[] {
    const relationships: any[] = [];
    
    allCharacters.forEach(otherChar => {
      if (otherChar === name) return;
      
      const relationshipType = this.inferRelationshipType(name, otherChar, content);
      if (relationshipType) {
        relationships.push({
          character: otherChar,
          type: relationshipType,
          strength: 0.5,
          development: 'stable'
        });
      }
    });
    
    return relationships.slice(0, 4);
  }

  private static inferRelationshipType(char1: string, char2: string, content: string): any {
    const context = content.toLowerCase();
    const char1Lower = char1.toLowerCase();
    const char2Lower = char2.toLowerCase();
    
    if (context.includes(`${char1Lower} loved ${char2Lower}`) || context.includes(`${char2Lower} loved ${char1Lower}`)) {
      return 'romantic';
    }
    if (context.includes(`${char1Lower} friend ${char2Lower}`) || context.includes(`${char2Lower} friend ${char1Lower}`)) {
      return 'friendship';
    }
    if (context.includes(`${char1Lower} enemy ${char2Lower}`) || context.includes(`${char2Lower} enemy ${char1Lower}`)) {
      return 'antagonistic';
    }
    
    return null;
  }

  private static generateCharacterSuggestions(name: string, content: string, mentions: number): string[] {
    const suggestions = [];
    
    if (mentions < 3) {
      suggestions.push(`Consider developing ${name}'s role more throughout the story`);
    }
    
    if (!content.toLowerCase().includes(`${name.toLowerCase()} changed`)) {
      suggestions.push(`Consider giving ${name} a clearer character arc or transformation`);
    }
    
    if (!content.toLowerCase().includes(`${name.toLowerCase()} wanted`)) {
      suggestions.push(`Clarify ${name}'s motivations and goals`);
    }
    
    return suggestions;
  }

  private static analyzePacing(content: string, structure: NarrativeStructure): PacingAnalysis {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalLength = sentences.length;
    
    const overallPacing = this.calculateOverallPacing(sentences);
    const actPacing = this.calculateActPacing(structure.acts, totalLength);
    const tensionCurve = this.generateTensionCurve(sentences);
    const recommendations = this.generatePacingRecommendations(overallPacing, actPacing, tensionCurve);
    const issues = this.identifyPacingIssues(actPacing, tensionCurve);
    
    return {
      overallPacing,
      actPacing,
      tensionCurve,
      recommendations,
      issues
    };
  }

  private static calculateOverallPacing(sentences: string[]): any {
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    const actionWords = ['ran', 'jumped', 'fought', 'rushed', 'quickly', 'suddenly'];
    const actionCount = sentences.reduce((count, s) => 
      count + actionWords.filter(word => s.toLowerCase().includes(word)).length, 0);
    
    const pacingScore = (actionCount / sentences.length) + (1 / (avgSentenceLength / 50));
    
    if (pacingScore > 0.8) return 'too-fast';
    if (pacingScore > 0.6) return 'fast';
    if (pacingScore > 0.4) return 'optimal';
    if (pacingScore > 0.2) return 'slow';
    return 'too-slow';
  }

  private static calculateActPacing(acts: any[], totalLength: number): any[] {
    return acts.map((act, index) => {
      const duration = act.endPosition - act.startPosition;
      const idealDuration = index === 1 ? totalLength * 0.5 : totalLength * 0.25; // Act 2 should be longer
      
      let pacing: any = 'optimal';
      if (duration > idealDuration * 1.3) pacing = 'too-slow';
      else if (duration > idealDuration * 1.1) pacing = 'slow';
      else if (duration < idealDuration * 0.7) pacing = 'too-fast';
      else if (duration < idealDuration * 0.9) pacing = 'fast';
      
      return {
        act: index + 1,
        pacing,
        duration,
        idealDuration,
        issues: pacing !== 'optimal' ? [`Act ${index + 1} is paced ${pacing}`] : [],
        suggestions: pacing !== 'optimal' ? [`Consider ${pacing.includes('fast') ? 'expanding' : 'tightening'} Act ${index + 1}`] : []
      };
    });
  }

  private static generateTensionCurve(sentences: string[]): any[] {
    const tensionWords = ['conflict', 'fight', 'danger', 'crisis', 'tension', 'dramatic', 'intense'];
    const reliefWords = ['calm', 'peaceful', 'resolved', 'safe', 'relief', 'rest'];
    
    return sentences.map((sentence, index) => {
      const tensionScore = tensionWords.reduce((score, word) => 
        score + (sentence.toLowerCase().includes(word) ? 1 : 0), 0);
      const reliefScore = reliefWords.reduce((score, word) => 
        score + (sentence.toLowerCase().includes(word) ? 1 : 0), 0);
      
      const tension = Math.max(0, Math.min(1, (tensionScore - reliefScore) * 0.3 + 0.5));
      
      return {
        position: index / sentences.length,
        tension,
        event: sentence.substring(0, 50) + '...',
        type: tension > 0.7 ? 'spike' : tension > 0.6 ? 'rising' : tension < 0.4 ? 'falling' : 'plateau'
      };
    });
  }

  private static generatePacingRecommendations(overallPacing: any, actPacing: any[], tensionCurve: any[]): any[] {
    const recommendations = [];
    
    if (overallPacing === 'too-slow') {
      recommendations.push({
        type: 'cut',
        position: 0.5,
        description: 'Consider cutting unnecessary scenes or dialogue to improve pacing',
        impact: 'high'
      });
    }
    
    if (overallPacing === 'too-fast') {
      recommendations.push({
        type: 'expand',
        position: 0.3,
        description: 'Add more character development or world-building moments',
        impact: 'medium'
      });
    }
    
    // Check for sagging middle
    const middleTension = tensionCurve.slice(
      Math.floor(tensionCurve.length * 0.4),
      Math.floor(tensionCurve.length * 0.6)
    );
    const avgMiddleTension = middleTension.reduce((sum, point) => sum + point.tension, 0) / middleTension.length;
    
    if (avgMiddleTension < 0.4) {
      recommendations.push({
        type: 'add-tension',
        position: 0.5,
        description: 'Add conflict or complications to strengthen the middle section',
        impact: 'high'
      });
    }
    
    return recommendations;
  }

  private static identifyPacingIssues(actPacing: any[], tensionCurve: any[]): any[] {
    const issues = [];
    
    // Check for sagging middle
    const middleTension = tensionCurve.slice(
      Math.floor(tensionCurve.length * 0.4),
      Math.floor(tensionCurve.length * 0.6)
    );
    const avgMiddleTension = middleTension.reduce((sum, point) => sum + point.tension, 0) / middleTension.length;
    
    if (avgMiddleTension < 0.4) {
      issues.push({
        type: 'sagging-middle',
        severity: 'high',
        description: 'The middle section lacks tension and may lose audience interest',
        suggestions: ['Add subplot complications', 'Introduce new obstacles', 'Deepen character conflicts']
      });
    }
    
    // Check for rushed ending
    const endingPacing = actPacing[actPacing.length - 1];
    if (endingPacing && endingPacing.pacing === 'too-fast') {
      issues.push({
        type: 'rushed-ending',
        severity: 'medium',
        description: 'The ending feels rushed and may not provide satisfying resolution',
        suggestions: ['Expand the climax sequence', 'Add more resolution scenes', 'Allow time for character reflection']
      });
    }
    
    return issues;
  }

  private static identifyStoryGaps(content: string, plotPoints: PlotPoint[], characters: CharacterAnalysis[]): StoryGap[] {
    const gaps: StoryGap[] = [];
    
    // Check for missing plot points
    const missingPlotPoints = plotPoints.filter(point => !point.present);
    missingPlotPoints.forEach(point => {
      gaps.push({
        id: this.generateId(),
        type: 'missing-setup',
        severity: point.name.includes('Climax') ? 'critical' : 'medium',
        description: `Missing ${point.name} - this is crucial for story structure`,
        position: point.position,
        suggestions: [`Add a clear ${point.name.toLowerCase()} around ${Math.round(point.position * 100)}% through the story`],
        impact: 'Story structure feels incomplete without this element'
      });
    });
    
    // Check for character motivation gaps
    characters.forEach(character => {
      if (character.development.motivations.length === 0) {
        gaps.push({
          id: this.generateId(),
          type: 'missing-motivation',
          severity: character.role === 'protagonist' ? 'high' : 'medium',
          description: `${character.name}'s motivations are unclear`,
          position: 0.1,
          suggestions: [`Clarify what ${character.name} wants and why`, `Show ${character.name}'s goals through actions and dialogue`],
          impact: 'Readers may not connect with or understand this character'
        });
      }
    });
    
    // Check for unresolved conflicts
    const conflictWords = ['conflict', 'problem', 'issue', 'challenge'];
    const resolutionWords = ['resolved', 'solved', 'fixed', 'settled'];
    
    const hasConflicts = conflictWords.some(word => content.toLowerCase().includes(word));
    const hasResolutions = resolutionWords.some(word => content.toLowerCase().includes(word));
    
    if (hasConflicts && !hasResolutions) {
      gaps.push({
        id: this.generateId(),
        type: 'unresolved-thread',
        severity: 'medium',
        description: 'Some conflicts appear to be unresolved',
        position: 0.9,
        suggestions: ['Ensure all major conflicts have clear resolutions', 'Address loose plot threads before the ending'],
        impact: 'Story may feel incomplete or unsatisfying'
      });
    }
    
    return gaps;
  }

  private static generateSuggestions(
    structure: NarrativeStructure,
    plotPoints: PlotPoint[],
    characters: CharacterAnalysis[],
    pacing: PacingAnalysis,
    gaps: StoryGap[]
  ): StructuralSuggestion[] {
    const suggestions: StructuralSuggestion[] = [];
    
    // Structure suggestions
    if (structure.completeness < 0.8) {
      suggestions.push({
        id: this.generateId(),
        type: 'add-plot-point',
        priority: 'high',
        description: 'Story structure is incomplete - missing key plot points',
        implementation: 'Add the missing plot points identified in the analysis',
        expectedImpact: 'Improved story flow and reader engagement',
        examples: ['Add a clear inciting incident', 'Strengthen the climax', 'Provide better resolution']
      });
    }
    
    // Character suggestions
    const weakCharacters = characters.filter(char => char.development.changeStrength < 0.5);
    if (weakCharacters.length > 0) {
      suggestions.push({
        id: this.generateId(),
        type: 'strengthen-character',
        priority: 'medium',
        description: `${weakCharacters.length} character(s) need stronger development`,
        implementation: 'Give characters clearer arcs, motivations, and growth',
        expectedImpact: 'More engaging and relatable characters',
        examples: ['Show character transformation', 'Clarify character goals', 'Add character backstory']
      });
    }
    
    // Pacing suggestions
    if (pacing.overallPacing !== 'optimal') {
      suggestions.push({
        id: this.generateId(),
        type: 'improve-pacing',
        priority: 'medium',
        description: `Story pacing is ${pacing.overallPacing}`,
        implementation: pacing.overallPacing.includes('fast') ? 'Add breathing room and character moments' : 'Tighten scenes and increase tension',
        expectedImpact: 'Better reader engagement and story flow',
        examples: pacing.overallPacing.includes('fast') ? 
          ['Add character reflection scenes', 'Expand world-building moments'] :
          ['Cut unnecessary dialogue', 'Combine similar scenes', 'Increase conflict']
      });
    }
    
    // Gap-based suggestions
    gaps.forEach(gap => {
      if (gap.severity === 'high' || gap.severity === 'critical') {
        suggestions.push({
          id: this.generateId(),
          type: gap.type === 'missing-motivation' ? 'strengthen-character' : 'add-plot-point',
          priority: gap.severity === 'critical' ? 'critical' : 'high',
          description: gap.description,
          position: gap.position,
          implementation: gap.suggestions[0] || 'Address this story gap',
          expectedImpact: gap.impact,
          examples: gap.suggestions
        });
      }
    });
    
    return suggestions.sort((a, b) => {
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private static generateSynopsis(content: string, characters: CharacterAnalysis[], plotPoints: PlotPoint[]): Synopsis {
    const protagonist = characters.find(char => char.role === 'protagonist');
    const antagonist = characters.find(char => char.role === 'antagonist');
    const climax = plotPoints.find(point => point.type === 'climax');
    
    const short = `A story about ${protagonist?.name || 'a protagonist'} who faces ${antagonist ? `conflict with ${antagonist.name}` : 'challenges'} and ${climax?.present ? 'reaches a climactic confrontation' : 'works toward resolution'}.`;
    
    const medium = `${short} The story follows ${protagonist?.name || 'the main character'} through ${plotPoints.filter(p => p.present).length} major plot points, exploring themes of ${this.extractThemes(content).slice(0, 2).join(' and ')}. ${characters.length > 1 ? `Supporting characters include ${characters.slice(1, 3).map(c => c.name).join(' and ')}.` : ''}`;
    
    const long = `${medium} The narrative structure follows a ${this.detectStructureType(content).replace('-', ' ')} format, with ${plotPoints.filter(p => p.present).length} of ${plotPoints.length} key plot points present. Character development focuses on ${protagonist?.development.motivations.slice(0, 2).join(' and ') || 'personal growth'}, while the central conflict revolves around ${antagonist ? `the opposition between ${protagonist?.name} and ${antagonist.name}` : 'internal and external challenges'}. The story concludes with ${plotPoints.find(p => p.type === 'resolution')?.present ? 'a clear resolution' : 'an open ending'}.`;
    
    return {
      short,
      medium,
      long,
      oneSheet: long,
      treatment: `TREATMENT\n\n${long}\n\nACT BREAKDOWN:\n${this.generateActBreakdown(content)}`,
      strengths: this.identifyStoryStrengths(content, characters, plotPoints),
      weaknesses: this.identifyStoryWeaknesses(content, characters, plotPoints)
    };
  }

  private static extractThemes(content: string): string[] {
    const themeKeywords = {
      'love': ['love', 'romance', 'relationship', 'heart'],
      'redemption': ['redemption', 'forgiveness', 'second chance'],
      'sacrifice': ['sacrifice', 'give up', 'selfless'],
      'growth': ['growth', 'change', 'transformation', 'learning'],
      'justice': ['justice', 'right', 'wrong', 'fair'],
      'family': ['family', 'parent', 'child', 'sibling'],
      'friendship': ['friend', 'loyalty', 'trust', 'bond'],
      'survival': ['survival', 'endure', 'overcome', 'persevere']
    };
    
    const themes: string[] = [];
    const contentLower = content.toLowerCase();
    
    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      const score = keywords.reduce((count, keyword) => 
        count + (contentLower.includes(keyword) ? 1 : 0), 0);
      if (score > 0) themes.push(theme);
    });
    
    return themes.slice(0, 3);
  }

  private static generateActBreakdown(content: string): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const act1End = Math.floor(sentences.length * 0.25);
    const act2End = Math.floor(sentences.length * 0.75);
    
    return `Act I (Setup): ${sentences.slice(0, act1End).join('. ').substring(0, 200)}...\n\nAct II (Confrontation): ${sentences.slice(act1End, act2End).join('. ').substring(0, 200)}...\n\nAct III (Resolution): ${sentences.slice(act2End).join('. ').substring(0, 200)}...`;
  }

  private static identifyStoryStrengths(content: string, characters: CharacterAnalysis[], plotPoints: PlotPoint[]): string[] {
    const strengths = [];
    
    if (characters.length > 2) {
      strengths.push('Rich character ensemble with multiple perspectives');
    }
    
    if (plotPoints.filter(p => p.present).length > plotPoints.length * 0.7) {
      strengths.push('Strong structural foundation with clear plot points');
    }
    
    if (content.length > 5000) {
      strengths.push('Detailed narrative with substantial content');
    }
    
    const protagonist = characters.find(char => char.role === 'protagonist');
    if (protagonist && protagonist.development.changeStrength > 0.6) {
      strengths.push('Compelling protagonist with clear character arc');
    }
    
    return strengths;
  }

  private static identifyStoryWeaknesses(content: string, characters: CharacterAnalysis[], plotPoints: PlotPoint[]): string[] {
    const weaknesses = [];
    
    const missingPlotPoints = plotPoints.filter(p => !p.present);
    if (missingPlotPoints.length > plotPoints.length * 0.3) {
      weaknesses.push('Missing key structural elements');
    }
    
    const weakCharacters = characters.filter(char => char.development.changeStrength < 0.4);
    if (weakCharacters.length > characters.length * 0.5) {
      weaknesses.push('Characters need stronger development and arcs');
    }
    
    if (content.length < 2000) {
      weaknesses.push('Story may benefit from more detailed development');
    }
    
    const antagonist = characters.find(char => char.role === 'antagonist');
    if (!antagonist) {
      weaknesses.push('Lacks a clear antagonist or opposing force');
    }
    
    return weaknesses;
  }

  private static generateLoglines(content: string, characters: CharacterAnalysis[], plotPoints: PlotPoint[]): Logline[] {
    const protagonist = characters.find(char => char.role === 'protagonist');
    const antagonist = characters.find(char => char.role === 'antagonist');
    const incitingIncident = plotPoints.find(point => point.type === 'inciting-incident');
    
    const loglines: Logline[] = [];
    
    // Traditional logline
    const traditional = `When ${incitingIncident?.present ? 'faced with an unexpected challenge' : 'circumstances change'}, ${protagonist?.name || 'a protagonist'} must ${protagonist?.development.motivations[0] || 'overcome obstacles'} ${antagonist ? `despite opposition from ${antagonist.name}` : 'against all odds'}.`;
    
    loglines.push({
      text: traditional,
      type: 'traditional',
      strength: this.calculateLoglineStrength(traditional, characters, plotPoints),
      elements: this.analyzeLoglineElements(traditional, characters, plotPoints),
      suggestions: ['Consider making the stakes more specific', 'Clarify the protagonist\'s goal']
    });
    
    // Question logline
    const question = `Can ${protagonist?.name || 'the protagonist'} ${protagonist?.development.motivations[0] || 'achieve their goal'} when ${antagonist ? `${antagonist.name} stands in their way` : 'everything seems impossible'}?`;
    
    loglines.push({
      text: question,
      type: 'question',
      strength: this.calculateLoglineStrength(question, characters, plotPoints),
      elements: this.analyzeLoglineElements(question, characters, plotPoints),
      suggestions: ['Make the question more specific', 'Raise the stakes']
    });
    
    return loglines;
  }

  private static calculateLoglineStrength(logline: string, characters: CharacterAnalysis[], plotPoints: PlotPoint[]): number {
    let strength = 0.5;
    
    // Check for protagonist
    if (characters.some(char => char.role === 'protagonist')) strength += 0.2;
    
    // Check for clear goal/motivation
    if (logline.toLowerCase().includes('must') || logline.toLowerCase().includes('goal')) strength += 0.1;
    
    // Check for obstacle/conflict
    if (logline.toLowerCase().includes('against') || logline.toLowerCase().includes('despite')) strength += 0.1;
    
    // Check for stakes
    if (logline.toLowerCase().includes('or') || logline.toLowerCase().includes('before')) strength += 0.1;
    
    return Math.min(strength, 1);
  }

  private static analyzeLoglineElements(logline: string, characters: CharacterAnalysis[], plotPoints: PlotPoint[]): any[] {
    return [
      {
        type: 'protagonist',
        present: characters.some(char => char.role === 'protagonist'),
        strength: characters.some(char => char.role === 'protagonist') ? 0.8 : 0,
        content: characters.find(char => char.role === 'protagonist')?.name
      },
      {
        type: 'goal',
        present: logline.toLowerCase().includes('must') || logline.toLowerCase().includes('goal'),
        strength: 0.6,
        content: 'Implied goal present'
      },
      {
        type: 'obstacle',
        present: logline.toLowerCase().includes('against') || logline.toLowerCase().includes('despite'),
        strength: 0.7,
        content: 'Opposition mentioned'
      },
      {
        type: 'stakes',
        present: logline.toLowerCase().includes('or') || logline.toLowerCase().includes('before'),
        strength: 0.4,
        content: 'Stakes could be clearer'
      }
    ];
  }

  private static analyzeGenre(content: string, plotPoints: PlotPoint[], characters: CharacterAnalysis[]): GenreAnalysis {
    const genreKeywords = {
      'drama': ['emotion', 'relationship', 'family', 'personal', 'character'],
      'action': ['fight', 'chase', 'battle', 'explosion', 'weapon'],
      'romance': ['love', 'romance', 'relationship', 'heart', 'kiss'],
      'thriller': ['suspense', 'danger', 'chase', 'mystery', 'tension'],
      'comedy': ['funny', 'laugh', 'humor', 'joke', 'amusing'],
      'horror': ['fear', 'scary', 'monster', 'death', 'terror'],
      'fantasy': ['magic', 'wizard', 'dragon', 'spell', 'mythical'],
      'sci-fi': ['space', 'future', 'technology', 'alien', 'robot']
    };
    
    const contentLower = content.toLowerCase();
    const genreScores: { [key: string]: number } = {};
    
    Object.entries(genreKeywords).forEach(([genre, keywords]) => {
      const score = keywords.reduce((count, keyword) => 
        count + (contentLower.includes(keyword) ? 1 : 0), 0);
      genreScores[genre] = score;
    });
    
    const sortedGenres = Object.entries(genreScores)
      .sort(([,a], [,b]) => b - a)
      .filter(([,score]) => score > 0);
    
    const primary = {
      name: sortedGenres[0]?.[0] || 'drama',
      confidence: Math.min((sortedGenres[0]?.[1] || 0) / 5, 1),
      indicators: genreKeywords[sortedGenres[0]?.[0] || 'drama'] || []
    };
    
    const secondary = sortedGenres.slice(1, 3).map(([name, score]) => ({
      name,
      confidence: Math.min(score / 5, 1),
      indicators: genreKeywords[name] || []
    }));
    
    return {
      primary,
      secondary,
      conventions: this.analyzeGenreConventions(primary.name, content, plotPoints, characters),
      adherence: primary.confidence,
      recommendations: this.generateGenreRecommendations(primary.name, content)
    };
  }

  private static analyzeGenreConventions(genre: string, content: string, plotPoints: PlotPoint[], characters: CharacterAnalysis[]): any[] {
    const conventions: { [key: string]: any[] } = {
      'drama': [
        { name: 'Character-driven conflict', importance: 'high', description: 'Focus on internal character struggles' },
        { name: 'Emotional stakes', importance: 'high', description: 'Personal consequences matter more than physical' },
        { name: 'Realistic dialogue', importance: 'medium', description: 'Natural, believable conversations' }
      ],
      'action': [
        { name: 'Physical conflict', importance: 'high', description: 'Action sequences and physical challenges' },
        { name: 'Clear antagonist', importance: 'high', description: 'Defined enemy or opposing force' },
        { name: 'Rising stakes', importance: 'medium', description: 'Escalating danger and consequences' }
      ],
      'romance': [
        { name: 'Meet cute', importance: 'medium', description: 'Charming first meeting between love interests' },
        { name: 'Relationship obstacles', importance: 'high', description: 'Barriers preventing the couple from being together' },
        { name: 'Happy ending', importance: 'medium', description: 'Satisfying romantic resolution' }
      ]
    };
    
    const genreConventions = conventions[genre] || conventions['drama'];
    
    return genreConventions.map(convention => ({
      ...convention,
      present: this.checkConventionPresence(convention.name, content, characters),
      strength: Math.random() * 0.5 + 0.5 // Simplified for demo
    }));
  }

  private static checkConventionPresence(conventionName: string, content: string, characters: CharacterAnalysis[]): boolean {
    const contentLower = content.toLowerCase();
    
    switch (conventionName) {
      case 'Character-driven conflict':
        return characters.some(char => char.development.conflicts.length > 0);
      case 'Clear antagonist':
        return characters.some(char => char.role === 'antagonist');
      case 'Relationship obstacles':
        return contentLower.includes('obstacle') || contentLower.includes('problem');
      default:
        return Math.random() > 0.5; // Simplified for demo
    }
  }

  private static generateGenreRecommendations(genre: string, content: string): string[] {
    const recommendations: { [key: string]: string[] } = {
      'drama': [
        'Focus on character development and internal conflict',
        'Ensure emotional stakes are clear and compelling',
        'Develop realistic, nuanced relationships'
      ],
      'action': [
        'Include more physical conflict and action sequences',
        'Clarify the antagonist and their motivations',
        'Escalate stakes throughout the story'
      ],
      'romance': [
        'Develop the romantic relationship with clear obstacles',
        'Include moments of romantic tension and chemistry',
        'Consider the emotional journey of both love interests'
      ]
    };
    
    return recommendations[genre] || recommendations['drama'];
  }

  private static generateVisualizationData(
    structure: NarrativeStructure,
    plotPoints: PlotPoint[],
    characters: CharacterAnalysis[],
    pacing: PacingAnalysis
  ): StoryVisualization {
    return {
      structureChart: {
        acts: structure.acts.map((act, index) => ({
          name: act.name,
          start: act.startPosition,
          end: act.endPosition,
          color: `hsl(${index * 120}, 70%, 60%)`,
          strength: act.strength
        })),
        plotPoints: plotPoints.map(point => ({
          name: point.name,
          position: point.position,
          strength: point.strength,
          present: point.present,
          color: point.present ? '#10b981' : '#ef4444'
        })),
        timeline: plotPoints.map(point => ({
          position: point.position,
          event: point.name,
          importance: point.strength,
          type: point.type
        }))
      },
      tensionCurve: {
        points: pacing.tensionCurve.map(point => ({
          x: point.position * 100,
          y: point.tension * 100,
          event: point.event
        })),
        ideal: this.generateIdealTensionCurve(),
        gaps: []
      },
      characterArcs: characters.slice(0, 4).map((char, index) => ({
        character: char.name,
        points: [
          { x: 0, y: 30, state: char.development.startState },
          { x: 50, y: 50 + (char.development.changeStrength * 30), state: 'developing' },
          { x: 100, y: 30 + (char.development.changeStrength * 50), state: char.development.endState }
        ],
        color: `hsl(${index * 90}, 70%, 50%)`,
        development: char.development.changeStrength
      })),
      pacingChart: {
        acts: pacing.actPacing.map((act, index) => ({
          name: `Act ${act.act}`,
          duration: act.duration,
          ideal: act.idealDuration,
          color: act.pacing === 'optimal' ? '#10b981' : '#f59e0b'
        })),
        issues: pacing.issues.map((issue, index) => ({
          position: index * 25 + 25,
          type: issue.type,
          severity: issue.severity
        }))
      },
      plotPointMap: {
        structure: structure.type,
        points: plotPoints.map(point => ({
          name: point.name,
          position: point.position,
          present: point.present,
          strength: point.strength,
          connections: []
        }))
      }
    };
  }

  private static generateIdealTensionCurve(): { x: number; y: number }[] {
    return [
      { x: 0, y: 20 },
      { x: 12, y: 40 },
      { x: 25, y: 35 },
      { x: 50, y: 60 },
      { x: 75, y: 45 },
      { x: 88, y: 90 },
      { x: 100, y: 25 }
    ];
  }
}