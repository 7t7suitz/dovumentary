import { StoryboardFrame, ShotType, CameraAngle, CameraMovement, LightingSetup, ColorPalette, TransitionType, VoiceoverCue, AudioCue, AIAnalysis, CharacterPosition, PropItem } from '../types/storyboard';

export class StoryboardAI {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static async analyzeTextDescription(description: string): Promise<AIAnalysis> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const words = description.toLowerCase().split(/\s+/);
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Analyze scene complexity
    const complexityIndicators = ['multiple', 'crowd', 'action', 'movement', 'complex', 'detailed'];
    const sceneComplexity = Math.min(
      complexityIndicators.reduce((count, indicator) => 
        count + (description.toLowerCase().includes(indicator) ? 0.2 : 0), 0.3
      ), 1
    );

    // Analyze visual interest
    const visualWords = ['color', 'light', 'shadow', 'bright', 'dark', 'beautiful', 'stunning', 'dramatic'];
    const visualInterest = Math.min(
      visualWords.reduce((count, word) => 
        count + (words.includes(word) ? 0.15 : 0), 0.4
      ), 1
    );

    // Analyze narrative pacing
    const pacingWords = ['suddenly', 'slowly', 'quickly', 'then', 'meanwhile', 'after'];
    const narrativePacing = Math.min(
      pacingWords.reduce((count, word) => 
        count + (words.includes(word) ? 0.1 : 0), 0.5
      ), 1
    );

    // Technical feasibility
    const technicalChallenges = ['explosion', 'flying', 'underwater', 'fire', 'crowd', 'night'];
    const technicalFeasibility = Math.max(
      1 - technicalChallenges.reduce((count, challenge) => 
        count + (words.includes(challenge) ? 0.2 : 0), 0
      ), 0.3
    );

    const suggestions = this.generateSuggestions(description, sceneComplexity, visualInterest);
    const warnings = this.generateWarnings(description, technicalFeasibility);

