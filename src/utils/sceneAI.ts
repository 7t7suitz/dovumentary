import { 
  Scene, 
  VisualComposition, 
  LightingSetup, 
  AudioDesign, 
  Shot, 
  EquipmentList,
  ProductionSchedule,
  WeatherConsiderations,
  BudgetEstimate,
  LocationDetails,
  SceneTemplate
} from '../types/scene';

export class SceneAI {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static async analyzeSceneDescription(description: string): Promise<Scene> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const scene: Scene = {
      id: this.generateId(),
      title: this.extractSceneTitle(description),
      description,
      location: this.analyzeLocation(description),
      visualComposition: this.generateVisualComposition(description),
      lighting: this.generateLightingSetup(description),
      audio: this.generateAudioDesign(description),
      shotList: this.generateShotList(description),
      equipment: this.generateEquipmentList(description),
      schedule: this.generateProductionSchedule(description),
      weather: this.generateWeatherConsiderations(description),
      budget: this.generateBudgetEstimate(description),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return scene;
  }

  private static extractSceneTitle(description: string): string {
    const sentences = description.split(/[.!?]+/);
    const firstSentence = sentences[0]?.trim();
    
    if (firstSentence && firstSentence.length < 50) {
      return firstSentence;
    }
    
    // Extract key elements for title
    const words = description.toLowerCase().split(/\s+/);
    const locationWords = ['office', 'park', 'home', 'street', 'restaurant', 'car', 'beach', 'forest'];
    const actionWords = ['interview', 'meeting', 'walking', 'driving', 'cooking', 'working'];
    
    const location = locationWords.find(word => words.includes(word));
    const action = actionWords.find(word => words.includes(word));
    
    if (location && action) {
      return `${action.charAt(0).toUpperCase() + action.slice(1)} at ${location}`;
    }
    
    return 'Scene';
  }

  private static analyzeLocation(description: string): LocationDetails {
    const words = description.toLowerCase();
    
    let locationType: any = 'indoor-practical';
    if (words.includes('outdoor') || words.includes('outside') || words.includes('park') || words.includes('street')) {
      locationType = 'outdoor-urban';
    }
    if (words.includes('nature') || words.includes('forest') || words.includes('beach') || words.includes('mountain')) {
      locationType = 'outdoor-nature';
    }
    if (words.includes('studio') || words.includes('controlled')) {
      locationType = 'indoor-studio';
    }
    if (words.includes('car') || words.includes('vehicle') || words.includes('driving')) {
      locationType = 'vehicle';
    }

    const locationName = this.extractLocationName(description);

    return {
      type: locationType,
      name: locationName,
      accessibility: {
        vehicleAccess: !words.includes('remote') && !words.includes('hiking'),
        loadingAccess: locationType.includes('indoor') || words.includes('accessible'),
        powerAvailable: locationType.includes('indoor') || words.includes('power'),
        restrooms: locationType.includes('indoor') || words.includes('facilities'),
        parking: !words.includes('downtown') && !words.includes('busy'),
        publicTransport: words.includes('city') || words.includes('urban'),
        wheelchairAccessible: locationType.includes('indoor') || words.includes('accessible')
      },
      permits: {
        required: locationType.includes('outdoor') || words.includes('public'),
        type: locationType.includes('outdoor') ? ['filming permit', 'location permit'] : undefined,
        cost: locationType.includes('outdoor') ? 200 : 0,
        processingTime: 7
      },
      alternatives: this.generateAlternativeLocations(description, locationType),
      scouting: {
        bestTimeOfDay: this.suggestBestTimes(description),
        challenges: this.identifyLocationChallenges(description, locationType),
        opportunities: this.identifyLocationOpportunities(description, locationType)
      }
    };
  }

  private static extractLocationName(description: string): string {
    const locationKeywords = {
      'office': 'Corporate Office',
      'park': 'City Park',
      'home': 'Residential Home',
      'restaurant': 'Restaurant',
      'cafe': 'Coffee Shop',
      'street': 'Urban Street',
      'beach': 'Beach Location',
      'forest': 'Forest Location',
      'studio': 'Production Studio',
      'car': 'Vehicle Interior'
    };

    const words = description.toLowerCase();
    for (const [keyword, name] of Object.entries(locationKeywords)) {
      if (words.includes(keyword)) {
        return name;
      }
    }

    return 'Location';
  }

  private static generateAlternativeLocations(description: string, primaryType: string): any[] {
    const alternatives = [];
    
    if (primaryType === 'outdoor-urban') {
      alternatives.push({
        name: 'Indoor Studio with Urban Backdrop',
        reason: 'Weather contingency',
        pros: ['Controlled environment', 'Consistent lighting', 'No permits needed'],
        cons: ['Less authentic', 'Higher cost', 'Limited space']
      });
    }
    
    if (primaryType === 'indoor-practical') {
      alternatives.push({
        name: 'Similar Indoor Location',
        reason: 'Backup option',
        pros: ['Similar aesthetic', 'Controlled environment'],
        cons: ['May require additional permits', 'Different acoustics']
      });
    }

    return alternatives;
  }

  private static suggestBestTimes(description: string): string[] {
    const words = description.toLowerCase();
    const times = [];

    if (words.includes('golden') || words.includes('sunset') || words.includes('warm')) {
      times.push('Golden Hour (1 hour before sunset)');
    }
    if (words.includes('morning') || words.includes('fresh') || words.includes('dawn')) {
      times.push('Early Morning (7-9 AM)');
    }
    if (words.includes('dramatic') || words.includes('moody')) {
      times.push('Blue Hour (30 min after sunset)');
    }
    if (words.includes('bright') || words.includes('energetic')) {
      times.push('Midday (11 AM - 2 PM)');
    }

    return times.length > 0 ? times : ['Golden Hour (1 hour before sunset)', 'Early Morning (7-9 AM)'];
  }

  private static identifyLocationChallenges(description: string, locationType: string): string[] {
    const challenges = [];
    const words = description.toLowerCase();

    if (locationType.includes('outdoor')) {
      challenges.push('Weather dependency');
      challenges.push('Natural lighting changes');
      if (words.includes('public') || words.includes('busy')) {
        challenges.push('Crowd control');
        challenges.push('Background noise');
      }
    }

    if (locationType === 'vehicle') {
      challenges.push('Limited space for equipment');
      challenges.push('Vibration and movement');
      challenges.push('Power limitations');
    }

    if (words.includes('echo') || words.includes('large')) {
      challenges.push('Audio reverberation');
    }

    return challenges;
  }

