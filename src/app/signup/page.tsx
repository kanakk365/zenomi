'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { signup, login } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isSignIn, setIsSignIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signInPassword, setSignInPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSignInInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignIn) {
        // Login
        const response = await login({
          email: signInData.email,
          password: signInData.password,
        });
        
        setAuth({ accessToken: response.accessToken, refreshToken: response.refreshToken, user: response.user });
        router.push('/welcome'); // Redirect to welcome/onboarding page
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        const response = await signup({
          name: formData.name,
          email: formData.email,
          countryCode: formData.countryCode,
          mobileNo: formData.mobile,
          password: formData.password,
        });
        
        setAuth({ accessToken: response.accessToken, refreshToken: response.refreshToken, user: response.user });
        router.push('/welcome'); // Redirect to welcome/onboarding page
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-urbanist overflow-hidden">
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 px-16 overflow-hidden h-full" style={{
        background: 'linear-gradient(90deg, #704180 6.54%, #8B2D6C 90.65%)'
      }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-8">
          </div>

          <div className="flex-1 flex items-center justify-center">
             <div className="w-full rounded-lg p-10 px-16 pb-0 pr-0 flex flex-col gap-8 backdrop-blur-xs bg-white/10">
              <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-bold text-white leading-tight">
                  Welcome to Zenomi
                </h1>
                  <p className="text-2xl font-medium leading-relaxed bg-gradient-to-r from-[#F7C569] via-[#FBE2B4] to-[#F8E4FF] bg-clip-text text-transparent">
                  AI-driven assessment, meaningful reports, expert help
                </p>
              </div>

              <div className="relative mx-auto w-[300px] h-[376px] rounded-lg overflow-hidden">
               <Image
                  src="/family.png"
                  alt="Parents hugging their smiling child"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 lg:p-12 h-full overflow-y-hidden">
        <div className="w-full max-w-[358px]">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#8B2D6C] to-[#704180] rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">Z</span>
              </div>
              <span className="text-xl font-semibold text-[#704180]">Zenomi Health</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-1 bg-[#F2EEF4] p-1 rounded-lg">
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 py-2.5 px-5 rounded-lg text-base font-normal text-center transition-colors ${
                  !isSignIn
                    ? 'bg-gradient-to-r from-[#8B2D6C] to-[#704180] text-white'
                    : 'text-[#9C9AA5] hover:bg-white/50'
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 py-2.5 px-5 rounded-lg text-base font-normal text-center transition-colors ${
                  isSignIn
                    ? 'bg-gradient-to-r from-[#8B2D6C] to-[#704180] text-white'
                    : 'text-[#9C9AA5] hover:bg-white/50'
                }`}
              >
                Sign In
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {isSignIn ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-base font-normal text-[#26203B]">
                  Email Id
                </label>
                <input
                  type="email"
                  name="email"
                  value={signInData.email}
                  onChange={handleSignInInputChange}
                  placeholder="Enter Email Id"
                  className="w-full px-4 py-2 border border-[rgba(136,136,136,0.4)] rounded-lg text-sm text-[#9C9AA5] focus:outline-none focus:ring-2 focus:ring-[#704180]/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-normal text-[#26203B]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={signInPassword ? 'text' : 'password'}
                    name="password"
                    value={signInData.password}
                    onChange={handleSignInInputChange}
                    placeholder="Enter Password"
                    className="w-full px-4 py-2 pr-10 border border-[rgba(136,136,136,0.4)] rounded-lg text-sm text-[#9C9AA5] focus:outline-none focus:ring-2 focus:ring-[#704180]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setSignInPassword(!signInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9AA5] hover:text-[#26203B] transition-colors"
                    aria-label={signInPassword ? 'Hide password' : 'Show password'}
                  >
                    {signInPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-[#704180] hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="space-y-5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-5 cursor-pointer bg-linear-to-r from-[#8B2D6C] to-[#704180] text-white text-base font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[rgba(156,154,165,0.3)]"></div>
                  </div>
                  <div className="relative bg-white px-3">
                    <span className="text-xs font-medium text-[rgba(156,154,165,0.3)]">OR</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-3 px-5 border border-[rgba(112,65,128,0.3)] rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Image
                      src="/images/google-logo.png"
                      alt="Google"
                      width={20}
                      height={20}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/><path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/><path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/><path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C15.959.99 13.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="text-base font-normal text-[#1D1C2B]">Sign in with Google</span>
                </button> */}
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-base font-normal text-[#26203B]">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                  className="w-full px-4 py-2 border border-[rgba(136,136,136,0.4)] rounded-lg text-sm text-[#9C9AA5] focus:outline-none focus:ring-2 focus:ring-[#704180]/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-normal text-[#26203B]">
                  Email Id
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email Id"
                  className="w-full px-4 py-2 border border-[rgba(136,136,136,0.4)] rounded-lg text-sm text-[#9C9AA5] focus:outline-none focus:ring-2 focus:ring-[#704180]/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-normal text-[#26203B]">
                  Mobile number
                </label>
                <div className="flex gap-2">
                  <div className="relative w-20">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 pr-8 border border-[rgba(136,136,136,0.4)] rounded-lg text-sm text-[#26203B] focus:outline-none focus:ring-2 focus:ring-[#704180]/20 bg-white appearance-none"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9AA5] pointer-events-none" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter Mobile number"
                    className="flex-1 px-4 py-2 border border-[rgba(136,136,136,0.4)] rounded-lg text-sm text-[#9C9AA5] focus:outline-none focus:ring-2 focus:ring-[#704180]/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-normal text-[#26203B]">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter Password"
                    className="w-full px-4 py-2 pr-10 border border-[rgba(136,136,136,0.4)] rounded-lg text-sm text-[#9C9AA5] focus:outline-none focus:ring-2 focus:ring-[#704180]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9AA5] hover:text-[#26203B] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-normal text-[#26203B]">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Enter Password"
                    className="w-full px-4 py-2 pr-10 border border-[rgba(136,136,136,0.4)] rounded-lg text-sm text-[#9C9AA5] focus:outline-none focus:ring-2 focus:ring-[#704180]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9AA5] hover:text-[#26203B] transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-5 bg-gradient-to-r from-[#8B2D6C] to-[#704180] text-white text-base font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[rgba(156,154,165,0.3)]"></div>
                  </div>
                  <div className="relative bg-white px-3">
                    <span className="text-xs font-medium text-[rgba(156,154,165,0.3)]">OR</span>
                  </div>
                </div> */}

                {/* <button
                  type="button"
                  className="w-full py-3 px-5 border border-[rgba(112,65,128,0.3)] rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Image
                      src="/images/google-logo.png"
                      alt="Google"
                      width={20}
                      height={20}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/><path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/><path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/><path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C15.959.99 13.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="text-base font-normal text-[#1D1C2B]">Sign up with Google</span>
                </button> */}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

