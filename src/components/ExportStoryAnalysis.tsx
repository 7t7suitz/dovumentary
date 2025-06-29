import React, { useState } from 'react';
import { StoryAnalysis } from '../types/story';
import { Download, FileText, Printer, Share2, Settings } from 'lucide-react';
import jsPDF from 'jspdf';

interface ExportStoryAnalysisProps {
  analysis: StoryAnalysis;
  onClose: () => void;
}

export const ExportStoryAnalysis: React.FC<ExportStoryAnalysisProps> = ({ analysis, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'csv' | 'docx'>('pdf');
  const [includeOptions, setIncludeOptions] = useState({
    overview: true,
    structure: true,
    characters: true,
    pacing: true,
    recommendations: true,
    visualizations: false
  });

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Title page
      pdf.setFontSize(20);
      pdf.text('STORY STRUCTURE ANALYSIS', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(16);
      pdf.text(analysis.title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Overview
      if (includeOptions.overview) {
        pdf.setFontSize(14);
        pdf.text('OVERVIEW', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.text(`Structure Type: ${analysis.structure.type.replace('-', ' ')}`, 20, yPosition);
        yPosition += 6;
        pdf.text(`Completeness: ${Math.round(analysis.structure.completeness * 100)}%`, 20, yPosition);
        yPosition += 6;
        pdf.text(`Characters: ${analysis.characters.length}`, 20, yPosition);
        yPosition += 6;
        pdf.text(`Pacing: ${analysis.pacing.overallPacing}`, 20, yPosition);
        yPosition += 15;

        // Synopsis
        pdf.text('Synopsis:', 20, yPosition);
        yPosition += 8;
        const synopsisLines = pdf.splitTextToSize(analysis.synopsis.medium, pageWidth - 40);
        pdf.text(synopsisLines, 20, yPosition);
        yPosition += synopsisLines.length * 5 + 10;
      }

      // Structure Analysis
      if (includeOptions.structure) {
        if (yPosition > 200) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(14);
        pdf.text('STRUCTURE ANALYSIS', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.text('Acts:', 20, yPosition);
        yPosition += 8;

        analysis.structure.acts.forEach(act => {
          pdf.setFontSize(10);
          pdf.text(`${act.name} (${act.startPosition}% - ${act.endPosition}%)`, 25, yPosition);
          yPosition += 6;
          pdf.text(`Purpose: ${act.purpose}`, 30, yPosition);
          yPosition += 6;
          pdf.text(`Strength: ${Math.round(act.strength * 100)}%`, 30, yPosition);
          yPosition += 8;
        });

        pdf.setFontSize(12);
        pdf.text('Plot Points:', 20, yPosition);
        yPosition += 8;

        analysis.plotPoints.forEach(point => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFontSize(10);
          pdf.text(`${point.name} (${Math.round(point.position * 100)}%)`, 25, yPosition);
          yPosition += 6;
          pdf.text(`Status: ${point.present ? 'Present' : 'Missing'}`, 30, yPosition);
          yPosition += 6;
          pdf.text(`Strength: ${Math.round(point.strength * 100)}%`, 30, yPosition);
          yPosition += 8;
        });
      }

      // Characters
      if (includeOptions.characters) {
        pdf.addPage();
        yPosition = 20;

        pdf.setFontSize(14);
        pdf.text('CHARACTER ANALYSIS', 20, yPosition);
        yPosition += 10;

        analysis.characters.forEach(character => {
          if (yPosition > 220) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFontSize(12);
          pdf.text(character.name, 20, yPosition);
          yPosition +=8;

          pdf.setFontSize(10);
          pdf.text(`Role: ${character.role}`, 25, yPosition);
          yPosition += 6;
          pdf.text(`Arc: ${character.arcType}`, 25, yPosition);
          yPosition += 6;
          pdf.text(`Development: ${Math.round(character.development.changeStrength * 100)}%`, 25, yPosition);
          yPosition += 6;
          pdf.text(`Start State: ${character.development.startState}`, 25, yPosition);
          yPosition += 6;
          pdf.text(`End State: ${character.development.endState}`, 25, yPosition);
          yPosition += 10;
        });
      }

      // Recommendations
      if (includeOptions.recommendations) {
        pdf.addPage();
        yPosition = 20;

        pdf.setFontSize(14);
        pdf.text('RECOMMENDATIONS', 20, yPosition);
        yPosition += 10;

        analysis.suggestions.forEach(suggestion => {
          if (yPosition > 220) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFontSize(12);
          pdf.text(`${suggestion.type.replace('-', ' ')} (${suggestion.priority})`, 20, yPosition);
          yPosition += 8;

          pdf.setFontSize(10);
          const descLines = pdf.splitTextToSize(suggestion.description, pageWidth - 40);
          pdf.text(descLines, 25, yPosition);
          yPosition += descLines.length * 5 + 5;

          const implLines = pdf.splitTextToSize(`Implementation: ${suggestion.implementation}`, pageWidth - 40);
          pdf.text(implLines, 25, yPosition);
          yPosition += implLines.length * 5 + 10;
        });
      }

      pdf.save(`${analysis.title.replace(/[^a-z0-9]/gi, '_')}_story_analysis.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${analysis.title.replace(/[^a-z0-9]/gi, '_')}_analysis.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportAsCSV = () => {
    const csvData = [
      ['Section', 'Item', 'Value', 'Details'],
      ['Overview', 'Title', analysis.title, ''],
      ['Overview', 'Structure Type', analysis.structure.type, ''],
      ['Overview', 'Completeness', `${Math.round(analysis.structure.completeness * 100)}%`, ''],
      ['Overview', 'Character Count', analysis.characters.length.toString(), ''],
      ['Overview', 'Pacing', analysis.pacing.overallPacing, ''],
      ...analysis.plotPoints.map(point => [
        'Plot Points', 
        point.name, 
        point.present ? 'Present' : 'Missing', 
        `${Math.round(point.position * 100)}% - Strength: ${Math.round(point.strength * 100)}%`
      ]),
      ...analysis.characters.map(char => [
        'Characters',
        char.name,
        char.role,
        `Arc: ${char.arcType}, Development: ${Math.round(char.development.changeStrength * 100)}%`
      ]),
      ...analysis.suggestions.map(suggestion => [
        'Recommendations',
        suggestion.type,
        suggestion.priority,
        suggestion.description
      ])
    ];

    const csvContent = csvData.map(row => 
      row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.title.replace(/[^a-z0-9]/gi, '_')}_analysis.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    switch (exportFormat) {
      case 'pdf':
        await exportAsPDF();
        break;
      case 'json':
        exportAsJSON();
        break;
      case 'csv':
        exportAsCSV();
        break;
      default:
        console.log('Export format not implemented yet');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Export Story Analysis</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Export Format */}
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
                    className="text-indigo-600"
                  />
                  <FileText className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-medium text-gray-900">PDF Report</div>
                    <div className="text-sm text-gray-500">Complete analysis with formatting</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="text-indigo-600"
                  />
                  <Download className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">JSON Data</div>
                    <div className="text-sm text-gray-500">Raw data for further processing</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="text-indigo-600"
                  />
                  <Share2 className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">CSV Spreadsheet</div>
                    <div className="text-sm text-gray-500">Tabular data for analysis</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Include Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Include Sections</label>
              <div className="space-y-2">
                {Object.entries(includeOptions).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setIncludeOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Analysis Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <p className="text-gray-600">{analysis.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Structure:</span>
                  <p className="text-gray-600 capitalize">{analysis.structure.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Characters:</span>
                  <p className="text-gray-600">{analysis.characters.length}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Recommendations:</span>
                  <p className="text-gray-600">{analysis.suggestions.length}</p>
                </div>
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
              className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
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