  private static identifyLocationOpportunities(description: string, locationType: string): string[] {
    const opportunities = [];
    const words = description.toLowerCase();

    if (words.includes('natural') || words.includes('authentic')) {
      opportunities.push('Natural, authentic environment');
    }
    if (words.includes('beautiful') || words.includes('scenic')) {
      opportunities.push('Visually striking background');
    }
    if (locationType.includes('indoor')) {
      opportunities.push('Controlled lighting conditions');
      opportunities.push('Consistent audio environment');
    }

    return opportunities;
  }

  private static generateVisualComposition(description: string): VisualComposition {
    const words = description.toLowerCase();
    
    // Determine mood
    let mood: any = 'peaceful';
    if (words.includes('dramatic') || words.includes('intense')) mood = 'dramatic';
    if (words.includes('intimate') || words.includes('close') || words.includes('personal')) mood = 'intimate';
    if (words.includes('energetic') || words.includes('dynamic') || words.includes('action')) mood = 'energetic';
    if (words.includes('mysterious') || words.includes('dark') || words.includes('shadow')) mood = 'mysterious';
    if (words.includes('romantic') || words.includes('love') || words.includes('tender')) mood = 'romantic';

    // Generate color palette
    const colorPalette = this.generateColorPalette(description, mood);

    // Determine cinematography style
    let cinematography: any = 'documentary';
    if (words.includes('cinematic') || words.includes('film')) cinematography = 'cinematic';
    if (words.includes('handheld') || words.includes('raw') || words.includes('gritty')) cinematography = 'handheld';
    if (words.includes('static') || words.includes('formal')) cinematography = 'static';
    if (words.includes('dynamic') || words.includes('movement')) cinematography = 'dynamic';

    return {
      mood,
      colorPalette,
      style: {
        cinematography,
        influences: this.getStyleInfluences(mood, cinematography),
        references: this.getStyleReferences(description),
        techniques: this.getSuggestedTechniques(description)
      },
      framing: {
        composition: this.suggestCompositionRules(description),
        subjectPlacement: this.suggestSubjectPlacement(description),
        backgroundTreatment: this.suggestBackgroundTreatment(description),
        foregroundElements: this.suggestForegroundElements(description)
      },
      movement: {
        type: this.suggestCameraMovement(description),
        motivation: this.getCameraMovementMotivation(description),
        speed: words.includes('slow') || words.includes('gentle') ? 'slow' : 
               words.includes('fast') || words.includes('quick') ? 'fast' : 'medium',
        smoothness: cinematography === 'handheld' ? 'handheld' : 'smooth'
      },
      depth: {
        layers: this.generateDepthLayers(description),
        focusStrategy: this.suggestFocusStrategy(description),
        bokehQuality: mood === 'romantic' || mood === 'intimate' ? 'dreamy' : 'medium'
      }
    };
  }

  private static generateColorPalette(description: string, mood: string): any {
    const words = description.toLowerCase();
    
    // Base palettes by mood
    const moodPalettes: { [key: string]: any } = {
      dramatic: {
        primary: '#1a1a1a',
        secondary: '#8b0000',
        accent: '#ffd700',
        background: '#2c2c2c',
        temperature: 'cool',
        saturation: 'high',
        contrast: 'high'
      },
      intimate: {
        primary: '#8b4513',
        secondary: '#daa520',
        accent: '#fff8dc',
        background: '#2f1b14',
        temperature: 'warm',
        saturation: 'medium',
        contrast: 'medium'
      },
      energetic: {
        primary: '#ff4500',
        secondary: '#ffa500',
        accent: '#ffff00',
        background: '#ffffff',
        temperature: 'warm',
        saturation: 'high',
        contrast: 'high'
      },
      peaceful: {
        primary: '#4682b4',
        secondary: '#87ceeb',
        accent: '#f0f8ff',
        background: '#e6f3ff',
        temperature: 'cool',
        saturation: 'low',
        contrast: 'low'
      },
      mysterious: {
        primary: '#191970',
        secondary: '#483d8b',
        accent: '#9370db',
        background: '#0f0f23',
        temperature: 'cool',
        saturation: 'medium',
        contrast: 'high'
      }
    };

    let palette = moodPalettes[mood] || moodPalettes.peaceful;

    // Adjust based on description
    if (words.includes('warm') || words.includes('sunset') || words.includes('golden')) {
      palette.temperature = 'warm';
      palette.primary = '#d2691e';
      palette.secondary = '#daa520';
    }
    if (words.includes('cool') || words.includes('blue') || words.includes('cold')) {
      palette.temperature = 'cool';
      palette.primary = '#4682b4';
      palette.secondary = '#87ceeb';
    }

    return palette;
  }

  private static getStyleInfluences(mood: string, cinematography: string): string[] {
    const influences = [];
    
    if (mood === 'dramatic') {
      influences.push('Film Noir', 'Chiaroscuro Lighting', 'German Expressionism');
    }
    if (mood === 'intimate') {
      influences.push('Dogme 95', 'Mumblecore', 'Terrence Malick');
    }
    if (cinematography === 'documentary') {
      influences.push('Cinema Verite', 'Direct Cinema', 'Observational Documentary');
    }
    if (cinematography === 'cinematic') {
      influences.push('Classical Hollywood', 'European Art Cinema', 'Contemporary Blockbuster');
    }

    return influences;
  }

  private static getStyleReferences(description: string): string[] {
    const words = description.toLowerCase();
    const references = [];

    if (words.includes('interview') || words.includes('conversation')) {
      references.push('Errol Morris documentaries', 'Charlie Rose interviews');
    }
    if (words.includes('nature') || words.includes('outdoor')) {
      references.push('Planet Earth series', 'Terrence Malick films');
    }
    if (words.includes('urban') || words.includes('city')) {
      references.push('Michael Mann films', 'Wong Kar-wai cinematography');
    }

    return references;
  }

  private static getSuggestedTechniques(description: string): string[] {
    const words = description.toLowerCase();
    const techniques = [];

    if (words.includes('dramatic') || words.includes('intense')) {
      techniques.push('High contrast lighting', 'Dutch angles', 'Close-up emphasis');
    }
    if (words.includes('intimate') || words.includes('personal')) {
      techniques.push('Shallow depth of field', 'Natural lighting', 'Handheld camera');
    }
    if (words.includes('movement') || words.includes('dynamic')) {
      techniques.push('Tracking shots', 'Gimbal movements', 'Rack focus');
    }

    return techniques;
  }

