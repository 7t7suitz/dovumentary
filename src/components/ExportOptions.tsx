import React, { useState } from 'react';
import { StoryboardProject } from '../types/storyboard';
import { Download, FileImage, FileText, Printer, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportOptionsProps {
  project: StoryboardProject;
  onClose: () => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ project, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'images' | 'json'>('pdf');

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Title page
      pdf.setFontSize(24);
      pdf.text(project.title, pageWidth / 2, 30, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(project.description, pageWidth / 2, 45, { align: 'center' });
      pdf.text(`Created: ${project.createdAt.toLocaleDateString()}`, pageWidth / 2, 55, { align: 'center' });
      pdf.text(`Frames: ${project.frames.length} | Duration: ${project.frames.reduce((sum, f) => sum + f.duration, 0)}s`, pageWidth / 2, 65, { align: 'center' });

      // Frame pages
      for (let i = 0; i < project.frames.length; i++) {
        const frame = project.frames[i];
        pdf.addPage();
        
        // Frame title and info
        pdf.setFontSize(16);
        pdf.text(`Frame ${i + 1}: ${frame.title}`, 20, 20);
        
        pdf.setFontSize(10);
        pdf.text(`Shot: ${frame.shotType} | Angle: ${frame.cameraAngle} | Movement: ${frame.cameraMovement}`, 20, 30);
        pdf.text(`Duration: ${frame.duration}s | Transition: ${frame.transition}`, 20, 35);
        
        // Description
        pdf.setFontSize(12);
        pdf.text('Description:', 20, 50);
        const descLines = pdf.splitTextToSize(frame.description, pageWidth - 40);
        pdf.text(descLines, 20, 60);
        
        // Technical details
        let yPos = 80 + (descLines.length * 5);
        
        if (frame.voiceover.text) {
          pdf.text('Voiceover:', 20, yPos);
          const voLines = pdf.splitTextToSize(frame.voiceover.text, pageWidth - 40);
          pdf.text(voLines, 20, yPos + 10);
          yPos += 20 + (voLines.length * 5);
        }
        
        if (frame.characters.length > 0) {
          pdf.text('Characters:', 20, yPos);
          frame.characters.forEach((char, idx) => {
            pdf.text(`• ${char.name}: ${char.action} (${char.emotion})`, 25, yPos + 10 + (idx * 5));
          });
          yPos += 15 + (frame.characters.length * 5);
        }
        
        if (frame.audioCues.length > 0) {
          pdf.text('Audio Cues:', 20, yPos);
          frame.audioCues.forEach((cue, idx) => {
            pdf.text(`• ${cue.type}: ${cue.description}`, 25, yPos + 10 + (idx * 5));
          });
        }
        
        if (frame.notes) {
          pdf.text('Notes:', 20, pageHeight - 30);
          const noteLines = pdf.splitTextToSize(frame.notes, pageWidth - 40);
          pdf.text(noteLines, 20, pageHeight - 20);
        }
      }
      
      pdf.save(`${project.title.replace(/[^a-z0-9]/gi, '_')}_storyboard.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsImages = async () => {
    setIsExporting(true);
    try {
      // This would require canvas rendering of each frame
      // For now, we'll create a simple implementation
      const zip = new (window as any).JSZip();
      
      for (let i = 0; i < project.frames.length; i++) {
        const frame = project.frames[i];
        
        // Create a simple text representation for each frame
        const frameData = {
          frame: i + 1,
          title: frame.title,
          description: frame.description,
          shotType: frame.shotType,
          cameraAngle: frame.cameraAngle,
          cameraMovement: frame.cameraMovement,
          duration: frame.duration,
          characters: frame.characters,
          voiceover: frame.voiceover.text,
          notes: frame.notes
        };
        
        zip.file(`frame_${i + 1}.json`, JSON.stringify(frameData, null, 2));
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/[^a-z0-9]/gi, '_')}_frames.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Image export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${project.title.replace(/[^a-z0-9]/gi, '_')}_project.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExport = async () => {
    switch (exportFormat) {
      case 'pdf':
        await exportAsPDF();
        break;
      case 'images':
        await exportAsImages();
        break;
      case 'json':
        exportAsJSON();
        break;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Export Storyboard</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    checked={exportFormat === 'pdf'}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="text-blue-600"
                  />
                  <FileText className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-medium text-gray-900">PDF Document</div>
                    <div className="text-sm text-gray-500">Complete storyboard with all details</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="images"
                    checked={exportFormat === 'images'}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="text-blue-600"
                  />
                  <FileImage className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">Image Sequence</div>
                    <div className="text-sm text-gray-500">Individual frame images (ZIP)</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="text-blue-600"
                  />
                  <Download className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">Project Data</div>
                    <div className="text-sm text-gray-500">JSON file for backup/sharing</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Export Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Project: {project.title}</div>
                <div>Frames: {project.frames.length}</div>
                <div>Total Duration: {project.frames.reduce((sum, f) => sum + f.duration, 0)}s</div>
                <div>Created: {project.createdAt.toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};