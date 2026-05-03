"use client";

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson } from '../utils/icons';
import { toast } from 'react-toastify';

export default function ExportButton({ data, filename = 'export', columns = null, title = 'Report' }) {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Determine columns to export
      let exportData = data;
      let headers = [];
      let rows = [];

      if (columns) {
        headers = columns.map(col => col.label);
        rows = data.map(item => columns.map(col => item[col.key] || ''));
      } else {
        headers = Object.keys(data[0]);
        rows = data.map(item => headers.map(header => item[header] || ''));
      }

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `${filename}_${formatDate()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  const exportToPDF = async () => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Dynamically import html2pdf.js only when needed (code splitting)
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Create temporary div for PDF content
      const element = document.createElement('div');
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';
      
      // Build HTML table
      let headers = [];
      let rows = [];

      if (columns) {
        headers = columns.map(col => col.label);
        rows = data.map(item => columns.map(col => item[col.key] || ''));
      } else {
        headers = Object.keys(data[0]);
        rows = data.map(item => headers.map(header => item[header] || ''));
      }

      element.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>${title}</h2>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              ${headers.map(h => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; text-align: left;">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>Total Records: ${data.length}</p>
        </div>
      `;
      
      document.body.appendChild(element);
      
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${filename}_${formatDate()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };
      
      await html2pdf().set(opt).from(element).save();
      document.body.removeChild(element);
      
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('PDF export failed. Install html2pdf.js: npm install html2pdf.js');
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="p-2 hover:bg-surface-2 rounded-lg transition-fast text-tertiary disabled:opacity-50"
      >
        {isExporting ? (
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Download size={16} />
        )}
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button
              onClick={exportToCSV}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg flex items-center gap-2"
            >
              <FileSpreadsheet size={14} />
              CSV
            </button>
            <button
              onClick={exportToPDF}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-b-lg flex items-center gap-2 border-t border-gray-100"
            >
              <FileText size={14} />
              PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}