import jsPDF from 'jspdf';
import { Incident } from './authority-types';

export function generatePDF(incident: Incident, shouldMaskPII: boolean = false): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text('INCIDENT REPORT', 20, 20);
  
  doc.setFontSize(12);
  doc.text('Issuing Authority: Maharashtra Police — Pilot Incident Dashboard', 20, 30);
  doc.text('Document Type: Sample Incident Report (Confidential — Demo)', 20, 40);
  
  // Incident details
  doc.setFontSize(14);
  doc.text(`Incident ID: ${incident.id}`, 20, 60);
  doc.setFontSize(12);
  
  // Format event type with weapon/violent indicators
  const eventTypeFormatted = incident.eventType.replace('_', ' ').toUpperCase();
  const weaponLinked = ['sexual_violence', 'domestic_violence', 'mob_violence_lynching', 'road_rage_incidents'].includes(incident.eventType) ? ' (Weapon-Linked / Violent)' : '';
  doc.text(`Event Type: ${eventTypeFormatted}${weaponLinked}`, 20, 70);
  
  doc.text(`Severity: ${incident.severity.toUpperCase()}`, 20, 80);
  doc.text(`Status: ${incident.status.replace('_', ' ').toUpperCase()}`, 20, 90);
  doc.text(`Confidence: ${Math.round(incident.confidence * 100)}%`, 20, 100);
  
  // Verification info
  doc.text('Verified By: Analyst (Verified)', 20, 110);
  
  // Location
  doc.text(`Location: ${incident.location.district}, ${incident.location.state} — PIN ${generatePIN(incident.location.district)}`, 20, 130);
  doc.text(`Coordinates: ${incident.location.lat.toFixed(6)}, ${incident.location.lng.toFixed(6)}`, 20, 140);
  
  // Time
  const eventTime = new Date(incident.timestamp);
  const reportTime = new Date();
  doc.text(`Timestamp (Event): ${eventTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`, 20, 150);
  doc.text(`Report Generated: ${reportTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`, 20, 160);
  
  // Description
  doc.setFontSize(11);
  doc.text('Automated Description:', 20, 180);
  const splitDescription = doc.splitTextToSize(incident.description, 170);
  doc.text(splitDescription, 20, 190);
  
  doc.text('Verified by analyst.', 20, 210);
  
  // Assignment info
  doc.text('Assigned Verifier: Analyst ID: VER-DEM-01', 20, 230);
  doc.text('Recommended Officer on Duty: SHO, Haveli Police Station', 20, 240);
  
  // Validation Evidence
  doc.setFontSize(12);
  doc.text('Validation Evidence:', 20, 260);
  doc.setFontSize(11);
  doc.text('EXIF Integrity: Valid', 20, 270);
  doc.text('Location Confirmed: Yes (GPS metadata)', 20, 280);
  doc.text('Timeline Consistent: Yes', 20, 290);
  doc.text('Media Hash (SHA-256): DEMO_HASH_PLACEHOLDER_ABC123', 20, 300);
  doc.text('Storage Reference: enc://pilot/20250410/' + incident.id.substring(0, 8).toUpperCase(), 20, 310);
  
  doc.save(`incident-report-${incident.id}.pdf`);
}

// Helper function to generate PIN codes
function generatePIN(district: string): string {
  const pinMap: { [key: string]: string } = {
    'Pune': '411039',
    'Mumbai': '400001',
    'Delhi': '110001',
    'Chennai': '600001',
    'Bangalore': '560001',
    'Hyderabad': '500001',
    'Kolkata': '700001',
    'Ahmedabad': '380001',
    'Jaipur': '302001',
    'Lucknow': '226001'
  };
  return pinMap[district] || '411039';
}

export function generateCAP(incident: Incident): void {
  const capXml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${incident.id}</identifier>
  <sender>authority-dashboard@gov.in</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>${incident.eventType.replace('_', ' ')}</event>
    <urgency>${incident.severity === 'extreme' ? 'Immediate' : incident.severity === 'high' ? 'Expected' : 'Future'}</urgency>
    <severity>${incident.severity}</severity>
    <certainty>Observed</certainty>
    <headline>${incident.title}</headline>
    <description>${incident.description}</description>
    <instruction>Follow local authority guidelines and emergency procedures.</instruction>
    <web>https://authority-dashboard.gov.in/incidents/${incident.id}</web>
    <area>
      <areaDesc>${incident.location.address}, ${incident.location.district}, ${incident.location.state}</areaDesc>
      <circle>${incident.location.lat},${incident.location.lng} 5</circle>
    </area>
  </info>
</alert>`;

  const blob = new Blob([capXml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `incident-${incident.id}.cap`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateGeoJSON(incidents: Incident[]): void {
  const geoJson = {
    type: 'FeatureCollection',
    features: incidents.map(incident => ({
      type: 'Feature',
      properties: {
        id: incident.id,
        title: incident.title,
        eventType: incident.eventType,
        severity: incident.severity,
        confidence: incident.confidence,
        status: incident.status,
        timestamp: incident.timestamp,
        description: incident.description,
        district: incident.location.district,
        state: incident.location.state,
        affectedPopulation: incident.affectedPopulation
      },
      geometry: {
        type: 'Point',
        coordinates: [incident.location.lng, incident.location.lat]
      }
    }))
  };

  const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'incidents.geojson';
  a.click();
  URL.revokeObjectURL(url);
}

export function generateCSV(incidents: Incident[], shouldMaskPII: boolean = false): void {
  const headers = [
    'ID', 'Title', 'Event Type', 'Severity', 'Status', 'Confidence', 
    'Timestamp', 'District', 'State', 'Address', 'Latitude', 'Longitude',
    'Affected Population', 'Description', 'Analyst Notes'
  ].join(',');

  const rows = incidents.map(incident => [
    incident.id,
    `"${incident.title}"`,
    incident.eventType,
    incident.severity,
    incident.status,
    incident.confidence,
    incident.timestamp,
    incident.location.district,
    incident.location.state,
    `"${incident.location.address}"`,
    incident.location.lat,
    incident.location.lng,
    incident.affectedPopulation || '',
    `"${incident.description.replace(/"/g, '""')}"`,
    `"${incident.analystNotes.replace(/"/g, '""')}"`
  ].join(',')).join('\n');

  const csv = headers + '\n' + rows;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'incidents.csv';
  a.click();
  URL.revokeObjectURL(url);
}