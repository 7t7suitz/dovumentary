import { Script, ScriptElement, StoryboardFrame, TranscriptionProject, ScriptAnalysis, AutoSuggestion } from '../types/script';

export class ScriptProcessor {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static convertStoryboardToScript(frames: StoryboardFrame[]): Script {
    const elements: ScriptElement[] = [];
    let order = 0;

    frames.forEach((frame, index) => {
      // Scene heading
      elements.push({
        id: this.generateId(),
        type: 'scene-heading',
        content: `SCENE ${index + 1} - ${frame.title.toUpperCase()}`,
        formatting: this.getDefaultFormatting('scene-heading'),
        order: order++,
        locked: false
      });

      // Shot description
      elements.push({
        id: this.generateId(),
        type: 'shot',
        content: `${frame.shotType.toUpperCase()} - ${frame.cameraAngle.replace('-', ' ').toUpperCase()}${frame.cameraMovement !== 'static' ? ` - ${frame.cameraMovement.replace('-', ' ').toUpperCase()}` : ''}`,
        formatting: this.getDefaultFormatting('shot'),
        order: order++,
        locked: false
      });

      // Action description
      elements.push({
        id: this.generateId(),
        type: 'action',
        content: frame.description,
        formatting: this.getDefaultFormatting('action'),
        timing: {
          startTime: 0,
          endTime: frame.duration,
          duration: frame.duration,
          estimatedReadingTime: this.calculateReadingTime(frame.description),
          voiceoverPacing: 'normal'
        },
        order: order++,
        locked: false
      });

      // Voiceover
      if (frame.voiceover) {
        elements.push({
          id: this.generateId(),
          type: 'voiceover',
          content: `${frame.voiceover.speaker.toUpperCase()} (V.O.)\n${frame.voiceover.text}`,
          formatting: this.getDefaultFormatting('voiceover'),
          timing: {
            startTime: 0,
            endTime: frame.duration,
            duration: frame.duration,
            estimatedReadingTime: this.calculateReadingTime(frame.voiceover.text),
            voiceoverPacing: frame.voiceover.pacing || 'normal'
          },
          order: order++,
          locked: false
        });
      }

      // Dialogue
      if (frame.dialogue) {
        frame.dialogue.forEach(dialogue => {
          elements.push({
            id: this.generateId(),
            type: 'character',
            content: dialogue.character.toUpperCase(),
            formatting: this.getDefaultFormatting('character'),
            order: order++,
            locked: false
          });

          if (dialogue.delivery) {
            elements.push({
              id: this.generateId(),
              type: 'parenthetical',
              content: `(${dialogue.delivery})`,
              formatting: this.getDefaultFormatting('parenthetical'),
              order: order++,
              locked: false
            });
          }

          elements.push({
            id: this.generateId(),
            type: 'dialogue',
            content: dialogue.text,
            formatting: this.getDefaultFormatting('dialogue'),
            timing: {
              startTime: 0,
              endTime: frame.duration,
              duration: frame.duration,
              estimatedReadingTime: this.calculateReadingTime(dialogue.text),
              voiceoverPacing: 'normal'
            },
            order: order++,
            locked: false
          });
        });
      }

      // Sound effects
      if (frame.soundEffects && frame.soundEffects.length > 0) {
        const sfxContent = frame.soundEffects.map(sfx => sfx.description).join(', ');
        elements.push({
          id: this.generateId(),
          type: 'sound-effect',
          content: `SFX: ${sfxContent}`,
          formatting: this.getDefaultFormatting('sound-effect'),
          order: order++,
          locked: false
        });
      }

      // Music
      if (frame.music) {
        elements.push({
          id: this.generateId(),
          type: 'music',
          content: `MUSIC: ${frame.music.description} (${frame.music.mood})`,
          formatting: this.getDefaultFormatting('music'),
          order: order++,
          locked: false
        });
      }

      // Notes
      if (frame.notes) {
        elements.push({
          id: this.generateId(),
          type: 'action',
          content: `NOTE: ${frame.notes}`,
          formatting: this.getDefaultFormatting('action'),
          notes: ['Production note'],
          order: order++,
          locked: false
        });
      }

      // Transition (except for last frame)
      if (index < frames.length - 1) {
        elements.push({
          id: this.generateId(),
          type: 'transition',
          content: 'CUT TO:',
          formatting: this.getDefaultFormatting('transition'),
          order: order++,
          locked: false
        });
      }
    });

