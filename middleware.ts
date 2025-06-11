import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const token = (await getToken({
		req,
		secret: process.env.AUTH_SECRET,
		cookieName:
			process.env.NODE_ENV === "production"
				? "__Secure-authjs.session-token"
				: "authjs.session-token", // or test which one is being set locally
	})) as {
		email: string;
		role: string;
		name: string;
		id: string;
	};

	if (req.nextUrl.pathname.startsWith("/dashboard") && !token) {
		const signInUrl = req.nextUrl.clone();
		signInUrl.pathname = "/signin";
		return NextResponse.redirect(signInUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