  private static suggestCompositionRules(description: string): any[] {
    const words = description.toLowerCase();
    const rules = [];

    if (words.includes('balanced') || words.includes('formal')) {
      rules.push('center-composition', 'symmetry');
    } else {
      rules.push('rule-of-thirds');
    }

    if (words.includes('leading') || words.includes('path') || words.includes('direction')) {
      rules.push('leading-lines');
    }

    if (words.includes('frame') || words.includes('window') || words.includes('door')) {
      rules.push('frame-within-frame');
    }

    return rules.length > 0 ? rules : ['rule-of-thirds'];
  }

  private static suggestSubjectPlacement(description: string): string {
    const words = description.toLowerCase();

    if (words.includes('center') || words.includes('formal') || words.includes('direct')) {
      return 'Center frame for direct engagement';
    }
    if (words.includes('side') || words.includes('profile')) {
      return 'Off-center for dynamic composition';
    }
    if (words.includes('interview') || words.includes('conversation')) {
      return 'Slightly off-center, maintaining eye contact with camera';
    }

    return 'Rule of thirds placement for natural composition';
  }

  private static suggestBackgroundTreatment(description: string): string {
    const words = description.toLowerCase();

    if (words.includes('blur') || words.includes('focus') || words.includes('intimate')) {
      return 'Soft blur to isolate subject';
    }
    if (words.includes('context') || words.includes('environment') || words.includes('setting')) {
      return 'Sharp background to show environment';
    }
    if (words.includes('clean') || words.includes('simple')) {
      return 'Minimal, uncluttered background';
    }

    return 'Balanced background that supports but doesn\'t distract from subject';
  }

  private static suggestForegroundElements(description: string): string[] {
    const words = description.toLowerCase();
    const elements = [];

    if (words.includes('depth') || words.includes('layers')) {
      elements.push('Natural foreground elements for depth');
    }
    if (words.includes('frame') || words.includes('border')) {
      elements.push('Architectural elements for framing');
    }
    if (words.includes('nature') || words.includes('outdoor')) {
      elements.push('Natural elements like branches or foliage');
    }

    return elements;
  }

  private static suggestCameraMovement(description: string): any {
    const words = description.toLowerCase();

    if (words.includes('follow') || words.includes('track') || words.includes('walking')) {
      return 'track';
    }
    if (words.includes('reveal') || words.includes('pan') || words.includes('sweep')) {
      return 'pan';
    }
    if (words.includes('approach') || words.includes('closer') || words.includes('dolly')) {
      return 'dolly';
    }
    if (words.includes('handheld') || words.includes('raw') || words.includes('documentary')) {
      return 'handheld';
    }
    if (words.includes('smooth') || words.includes('gimbal') || words.includes('flowing')) {
      return 'gimbal';
    }
    if (words.includes('aerial') || words.includes('overhead') || words.includes('drone')) {
      return 'drone';
    }

    return 'static';
  }

  private static getCameraMovementMotivation(description: string): string {
    const words = description.toLowerCase();

    if (words.includes('follow')) {
      return 'Following subject movement';
    }
    if (words.includes('reveal')) {
      return 'Revealing new information or space';
    }
    if (words.includes('intimate') || words.includes('close')) {
      return 'Creating intimacy and connection';
    }
    if (words.includes('energy') || words.includes('dynamic')) {
      return 'Adding energy and dynamism';
    }

    return 'Supporting narrative flow';
  }

  private static generateDepthLayers(description: string): any[] {
    const layers = [
      {
        name: 'Subject Layer',
        distance: 'midground' as const,
        elements: ['Primary subject'],
        treatment: 'Sharp focus, well-lit'
      }
    ];

    const words = description.toLowerCase();

    if (words.includes('background') || words.includes('setting') || words.includes('environment')) {
      layers.push({
        name: 'Background Layer',
        distance: 'background' as const,
        elements: ['Environmental context'],
        treatment: 'Soft focus or sharp depending on intent'
      });
    }

    if (words.includes('foreground') || words.includes('frame') || words.includes('depth')) {
      layers.unshift({
        name: 'Foreground Layer',
        distance: 'foreground' as const,
        elements: ['Framing elements'],
        treatment: 'Out of focus for depth'
      });
    }

    return layers;
  }

  private static suggestFocusStrategy(description: string): any {
    const words = description.toLowerCase();

    if (words.includes('shallow') || words.includes('blur') || words.includes('intimate')) {
      return 'shallow-focus';
    }
    if (words.includes('rack') || words.includes('shift') || words.includes('change')) {
      return 'rack-focus';
    }
    if (words.includes('everything') || words.includes('sharp') || words.includes('documentary')) {
      return 'deep-focus';
    }

    return 'selective-focus';
  }

  private static generateLightingSetup(description: string): LightingSetup {
    const words = description.toLowerCase();
    
    // Determine lighting style
    let style: any = 'natural';
    if (words.includes('dramatic') || words.includes('contrast')) style = 'dramatic';
    if (words.includes('soft') || words.includes('gentle')) style = 'soft';
    if (words.includes('hard') || words.includes('sharp')) style = 'hard';
    if (words.includes('practical') || words.includes('lamp') || words.includes('window')) style = 'practical';

    // Determine mood
    let mood: any = 'bright';
    if (words.includes('moody') || words.includes('dark')) mood = 'moody';
    if (words.includes('romantic') || words.includes('warm')) mood = 'romantic';
    if (words.includes('mysterious') || words.includes('shadow')) mood = 'mysterious';
    if (words.includes('energetic') || words.includes('vibrant')) mood = 'energetic';

    // Determine time of day
    let timeOfDay: any = 'artificial';
    if (words.includes('golden') || words.includes('sunset')) timeOfDay = 'golden-hour';
    if (words.includes('blue') || words.includes('dusk')) timeOfDay = 'blue-hour';
    if (words.includes('midday') || words.includes('noon')) timeOfDay = 'midday';
    if (words.includes('night') || words.includes('evening')) timeOfDay = 'night';
    if (words.includes('dawn') || words.includes('morning')) timeOfDay = 'dawn';

    return {
      style,
      mood,
      timeOfDay,
      sources: this.generateLightSources(description, style, mood),
      modifiers: this.generateLightModifiers(style, mood),
      colorTemperature: {
        kelvin: timeOfDay === 'golden-hour' ? 3200 : timeOfDay === 'blue-hour' ? 5600 : 5600,
        description: timeOfDay === 'golden-hour' ? 'Warm tungsten' : 'Daylight balanced',
        mixing: timeOfDay === 'artificial'
      },
      contrast: style === 'dramatic' ? 'high' : style === 'soft' ? 'low' : 'medium'
    };
  }

