import { MediaFile, MediaMetadata, MediaAnalysis, DetectedFace, Tag, Person, AIProcessingQueue } from '../types/media';
import * as faceapi from 'face-api.js';

export class MediaProcessor {
  private static faceApiLoaded = false;

  static async initializeFaceAPI() {
    if (this.faceApiLoaded) return;
    
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      await faceapi.nets.ageGenderNet.loadFromUri('/models');
      this.faceApiLoaded = true;
    } catch (error) {
      console.warn('Face API models not available, face detection disabled');
    }
  }

  static async processMediaFile(file: File): Promise<Partial<MediaFile>> {
    const id = this.generateId();
    const url = URL.createObjectURL(file);
    
    // Extract basic metadata
    const metadata = await this.extractMetadata(file);
    
    // Generate thumbnail
    const thumbnailUrl = await this.generateThumbnail(file, url);
    
    // Start AI processing
    const analysis = await this.analyzeMedia(file, url);
    const faces = await this.detectFaces(file, url);
    const tags = await this.generateTags(file, analysis);

    return {
      id,
      name: file.name,
      type: this.getMediaType(file.type),
      size: file.size,
      url,
      thumbnailUrl,
      uploadDate: new Date(),
      lastModified: new Date(file.lastModified),
      metadata,
      tags,
      faces,
      analysis,
      versions: [{
        id: this.generateId(),
        name: 'Original',
        url,
        size: file.size,
        format: file.type,
        quality: 'original',
        purpose: 'original',
        createdDate: new Date(),
        modifications: []
      }],
      collections: [],
      status: 'completed'
    };
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static getMediaType(mimeType: string): any {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  }

  private static async extractMetadata(file: File): Promise<MediaMetadata> {
    const metadata: MediaMetadata = {
      format: file.type,
      fileHash: await this.calculateFileHash(file)
    };

    if (file.type.startsWith('image/')) {
      const dimensions = await this.getImageDimensions(file);
      metadata.dimensions = dimensions;
      
      // Extract EXIF data
      try {
        const exif = await this.extractExifData(file);
        metadata.exif = exif;
        metadata.camera = this.extractCameraInfo(exif);
        metadata.location = this.extractLocationInfo(exif);
      } catch (error) {
        console.warn('EXIF extraction failed:', error);
      }
    }

    if (file.type.startsWith('video/')) {
      const videoMetadata = await this.getVideoMetadata(file);
      metadata.dimensions = videoMetadata.dimensions;
      metadata.duration = videoMetadata.duration;
      metadata.frameRate = videoMetadata.frameRate;
      metadata.bitRate = videoMetadata.bitRate;
    }

    return metadata;
  }

  private static async calculateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  private static async extractExifData(file: File): Promise<any> {
    // Simplified EXIF extraction - in production, use exifr library
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Basic EXIF parsing would go here
        resolve({
          DateTime: new Date().toISOString(),
          Make: 'Unknown',
          Model: 'Unknown'
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private static extractCameraInfo(exif: any): any {
    return {
      make: exif.Make || 'Unknown',
      model: exif.Model || 'Unknown',
      lens: exif.LensModel,
      settings: {
        aperture: exif.FNumber,
        shutterSpeed: exif.ExposureTime,
        iso: exif.ISO,
        focalLength: exif.FocalLength,
        flash: exif.Flash === 1
      }
    };
  }

  private static extractLocationInfo(exif: any): any {
    if (exif.GPSLatitude && exif.GPSLongitude) {
      return {
        latitude: exif.GPSLatitude,
        longitude: exif.GPSLongitude
      };
    }
    return undefined;
  }

  private static async getVideoMetadata(file: File): Promise<any> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve({
          dimensions: { width: video.videoWidth, height: video.videoHeight },
          duration: video.duration,
          frameRate: 30, // Simplified
          bitRate: 1000000 // Simplified
        });
      };
      video.src = URL.createObjectURL(file);
    });
  }

  private static async generateThumbnail(file: File, url: string): Promise<string> {
    if (file.type.startsWith('image/')) {
      return this.generateImageThumbnail(url);
    } else if (file.type.startsWith('video/')) {
      return this.generateVideoThumbnail(url);
    }
    return url;
  }

  private static async generateImageThumbnail(url: string): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const maxSize = 300;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.src = url;
    });
  }

  private static async generateVideoThumbnail(url: string): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      video.onloadeddata = () => {
        video.currentTime = Math.min(5, video.duration / 2);
      };
      
      video.onseeked = () => {
        const maxSize = 300;
        const ratio = Math.min(maxSize / video.videoWidth, maxSize / video.videoHeight);
        canvas.width = video.videoWidth * ratio;
        canvas.height = video.videoHeight * ratio;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      video.src = url;
    });
  }

  private static async analyzeMedia(file: File, url: string): Promise<MediaAnalysis> {
    const analysis: MediaAnalysis = {
      aiDescription: await this.generateAIDescription(file, url),
      dominantColors: await this.extractDominantColors(url),
      composition: await this.analyzeComposition(url),
      quality: await this.analyzeQuality(url),
      content: await this.analyzeContent(file, url),
      documentaryValue: await this.analyzeDocumentaryValue(file, url)
    };

    return analysis;
  }

  private static async generateAIDescription(file: File, url: string): Promise<string> {
    // Simplified AI description generation
    if (file.type.startsWith('image/')) {
      return this.generateImageDescription(url);
    } else if (file.type.startsWith('video/')) {
      return 'Video content with multiple scenes and subjects';
    }
    return 'Media file uploaded for analysis';
  }

  private static async generateImageDescription(url: string): Promise<string> {
    // Simplified image analysis - in production, use computer vision APIs
    const descriptions = [
      'A photograph showing people in an indoor setting',
      'Outdoor scene with natural lighting and landscape elements',
      'Portrait photograph with shallow depth of field',
      'Group photo with multiple subjects in frame',
      'Documentary-style image capturing a moment in time',
      'Architectural photograph showing building details',
      'Street photography with urban environment',
      'Close-up photograph with detailed subject matter'
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private static async extractDominantColors(url: string): Promise<string[]> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);
        
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const colors = this.extractColorsFromImageData(imageData);
        resolve(colors);
      };
      
      img.src = url;
    });
  }

  private static extractColorsFromImageData(imageData: ImageData): string[] {
    const data = imageData.data;
    const colorCounts: { [key: string]: number } = {};
    
    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Quantize colors to reduce variations
      const qr = Math.floor(r / 32) * 32;
      const qg = Math.floor(g / 32) * 32;
      const qb = Math.floor(b / 32) * 32;
      
      const color = `rgb(${qr},${qg},${qb})`;
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }
    
    return Object.entries(colorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color);
  }

  private static async analyzeComposition(url: string): Promise<any> {
    // Simplified composition analysis
    return {
      ruleOfThirds: Math.random() * 0.5 + 0.5,
      symmetry: Math.random() * 0.3 + 0.2,
      leadingLines: Math.random() > 0.5,
      framing: ['tight', 'medium', 'wide'][Math.floor(Math.random() * 3)],
      perspective: ['eye-level', 'high-angle', 'low-angle'][Math.floor(Math.random() * 3)]
    };
  }

  private static async analyzeQuality(url: string): Promise<any> {
    // Simplified quality analysis
    return {
      sharpness: Math.random() * 0.3 + 0.7,
      exposure: Math.random() * 0.4 + 0.6,
      contrast: Math.random() * 0.3 + 0.6,
      saturation: Math.random() * 0.4 + 0.5,
      noise: Math.random() * 0.3,
      overallScore: Math.random() * 0.3 + 0.7
    };
  }

  private static async analyzeContent(file: File, url: string): Promise<any> {
    const objects = await this.detectObjects(url);
    const scenes = await this.classifyScenes(url);
    const activities = await this.detectActivities(url);
    const emotions = await this.analyzeEmotions(url);
    
    return {
      objects,
      scenes,
      activities,
      emotions
    };
  }

  private static async detectObjects(url: string): Promise<any[]> {
    // Simplified object detection
    const commonObjects = [
      { name: 'person', category: 'people', confidence: 0.9 },
      { name: 'chair', category: 'furniture', confidence: 0.7 },
      { name: 'table', category: 'furniture', confidence: 0.6 },
      { name: 'car', category: 'vehicle', confidence: 0.8 },
      { name: 'building', category: 'architecture', confidence: 0.75 }
    ];
    
    return commonObjects
      .filter(() => Math.random() > 0.6)
      .map(obj => ({
        ...obj,
        boundingBox: {
          x: Math.random() * 0.5,
          y: Math.random() * 0.5,
          width: Math.random() * 0.3 + 0.1,
          height: Math.random() * 0.3 + 0.1
        }
      }));
  }

  private static async classifyScenes(url: string): Promise<string[]> {
    const scenes = ['indoor', 'outdoor', 'urban', 'nature', 'portrait', 'group', 'event', 'documentary'];
    return scenes.filter(() => Math.random() > 0.7);
  }

  private static async detectActivities(url: string): Promise<string[]> {
    const activities = ['talking', 'walking', 'sitting', 'working', 'eating', 'meeting', 'presentation'];
    return activities.filter(() => Math.random() > 0.8);
  }

  private static async analyzeEmotions(url: string): Promise<any[]> {
    const emotions = ['happy', 'neutral', 'serious', 'contemplative', 'excited'];
    return emotions
      .filter(() => Math.random() > 0.6)
      .map(emotion => ({
        emotion,
        intensity: Math.random() * 0.5 + 0.5,
        context: 'Detected in facial expressions and body language'
      }));
  }

  private static async analyzeDocumentaryValue(file: File, url: string): Promise<any> {
    const narrativeValue = Math.random() * 0.4 + 0.6;
    const emotionalImpact = Math.random() * 0.5 + 0.5;
    const visualInterest = Math.random() * 0.3 + 0.7;
    const historicalSignificance = Math.random() * 0.6 + 0.2;
    const storytellingPotential = (narrativeValue + emotionalImpact + visualInterest) / 3;
    
    return {
      narrativeValue,
      emotionalImpact,
      visualInterest,
      historicalSignificance,
      storytellingPotential,
      suggestedPlacement: this.generatePlacementSuggestions(narrativeValue, emotionalImpact, visualInterest)
    };
  }

  private static generatePlacementSuggestions(narrative: number, emotional: number, visual: number): any[] {
    const suggestions = [];
    
    if (emotional > 0.8) {
      suggestions.push({
        section: 'climax',
        confidence: emotional,
        reasoning: 'High emotional impact makes this suitable for climactic moments'
      });
    }
    
    if (visual > 0.8) {
      suggestions.push({
        section: 'opening',
        confidence: visual,
        reasoning: 'Strong visual appeal makes this effective for opening sequences'
      });
    }
    
    if (narrative > 0.7) {
      suggestions.push({
        section: 'rising-action',
        confidence: narrative,
        reasoning: 'Good narrative value supports story development'
      });
    }
    
    suggestions.push({
      section: 'b-roll',
      confidence: 0.6,
      reasoning: 'Can be used as supporting footage'
    });
    
    return suggestions;
  }

  private static async detectFaces(file: File, url: string): Promise<DetectedFace[]> {
    if (!file.type.startsWith('image/') || !this.faceApiLoaded) {
      return [];
    }

    try {
      const img = await this.loadImage(url);
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      return detections.map((detection, index) => ({
        id: this.generateId(),
        boundingBox: {
          x: detection.detection.box.x,
          y: detection.detection.box.y,
          width: detection.detection.box.width,
          height: detection.detection.box.height
        },
        confidence: detection.detection.score,
        landmarks: detection.landmarks ? {
          leftEye: { x: detection.landmarks.getLeftEye()[0].x, y: detection.landmarks.getLeftEye()[0].y },
          rightEye: { x: detection.landmarks.getRightEye()[0].x, y: detection.landmarks.getRightEye()[0].y },
          nose: { x: detection.landmarks.getNose()[0].x, y: detection.landmarks.getNose()[0].y },
          mouth: { x: detection.landmarks.getMouth()[0].x, y: detection.landmarks.getMouth()[0].y }
        } : undefined,
        expressions: detection.expressions ? {
          happy: detection.expressions.happy,
          sad: detection.expressions.sad,
          angry: detection.expressions.angry,
          surprised: detection.expressions.surprised,
          neutral: detection.expressions.neutral
        } : undefined,
        age: detection.age,
        gender: detection.gender
      }));
    } catch (error) {
      console.warn('Face detection failed:', error);
      return [];
    }
  }

  private static loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private static async generateTags(file: File, analysis: MediaAnalysis): Promise<Tag[]> {
    const tags: Tag[] = [];

    // Add content-based tags
    analysis.content.objects.forEach(obj => {
      tags.push({
        id: this.generateId(),
        name: obj.name,
        category: 'object',
        confidence: obj.confidence,
        source: 'ai'
      });
    });

    // Add scene tags
    analysis.content.scenes.forEach(scene => {
      tags.push({
        id: this.generateId(),
        name: scene,
        category: 'location',
        confidence: 0.8,
        source: 'ai'
      });
    });

    // Add activity tags
    analysis.content.activities.forEach(activity => {
      tags.push({
        id: this.generateId(),
        name: activity,
        category: 'activity',
        confidence: 0.7,
        source: 'ai'
      });
    });

    // Add emotion tags
    analysis.content.emotions.forEach(emotion => {
      tags.push({
        id: this.generateId(),
        name: emotion.emotion,
        category: 'emotion',
        confidence: emotion.intensity,
        source: 'ai'
      });
    });

    // Add technical tags
    if (analysis.quality.overallScore > 0.8) {
      tags.push({
        id: this.generateId(),
        name: 'high-quality',
        category: 'technical',
        confidence: analysis.quality.overallScore,
        source: 'ai'
      });
    }

    if (analysis.composition.ruleOfThirds > 0.7) {
      tags.push({
        id: this.generateId(),
        name: 'well-composed',
        category: 'technical',
        confidence: analysis.composition.ruleOfThirds,
        source: 'ai'
      });
    }

    return tags;
  }

  static async batchProcess(mediaFiles: MediaFile[], operation: any): Promise<any> {
    const results = [];
    
    for (const media of mediaFiles) {
      try {
        const result = await this.processSingleOperation(media, operation);
        results.push({ mediaId: media.id, success: true, result });
      } catch (error) {
        results.push({ 
          mediaId: media.id, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return results;
  }

  private static async processSingleOperation(media: MediaFile, operation: any): Promise<any> {
    switch (operation.type) {
      case 'resize':
        return this.resizeMedia(media, operation.parameters);
      case 'compress':
        return this.compressMedia(media, operation.parameters);
      case 'tag-add':
        return this.addTags(media, operation.parameters.tags);
      case 'format-convert':
        return this.convertFormat(media, operation.parameters);
      default:
        throw new Error(`Unknown operation type: ${operation.type}`);
    }
  }

  private static async resizeMedia(media: MediaFile, params: any): Promise<string> {
    // Simplified resize operation
    return `Resized to ${params.width}x${params.height}`;
  }

  private static async compressMedia(media: MediaFile, params: any): Promise<string> {
    // Simplified compression operation
    return `Compressed with quality ${params.quality}`;
  }

  private static async addTags(media: MediaFile, tags: string[]): Promise<string> {
    // Simplified tag addition
    return `Added tags: ${tags.join(', ')}`;
  }

  private static async convertFormat(media: MediaFile, params: any): Promise<string> {
    // Simplified format conversion
    return `Converted to ${params.format}`;
  }
}