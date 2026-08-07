import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  
  // Karena PKCE code verifier disimpan di Local Storage browser (karena kita
  // memanggil resetPasswordForEmail dari client side), proses exchange code
  // HARUS dilakukan di client side.
  // Oleh karena itu, kita teruskan semua parameter ke /auth/confirm (client component).
  
  const confirmUrl = new URL(`${origin}/auth/confirm`);
  
  // Copy all search params (like code, error, etc.)
  searchParams.forEach((value, key) => {
    confirmUrl.searchParams.append(key, value);
  });

  return NextResponse.redirect(confirmUrl.toString());
}
