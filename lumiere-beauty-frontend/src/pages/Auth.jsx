import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
export default function Auth({ register=false }) {
    const title=register?'Create your account':'Welcome back'
    const [fullName,setFullName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

  
    const handleSubmit = async (e) => {
        e.preventDefault()

            try {
                let response

                if (register) {
                    // Register new user
                    response = await axios.post(
                        'http://localhost:8080/api/users',
                        {
                            fullName,
                            email,
                            password
                        }
                    )

                    alert('Account created successfully! Please log in.')
                } else {
                    // Login existing user
                    response = await axios.post(
                        'http://localhost:8080/api/users/login',
                        {
                            email,
                            password
                        }
                    )

                    alert(`Welcome back, ${response.data.fullName}!`)
                }

                console.log(response.data)

            } catch (error) {
                console.error(error)

                if (error.response) {
                    alert(error.response.data.message || 'Invalid email or password.')
                } else {
                    alert('Cannot connect to the backend. Please try again.')
                }
            }
        }


    return (
        <main className="container-page flex min-h-[65vh] items-center justify-center py-14">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-3xl border border-line p-8 shadow-soft"
            >
                <p className="eyebrow text-center text-rose">Lumière account</p>

                <h1 className="mt-3 text-center font-display text-4xl">
                    {title}
                </h1>

                <p className="mt-3 text-center text-sm text-muted">
                    {register?'Join us for your everyday beauty ritual.':'Sign in to view your account and orders.'}
                </p>

                {register && (
                    <input
                        required
                        type="text"
                        className="field mt-5"
                        placeholder="Full name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                    />
                )}

                <input
                required
                type="email"
                className="field mt-5"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

                <input
                    required
                    type="password"
                    className="field mt-3"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button className="btn-primary mt-6 w-full">
                    {register?'Create account':'Sign in'}
                </button>

                <p className="mt-5 text-center text-xs text-muted">
                    {register?'Already have an account?':'New to Lumière?'}
                    {' '}
                    <Link className="font-semibold text-rose" to={register?'/login':'/register'}>
                        {register?'Sign in':'Create an account'}
                    </Link>
                </p>
            </form>
        </main>
    )
}
