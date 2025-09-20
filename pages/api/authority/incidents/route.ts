import { NextRequest, NextResponse } from 'next/server';
import { incidents } from '@/lib/authority-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const status = searchParams.get('status');
  const district = searchParams.get('district');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  let filteredIncidents = [...incidents];

  if (status && status !== 'all') {
    filteredIncidents = filteredIncidents.filter(i => i.status === status);
  }

  if (district && district !== 'all') {
    filteredIncidents = filteredIncidents.filter(i => i.location.district === district);
  }

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    filteredIncidents = filteredIncidents.filter(i => {
      const incidentDate = new Date(i.timestamp);
      return incidentDate >= startDate && incidentDate <= endDate;
    });
  }

  return NextResponse.json(filteredIncidents);
}