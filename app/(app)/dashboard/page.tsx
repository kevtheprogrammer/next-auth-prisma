"use client";
import { RootState } from "@/store";
import { fetchUsers } from "@/store/actions/userAction";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const limit = 10;

	// Filter states
	const [search, setSearch] = useState("");
	const [city, setCity] = useState("");
	const [country, setCountry] = useState("");
	const [company, setCompany] = useState("");

	useEffect(() => {
		const filters = { page, limit, search, city, country, company };
		setLoading(true);
		dispatch(fetchUsers(filters) as any).finally(() => setLoading(false));
	}, [page, search, city, country, company]);

	const users = useSelector(
		(state: RootState) => state.user?.users?.data?.data || []
	) as any;

	console.log("users", users);

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				<h1 className="text-2xl font-bold">Dashboard</h1>
				<p className="text-lg">Welcome to your dashboard!</p>
				<h1>Users</h1>
				{users.length === 0 && <p className="text-gray-500">No users found.</p>}
				{loading ? (<p className="text-gray-500">Loading...</p>) : (
				<ul className="list-disc pl-5">
					{users?.map((user: any) => (
						<li
							key={user.id}
							className="mb-2"
						>
							{user.firstName} {user.lastName} - {user.email}
						</li>
					))}
				</ul>
				)}
				<Link
					href={"/api/auth/signout"}
					className="text-blue-500 hover:underline"
				>
					Sign Out
				</Link>
			</main>
		</div>
	);
}