  private static generateLightSources(description: string, style: string, mood: string): any[] {
    const sources = [];
    
    // Key light
    sources.push({
      id: this.generateId(),
      type: 'key',
      position: 'Camera left, 45 degrees',
      intensity: style === 'dramatic' ? 0.8 : 0.6,
      color: '#ffffff',
      purpose: 'subject-illumination',
      equipment: 'LED Panel 1x1 or Tungsten Fresnel'
    });

    // Fill light
    if (style !== 'dramatic') {
      sources.push({
        id: this.generateId(),
        type: 'fill',
        position: 'Camera right, lower intensity',
        intensity: 0.3,
        color: '#f0f8ff',
        purpose: 'subject-illumination',
        equipment: 'Softbox or Bounce Card'
      });
    }

    // Back light
    sources.push({
      id: this.generateId(),
      type: 'back',
      position: 'Behind subject, elevated',
      intensity: 0.5,
      color: '#ffffff',
      purpose: 'background-separation',
      equipment: 'LED Panel or Hair Light'
    });

    // Practical lights based on description
    const words = description.toLowerCase();
    if (words.includes('lamp') || words.includes('window') || words.includes('practical')) {
      sources.push({
        id: this.generateId(),
        type: 'practical',
        position: 'In scene as motivated source',
        intensity: 0.4,
        color: '#ffa500',
        purpose: 'mood-creation',
        equipment: 'Practical lamp or window light'
      });
    }

    return sources;
  }

  private static generateLightModifiers(style: string, mood: string): any[] {
    const modifiers = [];

    if (style === 'soft' || mood === 'romantic') {
      modifiers.push({
        type: 'softbox',
        size: '2x3 feet',
        effect: 'Soft, even illumination'
      });
      modifiers.push({
        type: 'diffusion',
        size: '4x4 feet',
        effect: 'Overall softening'
      });
    }

    if (style === 'dramatic') {
      modifiers.push({
        type: 'barn-doors',
        size: 'Standard',
        effect: 'Precise light control'
      });
      modifiers.push({
        type: 'flag',
        size: '2x3 feet',
        effect: 'Shadow creation'
      });
    }

    if (mood === 'energetic' || mood === 'vibrant') {
      modifiers.push({
        type: 'gel',
        size: 'Full CTO/CTB',
        effect: 'Color temperature adjustment'
      });
    }

    return modifiers;
  }

  private static generateAudioDesign(description: string): AudioDesign {
    const words = description.toLowerCase();

    return {
      music: this.generateMusicSelection(description),
      soundEffects: this.generateSoundEffects(description),
      ambience: this.generateAmbienceTrack(description),
      dialogue: this.generateDialogueConsiderations(description),
      recording: {
        format: {
          container: 'WAV',
          codec: 'PCM',
          quality: 'Uncompressed'
        },
        sampleRate: 48000,
        bitDepth: 24,
        channels: 2,
        equipment: ['Audio Recorder', 'Boom Microphone', 'Wireless Lavalier', 'Headphones']
      }
    };
  }

  private static generateMusicSelection(description: string): any {
    const words = description.toLowerCase();
    
    let genre = ['Ambient', 'Cinematic'];
    let mood = ['Neutral', 'Supportive'];
    let tempo = { min: 80, max: 120, description: 'Moderate tempo' };

    if (words.includes('dramatic') || words.includes('intense')) {
      genre = ['Orchestral', 'Cinematic', 'Drama'];
      mood = ['Dramatic', 'Intense', 'Building'];
      tempo = { min: 100, max: 140, description: 'Building tempo' };
    }

    if (words.includes('peaceful') || words.includes('calm')) {
      genre = ['Ambient', 'New Age', 'Minimal'];
      mood = ['Peaceful', 'Calm', 'Meditative'];
      tempo = { min: 60, max: 90, description: 'Slow, peaceful tempo' };
    }

    if (words.includes('energetic') || words.includes('action')) {
      genre = ['Electronic', 'Rock', 'Upbeat'];
      mood = ['Energetic', 'Driving', 'Motivational'];
      tempo = { min: 120, max: 160, description: 'Fast, driving tempo' };
    }

    return {
      genre,
      mood,
      tempo,
      instrumentation: this.suggestInstrumentation(genre),
      references: this.getMusicReferences(genre, mood),
      licensing: {
        type: 'royalty-free' as const,
        cost: 50,
        restrictions: ['Attribution required', 'Commercial use allowed']
      }
    };
  }

  private static suggestInstrumentation(genre: string[]): string[] {
    if (genre.includes('Orchestral')) {
      return ['Strings', 'Brass', 'Woodwinds', 'Percussion', 'Piano'];
    }
    if (genre.includes('Electronic')) {
      return ['Synthesizers', 'Electronic Drums', 'Bass', 'Pads'];
    }
    if (genre.includes('Ambient')) {
      return ['Pads', 'Strings', 'Piano', 'Subtle Percussion'];
    }
    return ['Piano', 'Strings', 'Light Percussion'];
  }

  private static getMusicReferences(genre: string[], mood: string[]): string[] {
    const references = [];
    
    if (genre.includes('Orchestral') && mood.includes('Dramatic')) {
      references.push('Hans Zimmer - Inception', 'Thomas Newman - American Beauty');
    }
    if (genre.includes('Ambient')) {
      references.push('Brian Eno - Music for Airports', 'Max Richter - Sleep');
    }
    if (genre.includes('Electronic') && mood.includes('Energetic')) {
      references.push('Daft Punk - Tron Legacy', 'Junkie XL - Mad Max');
    }

    return references;
  }

