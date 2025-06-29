import React, { useState } from 'react';
import { Scene } from '../types/scene';
import { Download, FileText, Calendar, Users, Settings, Printer } from 'lucide-react';
import jsPDF from 'jspdf';

interface ProductionDocumentsProps {
  scene: Scene;
}

export const ProductionDocuments: React.FC<ProductionDocumentsProps> = ({ scene }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'csv'>('pdf');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const exportCallSheet = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Header
      pdf.setFontSize(20);
      pdf.text('CALL SHEET', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(14);
      pdf.text(scene.title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Production Info
      pdf.setFontSize(12);
      pdf.text(`Shoot Date: ${scene.schedule.shootDate.toLocaleDateString()}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Call Time: ${scene.schedule.callTime}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Wrap Time: ${scene.schedule.wrapTime}`, 20, yPosition);
      yPosition += 15;

      // Location
      pdf.setFontSize(14);
      pdf.text('LOCATION', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.text(`${scene.location.name} (${scene.location.type.replace(/-/g, ' ')})`, 20, yPosition);
      if (scene.location.address) {
        yPosition += 6;
        pdf.text(scene.location.address, 20, yPosition);
      }
      yPosition += 15;

      // Crew
      pdf.setFontSize(14);
      pdf.text('CREW', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      
      scene.schedule.crew.forEach(member => {
        pdf.text(`${member.role}: ${member.callTime} - ${member.wrapTime}`, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 10;

      // Schedule
      pdf.setFontSize(14);
      pdf.text('SCHEDULE', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);

      scene.schedule.timeline.forEach(block => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`${block.startTime} - ${block.endTime}: ${block.activity}`, 20, yPosition);
        yPosition += 6;
      });

      pdf.save(`${scene.title.replace(/[^a-z0-9]/gi, '_')}_call_sheet.pdf`);
    } catch (error) {
      console.error('Call sheet export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportShotList = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('landscape');
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Header
      pdf.setFontSize(16);
      pdf.text('SHOT LIST', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.text(scene.title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Table headers
      pdf.setFontSize(10);
      pdf.text('Shot', 20, yPosition);
      pdf.text('Description', 50, yPosition);
      pdf.text('Size', 150, yPosition);
      pdf.text('Angle', 180, yPosition);
      pdf.text('Movement', 210, yPosition);
      pdf.text('Duration', 250, yPosition);
      yPosition += 10;

      // Draw line
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 5;

      // Shot data
      scene.shotList.forEach(shot => {
        if (yPosition > 180) {
          pdf.addPage('landscape');
          yPosition = 20;
        }

        pdf.text(shot.number, 20, yPosition);
        const descLines = pdf.splitTextToSize(shot.description, 90);
        pdf.text(descLines[0] || '', 50, yPosition);
        pdf.text(shot.shotSize.replace(/-/g, ' '), 150, yPosition);
        pdf.text(shot.angle.replace(/-/g, ' '), 180, yPosition);
        pdf.text(shot.movement.type, 210, yPosition);
        pdf.text(`${shot.duration}s`, 250, yPosition);
        yPosition += 8;
      });

      pdf.save(`${scene.title.replace(/[^a-z0-9]/gi, '_')}_shot_list.pdf`);
    } catch (error) {
      console.error('Shot list export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportEquipmentList = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      let yPosition = 20;

      // Header
      pdf.setFontSize(16);
      pdf.text('EQUIPMENT LIST', 105, yPosition, { align: 'center' });
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.text(scene.title, 105, yPosition, { align: 'center' });
      yPosition += 20;

      // Camera Equipment
      pdf.setFontSize(14);
      pdf.text('CAMERA', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.text(`Body: ${scene.equipment.camera.body}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Cost: ${formatCurrency(scene.equipment.camera.cost)}`, 20, yPosition);
      yPosition += 15;

      // Lenses
      pdf.setFontSize(14);
      pdf.text('LENSES', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      scene.equipment.lenses.forEach(lens => {
        pdf.text(`${lens.model} - ${lens.purpose} - ${formatCurrency(lens.cost)}`, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 10;

      // Lighting
      pdf.setFontSize(14);
      pdf.text('LIGHTING', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      scene.equipment.lighting.forEach(light => {
        pdf.text(`${light.model} (${light.power}) - ${formatCurrency(light.cost)}`, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 10;

      // Audio
      pdf.setFontSize(14);
      pdf.text('AUDIO', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      scene.equipment.audio.forEach(audio => {
        pdf.text(`${audio.model} - ${audio.purpose} - ${formatCurrency(audio.cost)}`, 20, yPosition);
        yPosition += 6;
      });

      pdf.save(`${scene.title.replace(/[^a-z0-9]/gi, '_')}_equipment_list.pdf`);
    } catch (error) {
      console.error('Equipment list export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportBudgetBreakdown = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      let yPosition = 20;

      // Header
      pdf.setFontSize(16);
      pdf.text('BUDGET BREAKDOWN', 105, yPosition, { align: 'center' });
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.text(scene.title, 105, yPosition, { align: 'center' });
      yPosition += 20;

      // Budget categories
      scene.budget.breakdown.forEach(category => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(14);
        pdf.text(category.category.toUpperCase(), 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        category.items.forEach(item => {
          pdf.text(`${item.name} (×${item.quantity}) @ ${formatCurrency(item.rate)}`, 25, yPosition);
          pdf.text(formatCurrency(item.total), 150, yPosition);
          yPosition += 6;
        });

        pdf.setFontSize(12);
        pdf.text('Subtotal:', 25, yPosition);
        pdf.text(formatCurrency(category.subtotal), 150, yPosition);
        yPosition += 15;
      });

      // Total
      pdf.line(20, yPosition, 180, yPosition);
      yPosition += 10;
      pdf.setFontSize(14);
      pdf.text('TOTAL:', 25, yPosition);
      pdf.text(formatCurrency(scene.budget.total), 150, yPosition);

      pdf.save(`${scene.title.replace(/[^a-z0-9]/gi, '_')}_budget.pdf`);
    } catch (error) {
      console.error('Budget export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(scene, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${scene.title.replace(/[^a-z0-9]/gi, '_')}_scene_data.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const documents = [
    {
      id: 'call-sheet',
      title: 'Call Sheet',
      description: 'Daily production schedule with crew, location, and timing details',
      icon: Calendar,
      action: exportCallSheet,
      color: 'blue'
    },
    {
      id: 'shot-list',
      title: 'Shot List',
      description: 'Detailed breakdown of all shots with technical specifications',
      icon: FileText,
      action: exportShotList,
      color: 'green'
    },
    {
      id: 'equipment-list',
      title: 'Equipment List',
      description: 'Complete inventory of required equipment with costs',
      icon: Settings,
      action: exportEquipmentList,
      color: 'purple'
    },
    {
      id: 'budget',
      title: 'Budget Breakdown',
      description: 'Detailed cost analysis by category with totals',
      icon: Users,
      action: exportBudgetBreakdown,
      color: 'orange'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Production Documents</h3>
          <p className="text-sm text-gray-600">Export professional production documents for your scene</p>
        </div>
        <button
          onClick={exportJSON}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export JSON</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 bg-${doc.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${doc.color}-600`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{doc.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                  <button
                    onClick={doc.action}
                    disabled={isExporting}
                    className={`flex items-center space-x-2 px-3 py-2 bg-${doc.color}-600 text-white rounded-md hover:bg-${doc.color}-700 disabled:opacity-50 transition-colors text-sm`}
                  >
                    {isExporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Printer className="w-4 h-4" />
                        <span>Export PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Production Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-blue-600 text-lg">{scene.shotList.length}</div>
            <div className="text-gray-600">Total Shots</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600 text-lg">{scene.schedule.crew.length}</div>
            <div className="text-gray-600">Crew Members</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-purple-600 text-lg">
              {scene.equipment.camera ? 1 + scene.equipment.lenses.length + scene.equipment.lighting.length + scene.equipment.audio.length : 0}
            </div>
            <div className="text-gray-600">Equipment Items</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-orange-600 text-lg">{formatCurrency(scene.budget.total)}</div>
            <div className="text-gray-600">Total Budget</div>
          </div>
        </div>
      </div>
    </div>
  );
};