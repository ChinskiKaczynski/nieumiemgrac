import { NextResponse } from 'next/server';

// Dodajemy oznaczenie, że ta trasa jest statyczna
export const dynamic = 'force-static';

// W przypadku static export, ta funkcja będzie używana tylko do generowania statycznej odpowiedzi
export async function GET() {
  return NextResponse.json(
    { message: 'Discord webhook API endpoint - static version' },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: 'Discord webhook API endpoint - static version' },
    { status: 200 }
  );
}

// Notka: Dla wersji statycznej, powiadomienia Discord będą musiały być obsługiwane przez:
// 1. Zewnętrzny serwer (np. serverless function na Vercel, Netlify lub AWS Lambda)
// 2. Skrypt uruchamiany przez CRON na zewnętrznym serwerze
// 3. Integrację przez serwis trzeci (np. IFTTT, Zapier)