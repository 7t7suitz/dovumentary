import React, { useState } from 'react';
import { Script, ExportOptions, ExportFormat } from '../types/script';
import { jsPDF } from 'jspdf';
import { 
  Download, 
  FileText, 
  File, 
  Settings, 
  Check, 
  Copy, 
  Share2,
  Eye,
  Printer
} from 'lucide-react';

interface ScriptExporterProps {
  script: Script;
  onClose: () => void;
}

export const ScriptExporter: React.FC<ScriptExporterProps> = ({
  script,
  onClose
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeNotes: true,
    includeComments: false,
    includeTimestamps: true,
    pageNumbers: true,
    sceneNumbers: true,
    characterList: true,
    locationList: true,
    titlePage: true,
    customFormatting: {
      font: 'Courier New',
      fontSize: 12,
      lineSpacing: 1,
      margins: { top: 1, bottom: 1, left: 1.5, right: 1 },
      headerFooter: true,
      colorCoding: false
    }
  });

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      switch (exportOptions.format) {
        case 'pdf':
          await exportToPDF();
          break;
        case 'docx':
          exportToDocx();
          break;
        case 'fountain':
          exportToFountain();
          break;
        case 'html':
          exportToHTML();
          break;
        case 'txt':
          exportToTxt();
          break;
        case 'json':
          exportToJSON();
          break;
        default:
          console.error('Unsupported export format');
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter'
    });
    
    const { margins } = exportOptions.customFormatting;
    const pageWidth = 8.5;
    const contentWidth = pageWidth - margins.left - margins.right;
    let yPosition = margins.top;
    let pageNumber = 1;
    
    // Title page
    if (exportOptions.titlePage) {
      pdf.setFont(exportOptions.customFormatting.font);
      pdf.setFontSize(18);
      pdf.text(script.title.toUpperCase(), pageWidth / 2, 3, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text('by', pageWidth / 2, 4, { align: 'center' });
      pdf.text(script.metadata.author, pageWidth / 2, 4.5, { align: 'center' });
      
      if (script.metadata.logline) {
        pdf.text('Logline:', margins.left, 6);
        pdf.setFont(exportOptions.customFormatting.font, 'normal');
        const loglineLines = pdf.splitTextToSize(script.metadata.logline, contentWidth);
        pdf.text(loglineLines, margins.left, 6.5);
      }
      
      pdf.addPage();
      pageNumber++;
      yPosition = margins.top;
    }
    
    // Content
    pdf.setFont(exportOptions.customFormatting.font);
    pdf.setFontSize(exportOptions.customFormatting.fontSize);
    
    for (const element of script.content) {
      // Check if we need a new page
      if (yPosition > 11 - margins.bottom) {
        pdf.addPage();
        pageNumber++;
        yPosition = margins.top;
        
        // Add header/footer
        if (exportOptions.customFormatting.headerFooter) {
          pdf.setFontSize(8);
          pdf.text(script.title, margins.left, 0.5);
          if (exportOptions.pageNumbers) {
            pdf.text(`${pageNumber}.`, pageWidth - margins.right, 0.5, { align: 'right' });
          }
          pdf.setFontSize(exportOptions.customFormatting.fontSize);
        }
      }
      
      // Set formatting based on element type
      const formatting = element.formatting;
      pdf.setFont(
        formatting.fontFamily, 
        formatting.bold ? 'bold' : formatting.italic ? 'italic' : 'normal'
      );
      
      if (formatting.color !== '#000000') {
        // Convert hex to RGB for PDF
        const r = parseInt(formatting.color.slice(1, 3), 16);
        const g = parseInt(formatting.color.slice(3, 5), 16);
        const b = parseInt(formatting.color.slice(5, 7), 16);
        pdf.setTextColor(r, g, b);
      } else {
        pdf.setTextColor(0, 0, 0);
      }
      
      // Calculate x position based on alignment and indent
      let xPosition = margins.left + (formatting.indent / 72); // Convert points to inches
      
      if (formatting.alignment === 'center') {
        xPosition = pageWidth / 2;
      } else if (formatting.alignment === 'right') {
        xPosition = pageWidth - margins.right;
      }
      
      // Split text to fit width
      const maxWidth = contentWidth - (formatting.indent / 72);
      const textLines = pdf.splitTextToSize(element.content, maxWidth);
      
      // Add element type as prefix for certain elements
      if (exportOptions.sceneNumbers && element.type === 'scene-heading') {
        const sceneNumber = script.content.filter(e => e.type === 'scene-heading' && e.order <= element.order).length;
        textLines[0] = `${sceneNumber}. ${textLines[0]}`;
      }
      
      // Write text
      pdf.text(
        textLines, 
        xPosition, 
        yPosition, 
        { 
          align: formatting.alignment as any,
          lineHeightFactor: formatting.spacing
        }
      );
      
      // Move position for next element
      yPosition += (textLines.length * formatting.spacing * 0.16) + 0.1;
      
      // Add timestamps if needed
      if (exportOptions.includeTimestamps && element.timing) {
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `[${formatTime(element.timing.startTime)} - ${formatTime(element.timing.endTime)}]`,
          margins.left,
          yPosition
        );
        pdf.setFontSize(exportOptions.customFormatting.fontSize);
        pdf.setTextColor(0, 0, 0);
        yPosition += 0.2;
      }
      
      // Add notes if needed
      if (exportOptions.includeNotes && element.notes && element.notes.length > 0) {
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `NOTE: ${element.notes.join(', ')}`,
          margins.left,
          yPosition,
          { maxWidth: contentWidth }
        );
        pdf.setFontSize(exportOptions.customFormatting.fontSize);
        pdf.setTextColor(0, 0, 0);
        yPosition += 0.2;
      }
    }
    
    // Add character and location lists if needed
    if (exportOptions.characterList || exportOptions.locationList) {
      pdf.addPage();
      yPosition = margins.top;
      
      if (exportOptions.characterList) {
        pdf.setFont(exportOptions.customFormatting.font, 'bold');
        pdf.text('CHARACTER LIST', margins.left, yPosition);
        yPosition += 0.3;
        
        pdf.setFont(exportOptions.customFormatting.font, 'normal');
        script.metadata.characters.forEach(character => {
          pdf.text(`- ${character}`, margins.left, yPosition);
          yPosition += 0.2;
        });
        
        yPosition += 0.3;
      }
      
      if (exportOptions.locationList) {
        pdf.setFont(exportOptions.customFormatting.font, 'bold');
        pdf.text('LOCATION LIST', margins.left, yPosition);
        yPosition += 0.3;
        
        pdf.setFont(exportOptions.customFormatting.font, 'normal');
        script.metadata.locations.forEach(location => {
          pdf.text(`- ${location}`, margins.left, yPosition);
          yPosition += 0.2;
        });
      }
    }
    
    pdf.save(`${script.title.replace(/\s+/g, '_')}.pdf`);
  };

  const exportToDocx = () => {
    // In a real implementation, this would use the docx library
    alert('DOCX export would be implemented here');
  };

  const exportToFountain = () => {
    let content = `Title: ${script.title}\n`;
    content += `Author: ${script.metadata.author}\n`;
    content += `Draft date: ${new Date().toLocaleDateString()}\n\n`;
    
    script.content.forEach(element => {
      switch (element.type) {
        case 'scene-heading':
          content += `\n${element.content}\n\n`;
          break;
        case 'action':
          content += `${element.content}\n\n`;
          break;
        case 'character':
          content += `${element.content}\n`;
          break;
        case 'parenthetical':
          content += `${element.content}\n`;
          break;
        case 'dialogue':
          content += `${element.content}\n\n`;
          break;
        case 'transition':
          content += `${element.content}\n\n`;
          break;
        default:
          content += `${element.content}\n\n`;
      }
    });
    
    downloadTextFile(content, `${script.title.replace(/\s+/g, '_')}.fountain`);
  };

  const exportToHTML = () => {
    let content = `<!DOCTYPE html>
<html>
<head>
  <title>${script.title}</title>
  <style>
    body { font-family: '${exportOptions.customFormatting.font}', monospace; line-height: ${exportOptions.customFormatting.lineSpacing}; }
    .scene-heading { font-weight: bold; }
    .character { text-align: center; margin-left: 1.5in; }
    .dialogue { margin-left: 1in; margin-right: 1.5in; }
    .parenthetical { margin-left: 1.2in; font-style: italic; }
    .transition { text-align: right; }
  </style>
</head>
<body>
  <h1>${script.title}</h1>
  <p>by ${script.metadata.author}</p>
  <div class="script">
`;
    
    script.content.forEach(element => {
      content += `    <div class="${element.type}">`;
      content += element.content.replace(/\n/g, '<br>');
      content += `</div>\n\n`;
    });
    
    content += `  </div>
</body>
</html>`;
    
    downloadTextFile(content, `${script.title.replace(/\s+/g, '_')}.html`);
  };

  const exportToTxt = () => {
    let content = `${script.title.toUpperCase()}\n`;
    content += `by ${script.metadata.author}\n\n`;
    
    script.content.forEach(element => {
      switch (element.type) {
        case 'scene-heading':
          content += `\n${element.content}\n\n`;
          break;
        case 'action':
          content += `${element.content}\n\n`;
          break;
        case 'character':
          content += `${' '.repeat(20)}${element.content}\n`;
          break;
        case 'parenthetical':
          content += `${' '.repeat(15)}${element.content}\n`;
          break;
        case 'dialogue':
          content += `${' '.repeat(10)}${element.content}\n\n`;
          break;
        case 'transition':
          content += `${' '.repeat(40)}${element.content}\n\n`;
          break;
        default:
          content += `${element.content}\n\n`;
      }
    });
    
    downloadTextFile(content, `${script.title.replace(/\s+/g, '_')}.txt`);
  };

  const exportToJSON = () => {
    const content = JSON.stringify(script, null, 2);
    downloadTextFile(content, `${script.title.replace(/\s+/g, '_')}.json`);
  };

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Export Script</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Export Format */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Export Format</h3>
              <div className="space-y-3">
                {[
                  { id: 'pdf', label: 'PDF Document', icon: FileText, color: 'red' },
                  { id: 'docx', label: 'Word Document', icon: File, color: 'blue' },
                  { id: 'fountain', label: 'Fountain', icon: FileText, color: 'green' },
                  { id: 'html', label: 'HTML', icon: FileText, color: 'orange' },
                  { id: 'txt', label: 'Plain Text', icon: FileText, color: 'gray' },
                  { id: 'json', label: 'JSON Data', icon: FileText, color: 'purple' }
                ].map(format => (
                  <label key={format.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={exportOptions.format === format.id}
                      onChange={() => setExportOptions(prev => ({ ...prev, format: format.id as ExportFormat }))}
                      className="text-blue-600"
                    />
                    <format.icon className={`w-5 h-5 text-${format.color}-500`} />
                    <div>
                      <div className="font-medium text-gray-900">{format.label}</div>
                      <div className="text-xs text-gray-500">
                        {format.id === 'pdf' && 'Industry-standard formatted document'}
                        {format.id === 'docx' && 'Editable in Microsoft Word'}
                        {format.id === 'fountain' && 'Plain text screenplay format'}
                        {format.id === 'html' && 'Web-ready format'}
                        {format.id === 'txt' && 'Simple text format'}
                        {format.id === 'json' && 'Raw data for developers'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Options */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Content Options</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.titlePage}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, titlePage: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Title Page</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeNotes}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeNotes: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Notes</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeComments}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeComments: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Comments</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeTimestamps}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeTimestamps: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Timestamps</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.pageNumbers}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, pageNumbers: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Page Numbers</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.sceneNumbers}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, sceneNumbers: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Scene Numbers</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.characterList}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, characterList: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Character List</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.locationList}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, locationList: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Location List</span>
                </label>
              </div>
            </div>

            {/* Formatting Options */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Formatting Options</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font
                  </label>
                  <select
                    value={exportOptions.customFormatting.font}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      customFormatting: {
                        ...prev.customFormatting,
                        font: e.target.value
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Courier New">Courier New</option>
                    <option value="Courier Prime">Courier Prime</option>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size
                  </label>
                  <select
                    value={exportOptions.customFormatting.fontSize}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      customFormatting: {
                        ...prev.customFormatting,
                        fontSize: parseInt(e.target.value)
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="10">10pt</option>
                    <option value="12">12pt</option>
                    <option value="14">14pt</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Line Spacing
                  </label>
                  <select
                    value={exportOptions.customFormatting.lineSpacing}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      customFormatting: {
                        ...prev.customFormatting,
                        lineSpacing: parseFloat(e.target.value)
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">Single</option>
                    <option value="1.15">1.15</option>
                    <option value="1.5">1.5</option>
                    <option value="2">Double</option>
                  </select>
                </div>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.customFormatting.headerFooter}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      customFormatting: {
                        ...prev.customFormatting,
                        headerFooter: e.target.checked
                      }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Header/Footer</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.customFormatting.colorCoding}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      customFormatting: {
                        ...prev.customFormatting,
                        colorCoding: e.target.checked
                      }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Color Code Elements</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Watermark
                  </label>
                  <input
                    type="text"
                    value={exportOptions.watermark || ''}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      watermark: e.target.value
                    }))}
                    placeholder="Optional watermark text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Script Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Script Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Title:</span>
                <p className="text-gray-600">{script.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Author:</span>
                <p className="text-gray-600">{script.metadata.author}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Elements:</span>
                <p className="text-gray-600">{script.content.length}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Est. Runtime:</span>
                <p className="text-gray-600">{formatTime(script.metadata.estimatedRuntime)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={() => {
                // Preview logic
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
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