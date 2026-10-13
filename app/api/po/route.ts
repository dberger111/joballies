import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    success: true,
    po: {
      poNumber: 'PO-JA-' + Math.floor(100000 + Math.random() * 900000),
      supplier: 'Home Depot Pro / SiteOne Sync',
      subtotal: 150.00,
      total: 159.50,
      merchantCartUrl: 'https://www.homedepot.com/c/pro_services'
    }
  });
}