  private static generateSoundEffects(description: string): any[] {
    const words = description.toLowerCase();
    const effects = [];

    if (words.includes('door')) {
      effects.push({
        id: this.generateId(),
        name: 'Door Open/Close',
        description: 'Door opening and closing sound',
        timing: 'As needed during scene',
        volume: 0.7,
        source: 'Foley recording'
      });
    }

    if (words.includes('car') || words.includes('vehicle')) {
      effects.push({
        id: this.generateId(),
        name: 'Vehicle Sounds',
        description: 'Engine, doors, movement',
        timing: 'Throughout vehicle scenes',
        volume: 0.6,
        source: 'Field recording'
      });
    }

    if (words.includes('phone') || words.includes('call')) {
      effects.push({
        id: this.generateId(),
        name: 'Phone Ring/Notification',
        description: 'Phone ringing or notification sound',
        timing: 'Specific moments',
        volume: 0.8,
        source: 'Sound library'
      });
    }

    if (words.includes('footsteps') || words.includes('walking')) {
      effects.push({
        id: this.generateId(),
        name: 'Footsteps',
        description: 'Character movement sounds',
        timing: 'During movement',
        volume: 0.5,
        source: 'Foley recording'
      });
    }

    return effects;
  }

  private static generateAmbienceTrack(description: string): any[] {
    const words = description.toLowerCase();
    const ambience = [];

    if (words.includes('office') || words.includes('indoor')) {
      ambience.push({
        id: this.generateId(),
        environment: 'Indoor Office',
        description: 'Subtle HVAC, distant office sounds',
        volume: 0.2,
        duration: 'Full scene'
      });
    }

    if (words.includes('outdoor') || words.includes('street') || words.includes('city')) {
      ambience.push({
        id: this.generateId(),
        environment: 'Urban Outdoor',
        description: 'Traffic, city sounds, wind',
        volume: 0.3,
        duration: 'Full scene'
      });
    }

    if (words.includes('nature') || words.includes('park') || words.includes('forest')) {
      ambience.push({
        id: this.generateId(),
        environment: 'Natural Environment',
        description: 'Birds, wind, natural sounds',
        volume: 0.25,
        duration: 'Full scene'
      });
    }

    if (words.includes('restaurant') || words.includes('cafe')) {
      ambience.push({
        id: this.generateId(),
        environment: 'Restaurant/Cafe',
        description: 'Distant conversation, kitchen sounds, ambience',
        volume: 0.3,
        duration: 'Full scene'
      });
    }

    return ambience;
  }

  private static generateDialogueConsiderations(description: string): any {
    const words = description.toLowerCase();
    
    let recordingQuality: any = 'sync';
    if (words.includes('noisy') || words.includes('challenging')) {
      recordingQuality = 'adr';
    }

    const micSetup = [];
    
    if (words.includes('interview') || words.includes('conversation')) {
      micSetup.push({
        type: 'lavalier',
        placement: 'On subject, hidden',
        purpose: 'Primary dialogue capture',
        equipment: 'Wireless Lavalier System'
      });
      micSetup.push({
        type: 'boom',
        placement: 'Overhead, out of frame',
        purpose: 'Backup and room tone',
        equipment: 'Shotgun Microphone on Boom Pole'
      });
    }

    if (words.includes('moving') || words.includes('walking')) {
      micSetup.push({
        type: 'wireless',
        placement: 'On subject',
        purpose: 'Mobile dialogue capture',
        equipment: 'Wireless Transmitter/Receiver'
      });
    }

    return {
      recordingQuality,
      microphoneSetup: micSetup,
      acousticTreatment: this.suggestAcousticTreatment(description),
      backupPlans: this.generateAudioBackupPlans(description)
    };
  }

  private static suggestAcousticTreatment(description: string): string[] {
    const words = description.toLowerCase();
    const treatments = [];

    if (words.includes('echo') || words.includes('reverb') || words.includes('large')) {
      treatments.push('Sound blankets for reflection control');
      treatments.push('Portable acoustic panels');
    }

    if (words.includes('noisy') || words.includes('traffic') || words.includes('busy')) {
      treatments.push('Noise isolation techniques');
      treatments.push('Directional microphone positioning');
    }

    if (words.includes('outdoor') || words.includes('wind')) {
      treatments.push('Windscreens and dead cats');
      treatments.push('Wind protection setup');
    }

    return treatments;
  }

  private static generateAudioBackupPlans(description: string): string[] {
    const plans = [
      'Multiple microphone sources for redundancy',
      'Backup audio recorder with safety track',
      'ADR session planning if needed'
    ];

    const words = description.toLowerCase();
    
    if (words.includes('outdoor') || words.includes('challenging')) {
      plans.push('Indoor backup location for audio recording');
      plans.push('Post-production audio enhancement planning');
    }

    return plans;
  }

