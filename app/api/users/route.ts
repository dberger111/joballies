import { NextResponse } from 'next/server';

// In-memory or persistent store for new signups
let registeredUsers: any[] = [
  { name: 'Mike Johnson', businessName: 'Johnson Construction LLC', email: 'mike@contractor.com', phone: '(203) 555-0199', trade: 'General Contractor', location: 'Weston, CT', plan: 'Pro ($49/mo)', timestamp: '2026-10-21 10:15 AM' }
];

export async function GET(request: Request) {
  return NextResponse.json({ success: true, count: registeredUsers.length, users: registeredUsers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, businessName, email, phone, trade, location, plan } = body;

    const newUser = {
      name: name || 'Verified Pro',
      businessName: businessName || name || 'Independent Pro',
      email: email || phone || 'pro@joballies.com',
      phone: phone || email || 'Direct',
      trade: trade || 'General Contractor',
      location: location || 'Weston, CT',
      plan: plan || 'Standard ($0 Free)',
      timestamp: new Date().toLocaleString()
    };

    registeredUsers.unshift(newUser); // Add to top of ledger
    console.log('[New Contractor Signup Recorded]:', newUser);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