    return {
      id: this.generateId(),
      title: 'Storyboard Script',
      type: 'documentary',
      format: 'fountain',
      content: elements,
      metadata: {
        author: 'AI Script Generator',
        genre: ['Documentary'],
        logline: 'Generated from storyboard frames',
        synopsis: 'A script automatically generated from visual storyboard elements',
        targetLength: elements.length,
        estimatedRuntime: frames.reduce((sum, frame) => sum + frame.duration, 0),
        locations: [],
        characters: this.extractCharacters(elements),
        keywords: [],
        notes: 'Auto-generated from storyboard'
      },
      versions: [],
      collaborators: [],
      settings: this.getDefaultSettings(),
      analysis: this.analyzeScript(elements),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static generateVoiceoverNarration(content: string, style: 'documentary' | 'commercial' | 'narrative' = 'documentary'): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const styleTemplates = {
      documentary: {
        openings: [
          'In a world where',
          'This is the story of',
          'What you\'re about to see',
          'Behind the scenes of',
          'The journey begins'
        ],
        transitions: [
          'But what happens next',
          'As we delve deeper',
          'The truth reveals',
          'Meanwhile',
          'In this moment'
        ],
        closings: [
          'This is just the beginning',
          'The story continues',
          'What we\'ve learned',
          'As we reflect on',
          'The impact remains'
        ]
      },
      commercial: {
        openings: [
          'Imagine a world where',
          'What if we told you',
          'Experience the difference',
          'Discover the power of',
          'Transform your'
        ],
        transitions: [
          'That\'s why',
          'Because you deserve',
          'Now you can',
          'With our solution',
          'The choice is clear'
        ],
        closings: [
          'Don\'t wait, act now',
          'Your journey starts here',
          'Make the change today',
          'Experience the difference',
          'Choose excellence'
        ]
      },
      narrative: {
        openings: [
          'Once upon a time',
          'In the beginning',
          'Our story starts',
          'Long ago',
          'It all began when'
        ],
        transitions: [
          'Suddenly',
          'As fate would have it',
          'In that moment',
          'Without warning',
          'Then everything changed'
        ],
        closings: [
          'And so our story ends',
          'The adventure continues',
          'What happens next',
          'The end... or is it?',
          'Their legacy lives on'
        ]
      }
    };

    const templates = styleTemplates[style];
    const opening = templates.openings[Math.floor(Math.random() * templates.openings.length)];
    const transition = templates.transitions[Math.floor(Math.random() * templates.transitions.length)];
    const closing = templates.closings[Math.floor(Math.random() * templates.closings.length)];

    if (sentences.length === 1) {
      return `${opening} ${sentences[0].trim().toLowerCase()}.`;
    } else if (sentences.length === 2) {
      return `${opening} ${sentences[0].trim().toLowerCase()}. ${transition} ${sentences[1].trim().toLowerCase()}.`;
    } else {
      const middle = sentences.slice(1, -1).join('. ');
      return `${opening} ${sentences[0].trim().toLowerCase()}. ${middle}. ${closing} ${sentences[sentences.length - 1].trim().toLowerCase()}.`;
    }
  }