  private static generateShotList(description: string): Shot[] {
    const shots = [];
    const words = description.toLowerCase();

    // Establishing shot
    shots.push({
      id: this.generateId(),
      number: '1A',
      description: 'Establishing shot of location',
      shotSize: 'wide',
      angle: 'eye-level',
      movement: {
        type: 'static',
        start: 'Wide view',
        end: 'Hold',
        speed: 'N/A',
        equipment: 'Tripod'
      },
      duration: 5,
      equipment: {
        camera: 'Primary camera',
        lens: 'Wide angle lens',
        support: 'Tripod',
        accessories: ['Lens filters']
      },
      lighting: {
        setup: 'Natural or base lighting',
        keyChanges: [],
        specialRequirements: []
      },
      audio: {
        primary: 'Room tone',
        backup: 'Ambient recording',
        monitoring: 'Headphones',
        notes: ['Record clean room tone']
      },
      notes: ['Set the scene context', 'Establish location'],
      alternatives: ['Drone shot if outdoor', 'Gimbal movement for dynamic feel']
    });

    // Medium shot of subject
    if (words.includes('person') || words.includes('character') || words.includes('interview')) {
      shots.push({
        id: this.generateId(),
        number: '2A',
        description: 'Medium shot of primary subject',
        shotSize: 'medium',
        angle: 'eye-level',
        movement: {
          type: 'static',
          start: 'Medium framing',
          end: 'Hold',
          speed: 'N/A',
          equipment: 'Tripod'
        },
        duration: 10,
        equipment: {
          camera: 'Primary camera',
          lens: 'Standard lens (50mm equivalent)',
          support: 'Tripod',
          accessories: ['Lens filters', 'Matte box']
        },
        lighting: {
          setup: 'Key + fill lighting',
          keyChanges: ['Adjust for subject'],
          specialRequirements: ['Eye light', 'Background separation']
        },
        audio: {
          primary: 'Lavalier microphone',
          backup: 'Boom microphone',
          monitoring: 'Wireless monitoring',
          notes: ['Check levels', 'Monitor for clothing rustle']
        },
        notes: ['Focus on subject', 'Ensure good eye contact'],
        alternatives: ['Slight angle for more dynamic feel', 'Handheld for intimacy']
      });
    }

    // Close-up shot
    shots.push({
      id: this.generateId(),
      number: '3A',
      description: 'Close-up for emotional connection',
      shotSize: 'close-up',
      angle: 'eye-level',
      movement: {
        type: 'static',
        start: 'Close framing',
        end: 'Hold',
        speed: 'N/A',
        equipment: 'Tripod'
      },
      duration: 8,
      equipment: {
        camera: 'Primary camera',
        lens: 'Portrait lens (85mm equivalent)',
        support: 'Tripod',
        accessories: ['Lens filters']
      },
      lighting: {
        setup: 'Refined key lighting',
        keyChanges: ['Soften shadows', 'Add eye light'],
        specialRequirements: ['Careful shadow control']
      },
      audio: {
        primary: 'Lavalier microphone',
        backup: 'Boom microphone',
        monitoring: 'Direct monitoring',
        notes: ['Critical audio quality']
      },
      notes: ['Emotional moment', 'Sharp focus on eyes'],
      alternatives: ['Rack focus for emphasis', 'Slight movement for life']
    });

    // Additional shots based on description
    if (words.includes('movement') || words.includes('walking') || words.includes('action')) {
      shots.push({
        id: this.generateId(),
        number: '4A',
        description: 'Tracking shot following movement',
        shotSize: 'medium-wide',
        angle: 'eye-level',
        movement: {
          type: 'track',
          start: 'Behind subject',
          end: 'Following movement',
          speed: 'medium',
          equipment: 'Gimbal or dolly'
        },
        duration: 12,
        equipment: {
          camera: 'Primary camera',
          lens: 'Standard lens',
          support: 'Gimbal stabilizer',
          accessories: ['Follow focus', 'Monitor']
        },
        lighting: {
          setup: 'Natural lighting',
          keyChanges: ['Adapt to changing conditions'],
          specialRequirements: ['Consistent exposure']
        },
        audio: {
          primary: 'Wireless lavalier',
          backup: 'Boom operator following',
          monitoring: 'Wireless monitoring',
          notes: ['Manage cable/wireless range']
        },
        notes: ['Smooth movement', 'Maintain focus'],
        alternatives: ['Handheld for documentary feel', 'Drone for aerial perspective']
      });
    }

    return shots;
  }

  private static generateEquipmentList(description: string): EquipmentList {
    const words = description.toLowerCase();
    
    return {
      camera: {
        body: 'Professional Cinema Camera',
        specifications: {
          sensor: 'Full Frame CMOS',
          resolution: '4K UHD',
          frameRates: [24, 30, 60, 120],
          codecs: ['ProRes 422', 'H.264', 'RAW'],
          lowLight: 'ISO 3200 native, 12800 max'
        },
        alternatives: ['DSLR/Mirrorless alternative', 'Broadcast camera'],
        cost: 500,
        availability: 'Rental house'
      },
      lenses: this.generateLensEquipment(description),
      lighting: this.generateLightingEquipment(description),
      audio: this.generateAudioEquipmentList(description),
      support: this.generateSupportEquipment(description),
      accessories: this.generateAccessoryEquipment(description),
      power: this.generatePowerEquipment(description),
      storage: this.generateStorageEquipment(description)
    };
  }

  private static generateLensEquipment(description: string): any[] {
    const lenses = [
      {
        model: '24-70mm f/2.8',
        focalLength: '24-70mm',
        aperture: 'f/2.8',
        purpose: 'Primary versatile lens',
        cost: 100
      },
      {
        model: '85mm f/1.4',
        focalLength: '85mm',
        aperture: 'f/1.4',
        purpose: 'Portrait and close-ups',
        cost: 75
      }
    ];

    const words = description.toLowerCase();
    
    if (words.includes('wide') || words.includes('establishing') || words.includes('landscape')) {
      lenses.push({
        model: '16-35mm f/2.8',
        focalLength: '16-35mm',
        aperture: 'f/2.8',
        purpose: 'Wide establishing shots',
        cost: 90
      });
    }

    if (words.includes('telephoto') || words.includes('distant') || words.includes('compression')) {
      lenses.push({
        model: '70-200mm f/2.8',
        focalLength: '70-200mm',
        aperture: 'f/2.8',
        purpose: 'Telephoto and compression',
        cost: 120
      });
    }

    return lenses;
  }

  private static generateLightingEquipment(description: string): any[] {
    const lighting = [
      {
        type: 'LED Panel',
        model: '1x1 LED Panel',
        power: '100W',
        accessories: ['Barn doors', 'Diffusion'],
        cost: 75
      },
      {
        type: 'Softbox',
        model: '2x3 Softbox Kit',
        power: 'N/A',
        accessories: ['Stand', 'Speed ring'],
        cost: 50
      }
    ];

    const words = description.toLowerCase();
    
    if (words.includes('dramatic') || words.includes('hard')) {
      lighting.push({
        type: 'Fresnel',
        model: 'Tungsten Fresnel',
        power: '650W',
        accessories: ['Barn doors', 'Scrims'],
        cost: 60
      });
    }

    if (words.includes('outdoor') || words.includes('daylight')) {
      lighting.push({
        type: 'HMI',
        model: 'Daylight HMI',
        power: '575W',
        accessories: ['Ballast', 'Safety cable'],
        cost: 150
      });
    }

    return lighting;
  }

  private static generateAudioEquipmentList(description: string): any[] {
    const audio = [
      {
        type: 'Audio Recorder',
        model: 'Professional Field Recorder',
        specifications: '32-bit float, 8 channels',
        purpose: 'Primary audio recording',
        cost: 100
      },
      {
        type: 'Boom Microphone',
        model: 'Shotgun Microphone',
        specifications: 'Super-cardioid, 20Hz-20kHz',
        purpose: 'Boom recording',
        cost: 50
      },
      {
        type: 'Wireless Lavalier',
        model: 'Wireless Lav System',
        specifications: 'UHF, 100m range',
        purpose: 'Subject recording',
        cost: 75
      }
    ];

    const words = description.toLowerCase();
    
    if (words.includes('interview') || words.includes('dialogue')) {
      audio.push({
        type: 'Handheld Microphone',
        model: 'Dynamic Handheld Mic',
        specifications: 'Cardioid, rugged build',
        purpose: 'Interview backup',
        cost: 25
      });
    }

    return audio;
  }