    return {
      sceneComplexity,
      visualInterest,
      narrativePacing,
      technicalFeasibility,
      suggestions,
      warnings
    };
  }

  static generateSuggestions(description: string, complexity: number, visualInterest: number): string[] {
    const suggestions = [];
    
    if (complexity > 0.7) {
      suggestions.push('Consider breaking this complex scene into multiple shots');
      suggestions.push('Use establishing shots to orient the audience');
    }
    
    if (visualInterest < 0.5) {
      suggestions.push('Add more visual elements to enhance scene interest');
      suggestions.push('Consider dynamic camera movements to add energy');
    }
    
    if (description.toLowerCase().includes('dialogue')) {
      suggestions.push('Plan for over-the-shoulder shots during conversation');
      suggestions.push('Consider reaction shots to show character responses');
    }
    
    if (description.toLowerCase().includes('action')) {
      suggestions.push('Use multiple angles to capture action sequence');
      suggestions.push('Consider slow-motion for dramatic effect');
    }
    
    return suggestions;
  }

  static generateWarnings(description: string, feasibility: number): string[] {
    const warnings = [];
    
    if (feasibility < 0.5) {
      warnings.push('This scene may require significant budget and planning');
    }
    
    if (description.toLowerCase().includes('night')) {
      warnings.push('Night scenes require additional lighting equipment');
    }
    
    if (description.toLowerCase().includes('crowd')) {
      warnings.push('Crowd scenes require extensive coordination and permits');
    }
    
    if (description.toLowerCase().includes('water') || description.toLowerCase().includes('rain')) {
      warnings.push('Water scenes require waterproof equipment and safety measures');
    }
    
    return warnings;
  }

  static generateShotSequence(description: string): ShotType[] {
    const sequence: ShotType[] = [];
    const words = description.toLowerCase();
    
    // Start with establishing shot for location descriptions
    if (words.includes('location') || words.includes('setting') || words.includes('place')) {
      sequence.push('wide');
    }
    
    // Add medium shots for character introduction
    if (words.includes('character') || words.includes('person') || words.includes('enters')) {
      sequence.push('medium');
    }
    
    // Add close-ups for dialogue or emotion
    if (words.includes('says') || words.includes('emotion') || words.includes('reaction')) {
      sequence.push('close-up');
    }
    
    // Add insert shots for important objects
    if (words.includes('object') || words.includes('item') || words.includes('detail')) {
      sequence.push('insert');
    }
    
    // Default sequence if nothing specific detected
    if (sequence.length === 0) {
      sequence.push('medium', 'close-up', 'medium');
    }
    
    return sequence;
  }

  static suggestCameraAngle(description: string, shotType: ShotType): CameraAngle {
    const words = description.toLowerCase();
    
    if (words.includes('power') || words.includes('authority') || words.includes('intimidating')) {
      return 'low-angle';
    }
    
    if (words.includes('vulnerable') || words.includes('small') || words.includes('overwhelmed')) {
      return 'high-angle';
    }
    
    if (words.includes('disorienting') || words.includes('unstable') || words.includes('chaos')) {
      return 'dutch-angle';
    }
    
    if (words.includes('overview') || words.includes('layout') || shotType === 'extreme-wide') {
      return 'birds-eye';
    }
    
    return 'eye-level';
  }

  static suggestCameraMovement(description: string, shotType: ShotType): CameraMovement {
    const words = description.toLowerCase();
    
    if (words.includes('follows') || words.includes('walking') || words.includes('moving')) {
      return 'tracking';
    }
    
    if (words.includes('reveals') || words.includes('shows') || words.includes('discovers')) {
      return shotType === 'close-up' ? 'zoom-out' : 'pan-right';
    }
    
    if (words.includes('focuses') || words.includes('emphasizes') || words.includes('important')) {
      return 'zoom-in';
    }
    
    if (words.includes('energy') || words.includes('dynamic') || words.includes('action')) {
      return 'handheld';
    }
    
    if (words.includes('calm') || words.includes('peaceful') || words.includes('stable')) {
      return 'static';
    }
    
    return 'static';
  }

  static generateColorPalette(description: string, mood?: string): ColorPalette {
    const words = description.toLowerCase();
    
    // Mood-based palettes
    if (mood === 'dramatic' || words.includes('dramatic') || words.includes('intense')) {
      return {
        primary: '#1a1a1a',
        secondary: '#8b0000',
        accent: '#ffd700',
        background: '#2c2c2c',
        mood: 'dramatic' as const
      };
    }
    
    if (mood === 'romantic' || words.includes('love') || words.includes('romantic')) {
      return {
        primary: '#ff69b4',
        secondary: '#ffc0cb',
        accent: '#ffffff',
        background: '#ffe4e1',
        mood: 'warm' as const
      };
    }
    
    if (mood === 'mysterious' || words.includes('mystery') || words.includes('dark')) {
      return {
        primary: '#191970',
        secondary: '#483d8b',
        accent: '#9370db',
        background: '#0f0f23',
        mood: 'cool' as const
      };
    }
    
    if (words.includes('nature') || words.includes('outdoor') || words.includes('forest')) {
      return {
        primary: '#228b22',
        secondary: '#32cd32',
        accent: '#ffff00',
        background: '#f0fff0',
        mood: 'natural' as const
      };
    }
    
    if (words.includes('urban') || words.includes('city') || words.includes('modern')) {
      return {
        primary: '#708090',
        secondary: '#2f4f4f',
        accent: '#00ced1',
        background: '#f5f5f5',
        mood: 'cool' as const
      };
    }
    
    // Default neutral palette
    return {
      primary: '#333333',
      secondary: '#666666',
      accent: '#0066cc',
      background: '#ffffff',
      mood: 'neutral' as const
    };
  }

  static generateLightingSetup(description: string, timeOfDay?: string): LightingSetup {
    const words = description.toLowerCase();
    
    if (timeOfDay === 'night' || words.includes('night') || words.includes('dark')) {
      return {
        mood: 'dramatic',
        keyLight: { intensity: 0.8, color: '#ffffff', direction: 'side', softness: 0.3 },
        fillLight: { intensity: 0.2, color: '#4169e1', direction: 'front', softness: 0.8 },
        backLight: { intensity: 0.6, color: '#ffffff', direction: 'back', softness: 0.4 },
        practicalLights: [
          { intensity: 0.5, color: '#ffa500', direction: 'point', softness: 0.6 }
        ]
      };
    }
    
    if (timeOfDay === 'golden-hour' || words.includes('sunset') || words.includes('sunrise')) {
      return {
        mood: 'golden-hour',
        keyLight: { intensity: 0.9, color: '#ffa500', direction: 'side', softness: 0.7 },
        fillLight: { intensity: 0.4, color: '#ffb347', direction: 'front', softness: 0.8 },
        backLight: { intensity: 0.8, color: '#ff6347', direction: 'back', softness: 0.6 },
        practicalLights: []
      };
    }
    
    if (words.includes('bright') || words.includes('day') || words.includes('sunny')) {
      return {
        mood: 'bright',
        keyLight: { intensity: 1.0, color: '#ffffff', direction: 'top', softness: 0.9 },
        fillLight: { intensity: 0.6, color: '#f0f8ff', direction: 'front', softness: 0.9 },
        backLight: { intensity: 0.3, color: '#ffffff', direction: 'back', softness: 0.8 },
        practicalLights: []
      };
    }
    
    if (words.includes('moody') || words.includes('atmospheric') || words.includes('dramatic')) {
      return {
        mood: 'dramatic',
        keyLight: { intensity: 0.7, color: '#ffffff', direction: 'side', softness: 0.2 },
        fillLight: { intensity: 0.1, color: '#4682b4', direction: 'front', softness: 0.9 },
        backLight: { intensity: 0.9, color: '#ffffff', direction: 'back', softness: 0.1 },
        practicalLights: []
      };
    }
    
    // Default natural lighting
    return {
      mood: 'natural',
      keyLight: { intensity: 0.8, color: '#ffffff', direction: 'front', softness: 0.7 },
      fillLight: { intensity: 0.4, color: '#f0f8ff', direction: 'side', softness: 0.8 },
      backLight: { intensity: 0.5, color: '#ffffff', direction: 'back', softness: 0.6 },
      practicalLights: []
    };
  }

  static generateCharacterPositions(description: string): CharacterPosition[] {
    const characters: CharacterPosition[] = [];
    const words = description.toLowerCase();
    
    // Extract character mentions
    const characterKeywords = ['person', 'character', 'actor', 'subject', 'individual', 'man', 'woman', 'child'];
    const characterCount = characterKeywords.reduce((count, keyword) => {
      const matches = (description.match(new RegExp(keyword, 'gi')) || []).length;
      return count + matches;
    }, 0);
    
    const actualCount = Math.min(Math.max(characterCount, 1), 4); // Limit to 4 characters
    
    for (let i = 0; i < actualCount; i++) {
      const position = this.calculateCharacterPosition(i, actualCount);
      
      characters.push({
        id: this.generateId(),
        name: `Character ${i + 1}`,
        x: position.x,
        y: position.y,
        facing: this.inferCharacterFacing(description, i),
        action: this.inferCharacterAction(description, i),
        emotion: this.inferCharacterEmotion(description, i)
      });
    }
    
    return characters;
  }

  private static calculateCharacterPosition(index: number, total: number): { x: number; y: number } {
    const canvasWidth = 800;
    const canvasHeight = 450;
    
    if (total === 1) {
      return { x: canvasWidth / 2, y: canvasHeight * 0.7 };
    }
    
    if (total === 2) {
      return {
        x: index === 0 ? canvasWidth * 0.3 : canvasWidth * 0.7,
        y: canvasHeight * 0.7
      };
    }
    
    // For 3+ characters, distribute across the frame
    const spacing = canvasWidth / (total + 1);
    return {
      x: spacing * (index + 1),
      y: canvasHeight * 0.7
    };
  }

  private static inferCharacterFacing(description: string, index: number): 'left' | 'right' | 'forward' | 'back' {
    const words = description.toLowerCase();
    
    if (words.includes('conversation') || words.includes('talking')) {
      return index % 2 === 0 ? 'right' : 'left';
    }
    
    if (words.includes('leaving') || words.includes('exit')) {
      return 'back';
    }
    
    if (words.includes('approaching') || words.includes('coming')) {
      return 'forward';
    }
    
    return 'forward';
  }

  private static inferCharacterAction(description: string, index: number): string {
    const words = description.toLowerCase();
    
    if (words.includes('walking')) return 'walking';
    if (words.includes('running')) return 'running';
    if (words.includes('sitting')) return 'sitting';
    if (words.includes('standing')) return 'standing';
    if (words.includes('pointing')) return 'pointing';
    if (words.includes('gesturing')) return 'gesturing';
    if (words.includes('talking') || words.includes('speaking')) return 'talking';
    if (words.includes('looking')) return 'looking';
    
    return 'standing';
  }

  private static inferCharacterEmotion(description: string, index: number): string {
    const words = description.toLowerCase();
    
    if (words.includes('happy') || words.includes('joy')) return 'happy';
    if (words.includes('sad') || words.includes('crying')) return 'sad';
    if (words.includes('angry') || words.includes('mad')) return 'angry';
    if (words.includes('surprised') || words.includes('shocked')) return 'surprised';
    if (words.includes('scared') || words.includes('afraid')) return 'scared';
    if (words.includes('confused') || words.includes('puzzled')) return 'confused';
    if (words.includes('excited') || words.includes('enthusiastic')) return 'excited';
    if (words.includes('calm') || words.includes('peaceful')) return 'calm';
    
    return 'neutral';
  }

  static generateProps(description: string): PropItem[] {
    const props: PropItem[] = [];
    const words = description.toLowerCase();
    
    // Common props based on context
    const propKeywords = {
      'table': { name: 'Table', importance: 'secondary' as const },
      'chair': { name: 'Chair', importance: 'secondary' as const },
      'car': { name: 'Car', importance: 'primary' as const },
      'phone': { name: 'Phone', importance: 'primary' as const },
      'book': { name: 'Book', importance: 'secondary' as const },
      'computer': { name: 'Computer', importance: 'primary' as const },
      'door': { name: 'Door', importance: 'secondary' as const },
      'window': { name: 'Window', importance: 'background' as const },
      'lamp': { name: 'Lamp', importance: 'background' as const },
      'tree': { name: 'Tree', importance: 'background' as const }
    };
    
    Object.entries(propKeywords).forEach(([keyword, propData], index) => {
      if (words.includes(keyword)) {
        props.push({
          id: this.generateId(),
          name: propData.name,
          x: 100 + (index * 150),
          y: 300 + (Math.random() * 100),
          importance: propData.importance
        });
      }
    });
    
    return props;
  }

  static suggestTransition(currentFrame: Partial<StoryboardFrame>, nextFrame?: Partial<StoryboardFrame>): TransitionType {
    if (!nextFrame) return 'cut';
    
    const currentDesc = currentFrame.description?.toLowerCase() || '';
    const nextDesc = nextFrame.description?.toLowerCase() || '';
    
    // Time-based transitions
    if (currentDesc.includes('day') && nextDesc.includes('night') ||
        currentDesc.includes('night') && nextDesc.includes('day')) {
      return 'dissolve';
    }
    
    // Location changes
    if (currentDesc.includes('indoor') && nextDesc.includes('outdoor') ||
        currentDesc.includes('outdoor') && nextDesc.includes('indoor')) {
      return 'fade-out';
    }
    
    // Emotional transitions
    if (currentDesc.includes('calm') && nextDesc.includes('action') ||
        currentDesc.includes('quiet') && nextDesc.includes('loud')) {
      return 'cut';
    }
    
    // Similar content
    if (currentFrame.shotType === nextFrame.shotType) {
      return 'dissolve';
    }
    
    return 'cut';
  }

  static generateVoiceoverCue(description: string, duration: number): VoiceoverCue {
    const words = description.toLowerCase();
    
    let tone = 'neutral';
    if (words.includes('dramatic') || words.includes('intense')) tone = 'dramatic';
    if (words.includes('calm') || words.includes('peaceful')) tone = 'calm';
    if (words.includes('excited') || words.includes('energetic')) tone = 'energetic';
    if (words.includes('mysterious') || words.includes('suspenseful')) tone = 'mysterious';
    
    // Generate sample voiceover text based on description
    const voiceoverText = this.generateVoiceoverText(description);
    
    return {
      text: voiceoverText,
      startTime: 0,
      duration: duration * 0.8, // Leave some breathing room
      speaker: 'Narrator',
      tone
    };
  }

  private static generateVoiceoverText(description: string): string {
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) {
      return 'Scene description...';
    }
    
    // Take the first sentence and make it more narrative
    const firstSentence = sentences[0].trim();
    
    // Add narrative flair
    if (firstSentence.includes('character') || firstSentence.includes('person')) {
      return `We see ${firstSentence.toLowerCase()}...`;
    }
    
    if (firstSentence.includes('location') || firstSentence.includes('setting')) {
      return `The scene opens with ${firstSentence.toLowerCase()}...`;
    }
    
    return `${firstSentence}...`;
  }

  static generateAudioCues(description: string, duration: number): AudioCue[] {
    const cues: AudioCue[] = [];
    const words = description.toLowerCase();
    
    // Background music based on mood
    if (words.includes('dramatic') || words.includes('intense')) {
      cues.push({
        id: this.generateId(),
        type: 'music',
        description: 'Dramatic orchestral music',
        startTime: 0,
        duration: duration,
        volume: 0.6
      });
    }
    
    if (words.includes('calm') || words.includes('peaceful')) {
      cues.push({
        id: this.generateId(),
        type: 'music',
        description: 'Soft ambient music',
        startTime: 0,
        duration: duration,
        volume: 0.4
      });
    }
    
    // Sound effects based on content
    if (words.includes('car') || words.includes('driving')) {
      cues.push({
        id: this.generateId(),
        type: 'sfx',
        description: 'Car engine sound',
        startTime: 0,
        duration: duration * 0.5,
        volume: 0.7
      });
    }
    
    if (words.includes('door')) {
      cues.push({
        id: this.generateId(),
        type: 'sfx',
        description: 'Door opening/closing',
        startTime: duration * 0.2,
        duration: 2,
        volume: 0.8
      });
    }
    
    if (words.includes('phone')) {
      cues.push({
        id: this.generateId(),
        type: 'sfx',
        description: 'Phone ringing',
        startTime: 0,
        duration: 3,
        volume: 0.9
      });
    }
    
    // Ambient sounds based on location
    if (words.includes('outdoor') || words.includes('outside')) {
      cues.push({
        id: this.generateId(),
        type: 'ambient',
        description: 'Outdoor ambience',
        startTime: 0,
        duration: duration,
        volume: 0.3
      });
    }
    
    if (words.includes('indoor') || words.includes('room')) {
      cues.push({
        id: this.generateId(),
        type: 'ambient',
        description: 'Room tone',
        startTime: 0,
        duration: duration,
        volume: 0.2
      });
    }
    
    return cues;
  }

  static async generateFrameFromText(description: string, index: number = 0): Promise<StoryboardFrame> {
    const analysis = await this.analyzeTextDescription(description);
    const shotSequence = this.generateShotSequence(description);
    const shotType = shotSequence[0] || 'medium';
    
    return {
      id: this.generateId(),
      title: `Scene ${index + 1}`,
      description,
      shotType,
      cameraAngle: this.suggestCameraAngle(description, shotType),
      cameraMovement: this.suggestCameraMovement(description, shotType),
      lighting: this.generateLightingSetup(description),
      colorPalette: this.generateColorPalette(description),
      characters: this.generateCharacterPositions(description),
      props: this.generateProps(description),
      transition: 'cut',
      voiceover: this.generateVoiceoverCue(description, 5),
      audioCues: this.generateAudioCues(description, 5),
      duration: 5,
      notes: analysis.suggestions.join('; '),
      canvas: {
        objects: [],
        background: '#f0f0f0',
        dimensions: { width: 800, height: 450 }
      },
      timestamp: Date.now()
    };
  }
}