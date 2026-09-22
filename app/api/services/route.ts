import { NextResponse } from 'next/server';

const SERVICES = [
  {
    id: 'semi-natural',
    name: 'Semi-permanente en uña natural',
    durationMinutes: 45,
    price: 5000,
    deposit: 2500,
    order: 1,
  },
  {
    id: 'gel-sm',
    name: 'Gel X',
    description: 'Elige tamaño (S/M/L/XL) y tipo (normal/Piedrera/3D)',
    durationMinutes: 60,
    price: 8000,
    deposit: 4000,
    order: 2,
  },
  {
    id: 'semi-feet',
    name: 'Semi-permanente en pies',
    durationMinutes: 45,
    price: 4000,
    deposit: 2000,
    order: 3,
  },
];

export async function GET() {
  try {
    return NextResponse.json(SERVICES);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
