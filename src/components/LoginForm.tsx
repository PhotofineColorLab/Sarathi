import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormData>();
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const onSubmit = (data: LoginFormData) => {
    const success = login(data.email, data.password);
    if (success) {
      toast.success('Login successful! Redirecting to dashboard...', {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => navigate('/dashboard')
      });
    } else {
      toast.error('Invalid email or password. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setError('email', { message: 'Invalid email or password' });
      setError('password', { message: 'Invalid email or password' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 flex flex-col items-center">
          <div className="bg-primary p-4 rounded-xl shadow-lg">
            <Zap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mt-4">Sarathi Electricals</h1>
        </div>
        
        <div className="shadcn-card p-8 border-2 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Sign In</h2>
            <p className="text-muted-foreground mt-2">Enter your credentials to access the dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="shadcn-form-item">
              <label className="shadcn-form-label mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full h-10 pl-10 pr-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div className="shadcn-form-item">
              <label className="shadcn-form-label mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full h-10 pl-10 pr-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 mt-4 flex items-center justify-center gap-2 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;