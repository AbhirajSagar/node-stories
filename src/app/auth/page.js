"use client"

import { useState } from "react"
import CustomFetch from "../utils/apiHelper"
import { useRouter } from "next/navigation"

export default function AuthPage() 
{
	const [mode, setMode] = useState("signin")
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [confirm, setConfirm] = useState();
	const [dob, setDob] = useState();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);
	const router = useRouter();

	function resetMessages() 
    {
		setMessage(null)
		setError(null)
	}

	function isValidEmail(value) 
    {
		return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
	}

	function validateForm() 
    {
		resetMessages();

		if (mode === "signup") 
        {
			if (!name || name.trim().length < 2) 
            {
				setError("Please enter a valid name.")
				return false
			}

			if (!dob) 
            {
				setError("Please select your date of birth.")
				return false
			}
		}

		if (!email || !isValidEmail(email)) 
        {
			setError("Please enter a valid email address.")
			return false
		}

		if (!password || password.length < 6) 
        {
			setError("Password should be at least 6 characters.")
			return false
		}

		if (mode === "signup" && password !== confirm) 
        {
			setError("Passwords do not match.")
			return false
		}

		return true
	}

	async function onSubmit(e) 
    {
		e.preventDefault()
		
		if (!validateForm()) 
			return;

		setLoading(true)
		setError(null)

		if (mode === "signin")
		{
			await signIn();
		}
		else if (mode === "signup")
		{
			await signUp();
		}
	}

	async function signIn()
    {
		const res = await CustomFetch("/api/auth/signin", "POST", { email, password });
		console.log(res);

		if(res.status !== 201 && res.status !== 200) setError(res.data.message);

		setMessage(res.data.message);
		setLoading(false);
		router.push('/');
	}

	async function signUp()
    {
		const res = await CustomFetch("/api/auth/signup", "POST", { name, email, password, dob });
		console.log(res);

		if(res.status !== 201 && res.status !== 200) setError(res.data.message);

		setMessage(res.data.message);
		setMode('signin');
		setLoading(false);
	}

	function handleModeChange(newMode) 
    {
		setMode(newMode)
		resetMessages()
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-3 sm:p-8 bg-linear-to-b from-slate-900 to-slate-950 text-slate-100">
			<div className="w-full max-w-md bg-white/5 border border-white/5 p-7 rounded-2xl shadow-lg" role="main" aria-labelledby="auth-heading">
				<h1 id="auth-heading" className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
				<p className="text-sm text-slate-300 mt-1 mb-4">{mode === "signin" ? "Sign in to continue" : "Sign up to get started"}</p>

				<form onSubmit={onSubmit} className="grid gap-3" noValidate>
					{mode === "signup" && (
						<InputField label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
					)}
					<InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
					<InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a secure password" />
					{mode === "signup" && (
						<>
							<InputField label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" />
							<InputField label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
						</>
					)}
					<Alert kind={error ? "error" : "success"}>{error ?? message}</Alert>
					<SubmitButton loading={loading} mode={mode} />
				</form>

				<div className="mt-4 flex flex-col gap-2">
					<div className="flex items-center gap-3">
						{mode === "signin" ? <CreateAccountBtn setMode={handleModeChange} /> : <SignInBtn setMode={handleModeChange} />}
					</div>
					<div className="text-xs text-center mt-2 text-slate-400">By continuing you agree to our <a href="#" onClick={(e)=>e.preventDefault()} className="text-teal-200">Terms</a> and <a href="#" onClick={(e)=>e.preventDefault()} className="text-teal-200">Privacy Policy</a>.</div>
				</div>
			</div>
		</div>
	)
}

function InputField({ label, type = "text", value, onChange, placeholder }) 
{
    return (	
        <label className="flex flex-col">
            <span className="text-xs text-slate-300 mb-2">{label}</span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="bg-white/3 border border-white/6 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-sky-300/20"
            />
        </label>
    )
}


function Alert({ kind = "error", children }) 
{
    const base = "p-2 rounded-md text-sm border"
    if (!children) return null
    if (kind === "error") return <div className={`${base} bg-rose-700/20 text-rose-100 border-rose-700/30`} role="alert">{children}</div>
    return <div className={`${base} bg-emerald-600/10 text-emerald-200 border-emerald-600/20`} role="status">{children}</div>
}

function SubmitButton({ loading, mode }) 
{
    return (
        <button className="mt-2 w-full py-2 rounded-lg bg-linear-to-r from-teal-400 to-blue-500 hover:text-white hover:brightness-125 transition-all duration-150 cursor-pointer text-slate-900 font-semibold disabled:opacity-60" type="submit" disabled={loading}>
            {loading ? (mode === "signin" ? "Signing in…" : "Creating…") : (mode === "signin" ? "Sign in" : "Sign up")}
        </button>
    )
}

function CreateAccountBtn({ setMode }) 
{
    return (
        <div className="flex flex-col justify-center items-center w-full">
            <p className="text-sm w-full text-center text-slate-300">Don't have an account?</p>
            <button className="text-teal-200 text-sm font-semibold cursor-pointer hover:underline" type="button" onClick={() => setMode("signup")}>
                Create account
            </button>
        </div>
    );
}

function SignInBtn({ setMode }) 
{
    return (
        <>
            <span className="text-sm text-slate-300">Already have an account?</span>
            <button className="text-teal-200 font-semibold cursor-pointer hover:underline" type="button" onClick={() => setMode("signin")}>
                Sign in
            </button>
        </>
    );
}