  private static generateSupportEquipment(description: string): any[] {
    const support = [
      {
        type: 'Tripod',
        model: 'Carbon Fiber Tripod',
        capacity: '15kg payload',
        purpose: 'Static shots',
        cost: 75
      }
    ];

    const words = description.toLowerCase();
    
    if (words.includes('movement') || words.includes('dynamic') || words.includes('smooth')) {
      support.push({
        type: 'Gimbal',
        model: '3-Axis Gimbal Stabilizer',
        capacity: '3kg payload',
        purpose: 'Smooth movement',
        cost: 100
      });
    }

    if (words.includes('track') || words.includes('dolly')) {
      support.push({
        type: 'Dolly',
        model: 'Camera Dolly with Track',
        capacity: '50kg payload',
        purpose: 'Tracking shots',
        cost: 200
      });
    }

    return support;
  }

  private static generateAccessoryEquipment(description: string): any[] {
    return [
      {
        name: 'Memory Cards',
        purpose: 'Camera storage',
        quantity: 4,
        cost: 20
      },
      {
        name: 'Batteries',
        purpose: 'Equipment power',
        quantity: 8,
        cost: 40
      },
      {
        name: 'Lens Filters',
        purpose: 'Image control',
        quantity: 3,
        cost: 30
      },
      {
        name: 'Cables',
        purpose: 'Connectivity',
        quantity: 10,
        cost: 25
      }
    ];
  }

  private static generatePowerEquipment(description: string): any[] {
    return [
      {
        type: 'V-Mount Batteries',
        capacity: '150Wh',
        duration: '4-6 hours',
        cost: 60
      },
      {
        type: 'AC Power Adapters',
        capacity: 'Mains power',
        duration: 'Unlimited',
        cost: 20
      },
      {
        type: 'Portable Generator',
        capacity: '2000W',
        duration: '8 hours',
        cost: 100
      }
    ];
  }

  private static generateStorageEquipment(description: string): any[] {
    return [
      {
        type: 'CFexpress Cards',
        capacity: '512GB',
        speed: '1700MB/s',
        cost: 80
      },
      {
        type: 'Portable SSD',
        capacity: '2TB',
        speed: '1000MB/s',
        cost: 60
      },
      {
        type: 'Backup Drive',
        capacity: '4TB',
        speed: '200MB/s',
        cost: 40
      }
    ];
  }

  private static generateProductionSchedule(description: string): ProductionSchedule {
    const shootDate = new Date();
    shootDate.setDate(shootDate.getDate() + 7); // Schedule for next week

    return {
      shootDate,
      callTime: '08:00',
      wrapTime: '18:00',
      timeline: this.generateScheduleBlocks(description),
      crew: this.generateCrewList(description),
      logistics: this.generateLogistics(description)
    };
  }

  private static generateScheduleBlocks(description: string): any[] {
    const blocks = [
      {
        id: this.generateId(),
        startTime: '08:00',
        endTime: '09:00',
        activity: 'Crew Call & Equipment Setup',
        location: 'Base camp',
        crew: ['All crew'],
        equipment: ['All equipment'],
        notes: ['Safety briefing', 'Equipment check']
      },
      {
        id: this.generateId(),
        startTime: '09:00',
        endTime: '10:00',
        activity: 'Location Setup & Lighting',
        location: 'Primary location',
        crew: ['Gaffer', 'Camera', 'Audio'],
        equipment: ['Lighting', 'Camera', 'Audio'],
        notes: ['Test shots', 'Audio levels']
      },
      {
        id: this.generateId(),
        startTime: '10:00',
        endTime: '12:00',
        activity: 'Principal Photography - Setup A',
        location: 'Primary location',
        crew: ['All crew'],
        equipment: ['All equipment'],
        notes: ['Main content capture']
      },
      {
        id: this.generateId(),
        startTime: '12:00',
        endTime: '13:00',
        activity: 'Lunch Break',
        location: 'Catering area',
        crew: ['All crew'],
        equipment: [],
        notes: ['Equipment secured']
      },
      {
        id: this.generateId(),
        startTime: '13:00',
        endTime: '16:00',
        activity: 'Principal Photography - Setup B',
        location: 'Primary location',
        crew: ['All crew'],
        equipment: ['All equipment'],
        notes: ['Coverage shots', 'B-roll']
      },
      {
        id: this.generateId(),
        startTime: '16:00',
        endTime: '17:00',
        activity: 'Pickup Shots & Wrap',
        location: 'Primary location',
        crew: ['All crew'],
        equipment: ['All equipment'],
        notes: ['Final shots', 'Data backup']
      },
      {
        id: this.generateId(),
        startTime: '17:00',
        endTime: '18:00',
        activity: 'Equipment Wrap & Load Out',
        location: 'Base camp',
        crew: ['All crew'],
        equipment: ['All equipment'],
        notes: ['Equipment check', 'Return prep']
      }
    ];

    return blocks;
  }

  private static generateCrewList(description: string): any[] {
    const baseCrew = [
      {
        role: 'Director',
        callTime: '08:00',
        wrapTime: '18:00',
        rate: 500
      },
      {
        role: 'Director of Photography',
        callTime: '08:00',
        wrapTime: '18:00',
        rate: 400
      },
      {
        role: 'Camera Operator',
        callTime: '08:30',
        wrapTime: '17:30',
        rate: 300
      },
      {
        role: 'Audio Engineer',
        callTime: '08:30',
        wrapTime: '17:30',
        rate: 250
      },
      {
        role: 'Gaffer',
        callTime: '08:00',
        wrapTime: '18:00',
        rate: 300
      },
      {
        role: 'Production Assistant',
        callTime: '07:30',
        wrapTime: '18:30',
        rate: 150
      }
    ];

    const words = description.toLowerCase();
    
    if (words.includes('complex') || words.includes('multiple') || words.includes('large')) {
      baseCrew.push({
        role: 'Assistant Camera',
        callTime: '08:30',
        wrapTime: '17:30',
        rate: 200
      });
      baseCrew.push({
        role: 'Grip',
        callTime: '08:30',
        wrapTime: '17:30',
        rate: 200
      });
    }

    return baseCrew;
  }