  static generateSceneTransitions(currentScene: string, nextScene: string): string[] {
    const transitionTypes = [
      'CUT TO:',
      'FADE TO:',
      'DISSOLVE TO:',
      'MATCH CUT TO:',
      'SMASH CUT TO:',
      'JUMP CUT TO:',
      'WIPE TO:',
      'IRIS TO:'
    ];

    const contextualTransitions = [];

    // Analyze scene content for contextual transitions
    if (currentScene.toLowerCase().includes('day') && nextScene.toLowerCase().includes('night')) {
      contextualTransitions.push('FADE TO BLACK:', 'TIME CUT TO:');
    }

    if (currentScene.toLowerCase().includes('indoor') && nextScene.toLowerCase().includes('outdoor')) {
      contextualTransitions.push('CUT TO EXTERIOR:', 'MATCH CUT TO:');
    }

    if (currentScene.toLowerCase().includes('close') && nextScene.toLowerCase().includes('wide')) {
      contextualTransitions.push('PULL BACK TO:', 'ZOOM OUT TO:');
    }

    if (currentScene.toLowerCase().includes('action') || currentScene.toLowerCase().includes('fast')) {
      contextualTransitions.push('SMASH CUT TO:', 'QUICK CUT TO:');
    }

    if (currentScene.toLowerCase().includes('emotional') || currentScene.toLowerCase().includes('dramatic')) {
      contextualTransitions.push('SLOW FADE TO:', 'DISSOLVE TO:');
    }

    return contextualTransitions.length > 0 ? contextualTransitions : transitionTypes.slice(0, 3);
  }

  static generateNarrativeBridges(scenes: string[]): string[] {
    const bridges = [];

    for (let i = 0; i < scenes.length - 1; i++) {
      const current = scenes[i];
      const next = scenes[i + 1];

      // Analyze content for bridge suggestions
      if (current.includes('interview') && next.includes('b-roll')) {
        bridges.push('As [SUBJECT] explains, we see...');
      } else if (current.includes('action') && next.includes('reflection')) {
        bridges.push('In the aftermath of these events...');
      } else if (current.includes('past') && next.includes('present')) {
        bridges.push('Fast forward to today...');
      } else if (current.includes('problem') && next.includes('solution')) {
        bridges.push('But there was hope on the horizon...');
      } else if (current.includes('setup') && next.includes('payoff')) {
        bridges.push('Little did they know...');
      } else {
        // Generic bridges
        const genericBridges = [
          'Meanwhile...',
          'At the same time...',
          'But the story doesn\'t end there...',
          'What happened next would change everything...',
          'As we\'ll soon discover...',
          'The plot thickens...',
          'In a surprising turn of events...',
          'Against all odds...'
        ];
        bridges.push(genericBridges[Math.floor(Math.random() * genericBridges.length)]);
      }
    }

    return bridges;
  }

