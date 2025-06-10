"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function SignInComp() {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string>("");
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		console.log("SignInComp: handleSubmit called");
		setLoading(true);
		setError("");
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		// Handle sign-in logic here, e.g., call an API
		try {
			const response = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (response?.error) {
				console.error("Sign-in error:", response.error);
				setError("Invalid email or password.");
			} else {
				console.log("Sign-in successful:", response);
				router.push("/dashboard");
			}
		} catch (error) {
			console.error("Sign-in error:", error);
			setError("Something went wrong. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				<h1 className="text-2xl font-bold">Sign In</h1>
				<p className="text-lg">Please sign in to continue.</p>
				{error && <div className="text-red-500 text-sm ">{error}</div>}
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4"
				>
					<label
						htmlFor="email"
						className="text-sm"
					>
						Email:
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						className="border border-gray-300 rounded p-2"
					/>
					<label
						htmlFor="password"
						className="text-sm"
					>
						Password:
					</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						className="border border-gray-300 rounded p-2"
					/>
					<button
						type="submit"
						disabled={loading}
						className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto ${
							loading ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						{loading ? "Signing In..." : "Sign In"}
					</button> 
				</form>
			</main>
		</div>
	);
}