  private static generateLogistics(description: string): any {
    return {
      transportation: {
        crew: 'Individual vehicles + production van',
        equipment: 'Equipment truck',
        parking: 'Arranged on-site parking',
        costs: 200
      },
      catering: {
        meals: ['Breakfast', 'Lunch', 'Snacks'],
        dietary: ['Vegetarian', 'Gluten-free options'],
        cost: 300,
        vendor: 'Local catering service'
      },
      permits: [
        {
          type: 'Location filming permit',
          status: 'pending' as const,
          cost: 150,
          validDates: 'Shoot date only'
        }
      ],
      insurance: {
        coverage: ['Equipment', 'Liability', 'Crew'],
        cost: 100,
        provider: 'Production insurance',
        validDates: 'Shoot date + 1 day'
      }
    };
  }

  private static generateWeatherConsiderations(description: string): WeatherConsiderations {
    const shootDate = new Date();
    shootDate.setDate(shootDate.getDate() + 7);

    return {
      forecast: {
        date: shootDate,
        temperature: { high: 22, low: 15, unit: 'celsius' },
        conditions: 'Partly cloudy',
        precipitation: 20,
        wind: { speed: 15, direction: 'SW', gusts: 25 },
        visibility: 'Good',
        sunrise: '06:30',
        sunset: '19:45'
      },
      contingencies: this.generateWeatherContingencies(description),
      equipment: this.generateWeatherEquipment(description),
      alternatives: this.generateWeatherAlternatives(description)
    };
  }

  private static generateWeatherContingencies(description: string): any[] {
    const contingencies = [];
    const words = description.toLowerCase();

    if (words.includes('outdoor')) {
      contingencies.push({
        condition: 'Rain',
        plan: 'Move to covered location or reschedule',
        equipment: ['Umbrellas', 'Rain covers', 'Tarps'],
        timeline: 'Monitor 24h before shoot'
      });
      contingencies.push({
        condition: 'High winds',
        plan: 'Secure equipment, adjust shots',
        equipment: ['Sandbags', 'Wind screens', 'Tie-downs'],
        timeline: 'Real-time adjustment'
      });
    }

    contingencies.push({
      condition: 'Extreme temperature',
      plan: 'Crew comfort measures, equipment protection',
      equipment: ['Heating/cooling', 'Equipment covers'],
      timeline: 'Ongoing monitoring'
    });

    return contingencies;
  }

  private static generateWeatherEquipment(description: string): any[] {
    const equipment = [
      { item: 'Rain covers', purpose: 'Equipment protection', quantity: 5 },
      { item: 'Umbrellas', purpose: 'Crew protection', quantity: 6 }
    ];

    const words = description.toLowerCase();
    
    if (words.includes('outdoor')) {
      equipment.push(
        { item: 'Sandbags', purpose: 'Equipment stability', quantity: 10 },
        { item: 'Tarps', purpose: 'Area protection', quantity: 3 },
        { item: 'Wind screens', purpose: 'Audio protection', quantity: 2 }
      );
    }

    return equipment;
  }

  private static generateWeatherAlternatives(description: string): any[] {
    const alternatives = [];
    const words = description.toLowerCase();

    if (words.includes('outdoor')) {
      alternatives.push({
        scenario: 'Severe weather',
        location: 'Indoor backup location',
        schedule: 'Reschedule to next available day',
        impact: 'Minimal with proper planning'
      });
    }

    alternatives.push({
      scenario: 'Minor weather issues',
      schedule: 'Adjust shooting order',
      impact: 'Continue with modifications'
    });

    return alternatives;
  }

  private static generateBudgetEstimate(description: string): BudgetEstimate {
    const categories = [
      {
        category: 'Crew',
        items: [
          { name: 'Director', quantity: 1, rate: 500, total: 500 },
          { name: 'DP', quantity: 1, rate: 400, total: 400 },
          { name: 'Camera Op', quantity: 1, rate: 300, total: 300 },
          { name: 'Audio', quantity: 1, rate: 250, total: 250 },
          { name: 'Gaffer', quantity: 1, rate: 300, total: 300 },
          { name: 'PA', quantity: 1, rate: 150, total: 150 }
        ],
        subtotal: 1900
      },
      {
        category: 'Equipment',
        items: [
          { name: 'Camera package', quantity: 1, rate: 500, total: 500 },
          { name: 'Lighting package', quantity: 1, rate: 300, total: 300 },
          { name: 'Audio package', quantity: 1, rate: 200, total: 200 },
          { name: 'Support equipment', quantity: 1, rate: 200, total: 200 }
        ],
        subtotal: 1200
      },
      {
        category: 'Location & Logistics',
        items: [
          { name: 'Location fees', quantity: 1, rate: 200, total: 200 },
          { name: 'Permits', quantity: 1, rate: 150, total: 150 },
          { name: 'Transportation', quantity: 1, rate: 200, total: 200 },
          { name: 'Catering', quantity: 1, rate: 300, total: 300 }
        ],
        subtotal: 850
      },
      {
        category: 'Post-Production',
        items: [
          { name: 'Data management', quantity: 1, rate: 100, total: 100 },
          { name: 'Backup storage', quantity: 1, rate: 50, total: 50 }
        ],
        subtotal: 150
      }
    ];

    const total = categories.reduce((sum, cat) => sum + cat.subtotal, 0);
    const contingency = total * 0.1;

    return {
      total: total + contingency,
      breakdown: categories,
      contingency,
      currency: 'USD'
    };
  }

  static getSceneTemplates(): SceneTemplate[] {
    return [
      {
        id: 'interview',
        name: 'Interview Setup',
        description: 'Standard interview configuration with proper lighting and audio',
        category: 'interview',
        defaultSettings: {
          visualComposition: {
            mood: 'intimate',
            style: { cinematography: 'documentary' }
          },
          lighting: {
            style: 'soft',
            mood: 'bright'
          }
        }
      },
      {
        id: 'documentary',
        name: 'Documentary Scene',
        description: 'Observational documentary style with natural lighting',
        category: 'documentary',
        defaultSettings: {
          visualComposition: {
            mood: 'peaceful',
            style: { cinematography: 'documentary' }
          },
          lighting: {
            style: 'natural',
            mood: 'bright'
          }
        }
      },
      {
        id: 'dramatic',
        name: 'Dramatic Scene',
        description: 'High-contrast dramatic setup with cinematic lighting',
        category: 'intimate',
        defaultSettings: {
          visualComposition: {
            mood: 'dramatic',
            style: { cinematography: 'cinematic' }
          },
          lighting: {
            style: 'dramatic',
            mood: 'moody'
          }
        }
      }
    ];
  }
}