  static processTranscription(transcription: TranscriptionProject): Script {
    const elements: ScriptElement[] = [];
    let order = 0;

    // Group segments by speaker
    const speakerSegments = transcription.transcript.reduce((acc, segment) => {
      const speaker = segment.speaker || 'UNKNOWN';
      if (!acc[speaker]) acc[speaker] = [];
      acc[speaker].push(segment);
      return acc;
    }, {} as Record<string, any[]>);

    // Convert to script format
    Object.entries(speakerSegments).forEach(([speaker, segments]) => {
      segments.forEach(segment => {
        // Character name
        elements.push({
          id: this.generateId(),
          type: 'character',
          content: speaker.toUpperCase(),
          formatting: this.getDefaultFormatting('character'),
          timing: {
            startTime: segment.startTime,
            endTime: segment.endTime,
            duration: segment.endTime - segment.startTime,
            estimatedReadingTime: this.calculateReadingTime(segment.text),
            voiceoverPacing: 'normal'
          },
          order: order++,
          locked: false
        });

        // Dialogue
        elements.push({
          id: this.generateId(),
          type: 'dialogue',
          content: segment.text,
          formatting: this.getDefaultFormatting('dialogue'),
          timing: {
            startTime: segment.startTime,
            endTime: segment.endTime,
            duration: segment.endTime - segment.startTime,
            estimatedReadingTime: this.calculateReadingTime(segment.text),
            voiceoverPacing: 'normal'
          },
          notes: segment.confidence < 0.8 ? ['Low confidence transcription'] : undefined,
          order: order++,
          locked: false
        });
      });
    });

    return {
      id: this.generateId(),
      title: transcription.name,
      type: 'interview',
      format: 'fountain',
      content: elements,
      metadata: {
        author: 'AI Transcription',
        genre: ['Interview', 'Documentary'],
        logline: 'Transcribed interview content',
        synopsis: 'Auto-generated script from audio transcription',
        targetLength: elements.length,
        estimatedRuntime: transcription.duration,
        locations: [],
        characters: Object.keys(speakerSegments),
        keywords: [],
        notes: 'Generated from audio transcription'
      },
      versions: [],
      collaborators: [],
      settings: this.getDefaultSettings(),
      analysis: this.analyzeScript(elements),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static generateABTestVersions(baseScript: Script, variations: number = 3): any[] {
    const versions = [];

    for (let i = 0; i < variations; i++) {
      const modifiedElements = baseScript.content.map(element => {
        if (element.type === 'dialogue' || element.type === 'voiceover') {
          return {
            ...element,
            content: this.generateVariation(element.content, i),
            id: this.generateId()
          };
        }
        return { ...element, id: this.generateId() };
      });

      versions.push({
        id: this.generateId(),
        name: `Version ${String.fromCharCode(65 + i)}`,
        description: this.getVariationDescription(i),
        script: {
          ...baseScript,
          id: this.generateId(),
          content: modifiedElements,
          updatedAt: new Date()
        },
        metrics: {
          readabilityScore: 0,
          engagementScore: 0,
          clarityScore: 0,
          pacingScore: 0,
          overallScore: 0,
          testDuration: 0,
          participantCount: 0
        },
        feedback: [],
        status: 'draft',
        createdAt: new Date()
      });
    }

    return versions;
  }

  private static generateVariation(content: string, variationType: number): string {
    switch (variationType) {
      case 0: // More formal
        return content
          .replace(/\bcan't\b/g, 'cannot')
          .replace(/\bwon't\b/g, 'will not')
          .replace(/\bdon't\b/g, 'do not')
          .replace(/\bit's\b/g, 'it is');
      
      case 1: // More casual
        return content
          .replace(/\bcannot\b/g, 'can\'t')
          .replace(/\bwill not\b/g, 'won\'t')
          .replace(/\bdo not\b/g, 'don\'t')
          .replace(/\bit is\b/g, 'it\'s');
      
      case 2: // More concise
        return content
          .replace(/\bin order to\b/g, 'to')
          .replace(/\bdue to the fact that\b/g, 'because')
          .replace(/\bat this point in time\b/g, 'now')
          .replace(/\bfor the purpose of\b/g, 'for');
      
      default:
        return content;
    }
  }

  private static getVariationDescription(type: number): string {
    const descriptions = [
      'More formal tone with expanded contractions',
      'Casual tone with natural contractions',
      'Concise version with simplified language',
      'Enhanced version with richer vocabulary'
    ];
    return descriptions[type] || 'Alternative version';
  }

  static generateAutoSuggestions(element: ScriptElement, context: ScriptElement[]): AutoSuggestion[] {
    const suggestions: AutoSuggestion[] = [];

    // Grammar and style suggestions
    if (element.type === 'dialogue' || element.type === 'voiceover') {
      // Check for common issues
      if (element.content.includes('very')) {
        suggestions.push({
          type: 'enhancement',
          text: element.content.replace(/very (\w+)/g, (match, word) => this.getStrongerWord(word)),
          confidence: 0.8,
          context: 'Replace "very + adjective" with stronger alternatives',
          reasoning: 'Stronger vocabulary creates more impact'
        });
      }

      // Check for passive voice
      if (element.content.match(/\b(was|were|is|are|been)\s+\w+ed\b/)) {
        suggestions.push({
          type: 'enhancement',
          text: this.convertToActiveVoice(element.content),
          confidence: 0.7,
          context: 'Convert passive voice to active voice',
          reasoning: 'Active voice is more engaging and direct'
        });
      }

      // Check for repetitive words
      const words = element.content.toLowerCase().split(/\s+/);
      const wordCounts = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const repeatedWords = Object.entries(wordCounts)
        .filter(([word, count]) => count > 2 && word.length > 3)
        .map(([word]) => word);

      if (repeatedWords.length > 0) {
        suggestions.push({
          type: 'enhancement',
          text: this.replaceRepeatedWords(element.content, repeatedWords),
          confidence: 0.6,
          context: 'Reduce word repetition',
          reasoning: 'Varied vocabulary improves readability'
        });
      }
    }

    // Formatting suggestions
    if (element.type === 'character' && !element.content.match(/^[A-Z\s]+$/)) {
      suggestions.push({
        type: 'formatting',
        text: element.content.toUpperCase(),
        confidence: 0.9,
        context: 'Character names should be in ALL CAPS',
        reasoning: 'Industry standard formatting'
      });
    }

    // Completion suggestions
    if (element.content.length < 10 && element.type === 'action') {
      suggestions.push({
        type: 'completion',
        text: this.expandActionDescription(element.content),
        confidence: 0.5,
        context: 'Expand brief action description',
        reasoning: 'More detailed actions help with visualization'
      });
    }

    return suggestions;
  }

  private static getStrongerWord(word: string): string {
    const alternatives: Record<string, string> = {
      'good': 'excellent',
      'bad': 'terrible',
      'big': 'enormous',
      'small': 'tiny',
      'fast': 'rapid',
      'slow': 'sluggish',
      'hot': 'scorching',
      'cold': 'freezing',
      'happy': 'ecstatic',
      'sad': 'devastated'
    };
    return alternatives[word.toLowerCase()] || word;
  }

  private static convertToActiveVoice(text: string): string {
    // Simplified active voice conversion
    return text
      .replace(/was (\w+ed) by/g, '$1')
      .replace(/were (\w+ed) by/g, '$1')
      .replace(/is (\w+ed) by/g, '$1')
      .replace(/are (\w+ed) by/g, '$1');
  }

  private static replaceRepeatedWords(text: string, repeatedWords: string[]): string {
    let result = text;
    repeatedWords.forEach(word => {
      const synonyms = this.getSynonyms(word);
      if (synonyms.length > 0) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        let count = 0;
        result = result.replace(regex, (match) => {
          count++;
          return count > 1 ? synonyms[count % synonyms.length] : match;
        });
      }
    });
    return result;
  }

  private static getSynonyms(word: string): string[] {
    const synonymMap: Record<string, string[]> = {
      'said': ['stated', 'mentioned', 'declared', 'expressed'],
      'look': ['glance', 'gaze', 'observe', 'examine'],
      'walk': ['stroll', 'stride', 'march', 'pace'],
      'think': ['consider', 'ponder', 'reflect', 'contemplate'],
      'show': ['display', 'reveal', 'demonstrate', 'exhibit']
    };
    return synonymMap[word.toLowerCase()] || [];
  }

  private static expandActionDescription(content: string): string {
    const expansions: Record<string, string> = {
      'walks': 'walks purposefully across the room',
      'sits': 'sits down slowly in the chair',
      'looks': 'looks up with a concerned expression',
      'opens': 'carefully opens the door',
      'closes': 'gently closes the window'
    };
    
    const words = content.toLowerCase().split(' ');
    const expandedWords = words.map(word => expansions[word] || word);
    return expandedWords.join(' ');
  }

  private static getDefaultFormatting(elementType: string): any {
    const formatMap: Record<string, any> = {
      'scene-heading': {
        fontSize: 12,
        fontFamily: 'Courier New',
        bold: true,
        italic: false,
        underline: false,
        color: '#000000',
        alignment: 'left',
        indent: 0,
        spacing: 1.5
      },
      'action': {
        fontSize: 12,
        fontFamily: 'Courier New',
        bold: false,
        italic: false,
        underline: false,
        color: '#000000',
        alignment: 'left',
        indent: 0,
        spacing: 1
      },
      'character': {
        fontSize: 12,
        fontFamily: 'Courier New',
        bold: true,
        italic: false,
        underline: false,
        color: '#000000',
        alignment: 'center',
        indent: 20,
        spacing: 1
      },
      'dialogue': {
        fontSize: 12,
        fontFamily: 'Courier New',
        bold: false,
        italic: false,
        underline: false,
        color: '#000000',
        alignment: 'left',
        indent: 10,
        spacing: 1
      },
      'parenthetical': {
        fontSize: 12,
        fontFamily: 'Courier New',
        bold: false,
        italic: true,
        underline: false,
        color: '#666666',
        alignment: 'left',
        indent: 15,
        spacing: 1
      },
      'transition': {
        fontSize: 12,
        fontFamily: 'Courier New',
        bold: true,
        italic: false,
        underline: false,
        color: '#000000',
        alignment: 'right',
        indent: 0,
        spacing: 1.5
      },
      'voiceover': {
        fontSize: 12,
        fontFamily: 'Courier New',
        bold: false,
        italic: true,
        underline: false,
        color: '#0066cc',
        alignment: 'left',
        indent: 10,
        spacing: 1
      },
      'shot': {
        fontSize: 12,
        fontFamily: 'Courier New',
        bold: true,
        italic: false,
        underline: true,
        color: '#cc6600',
        alignment: 'left',
        indent: 0,
        spacing: 1
      },
      'sound-effect': {
        fontSize: 12,
        fontFamily: 'Courier New',
        bold: false,
        italic: true,
        underline: false,
        color: '#009900',
        alignment: 'left',
        indent: 5,
        spacing: 1
      },
      'music': {
        fontSize: 12,
        fontFamily: 'Courier New',
        bold: false,
        italic: true,
        underline: false,
        color: '#9900cc',
        alignment: 'left',
        indent: 5,
        spacing: 1
      }
    };

    return formatMap[elementType] || formatMap['action'];
  }

  private static calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return (wordCount / wordsPerMinute) * 60; // Return in seconds
  }

  private static extractCharacters(elements: ScriptElement[]): string[] {
    const characters = new Set<string>();
    elements.forEach(element => {
      if (element.type === 'character') {
        characters.add(element.content);
      }
    });
    return Array.from(characters);
  }

  private static getDefaultSettings(): any {
    return {
      autoSave: true,
      autoFormat: true,
      spellCheck: true,
      grammarCheck: true,
      readabilityAnalysis: true,
      collaborativeEditing: true,
      versionControl: true,
      exportFormats: ['pdf', 'docx', 'fountain'],
      defaultFont: 'Courier New',
      defaultFontSize: 12,
      pageMargins: { top: 1, bottom: 1, left: 1.5, right: 1 },
      lineSpacing: 1,
      characterSpacing: 0
    };
  }

  private static analyzeScript(elements: ScriptElement[]): ScriptAnalysis {
    const totalWords = elements.reduce((sum, el) => sum + el.content.split(/\s+/).length, 0);
    const dialogueElements = elements.filter(el => el.type === 'dialogue');
    const actionElements = elements.filter(el => el.type === 'action');

    return {
      readability: {
        fleschKincaidGrade: 8.5,
        fleschReadingEase: 65,
        averageWordsPerSentence: 12,
        averageSyllablesPerWord: 1.5,
        complexWords: Math.floor(totalWords * 0.1),
        readingTime: totalWords / 200,
        speakingTime: totalWords / 150
      },
      pacing: {
        overallPacing: 'moderate',
        sceneBreakdown: [],
        dialogueToActionRatio: dialogueElements.length / Math.max(actionElements.length, 1),
        averageSceneLength: elements.length / Math.max(elements.filter(el => el.type === 'scene-heading').length, 1),
        pacingIssues: []
      },
      structure: {
        acts: [],
        plotPoints: [],
        characterArcs: [],
        themes: [],
        structuralIssues: []
      },
      dialogue: {
        totalLines: dialogueElements.length,
        averageLineLength: dialogueElements.reduce((sum, el) => sum + el.content.length, 0) / Math.max(dialogueElements.length, 1),
        characterVoices: [],
        dialogueIssues: [],
        naturalness: 0.8,
        distinctiveness: 0.7
      },
      suggestions: [],
      issues: []
    };
  }
}