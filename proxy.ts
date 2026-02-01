import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_LOGIN_PATH = '/admin/login'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Mark login page so admin layout does not redirect to itself
  const isLoginPage =
    pathname === ADMIN_LOGIN_PATH || pathname === `${ADMIN_LOGIN_PATH}/`
  if (isLoginPage) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-login', '1')
    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }

  // Don't add trailing slash for admin edit/detail routes (e.g. /admin/news/slug, /admin/media/id)
  // so that dynamic [slug]/[id] routes match correctly.
  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length >= 3) {
    const lastSegment = pathSegments[pathSegments.length - 1]
    const isEditOrDetail =
      (pathSegments[1] === 'news' && lastSegment !== 'new') ||
      (pathSegments[1] === 'statements' && lastSegment !== 'new') ||
      (pathSegments[1] === 'media' && lastSegment !== 'new') ||
      (pathSegments[1] === 'victims' && lastSegment !== 'new')
    if (isEditOrDetail && !pathname.endsWith('/')) {
      return NextResponse.next()
    }
  }

  // apply trailing slash handling
  if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    return NextResponse.redirect(
      new URL(`${request.nextUrl.pathname}/`, request.nextUrl)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
};
