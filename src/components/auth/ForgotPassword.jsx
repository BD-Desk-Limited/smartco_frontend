import React from 'react';
import Link from 'next/link';

const ForgotPassword = () => {

  const [form, setForm] = React.useState({ email: '' });
  const [error, setError] = React.useState(null);
  const handleSubmit = async (e) => { }
  return <div className="w-full items-center justify-center flex flex-col gap-8">
    <h1 className="text-2xl text-brand-blue w-full text-center font-semibold">
      Login
    </h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="email" className="w-full text-left text-base">
          Email/Phone Number
        </label>
        <input
          type="text"
          placeholder="email/phone number"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`w-full border rounded-md px-4 h-10 items-center shadow-sm focus:outline-none text-base ${error ? 'border-2 shadow-none border-error text-error placeholder-error' : 'border-brand-blue'}`}
        />
      </div>
      <button
        type="submit"
        className="bg-brand-blue text-white w-full rounded-md h-10 shadow-sm"
      >Reset Password</button></form>
    <span className="text-base text-text-black">
      Don&apos;t have an account?{' '}
      <Link href={'/pages/auth/sign-up'}>
        <span className="text-brand-blue hover:font-semibold cursor-pointer">
          Sign Up
        </span>
      </Link>
    </span>
  </div>;
};

export default ForgotPassword;
