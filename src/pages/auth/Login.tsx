import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-shrine.jpg';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // 🔹 Sign up logic
        const { data: existingUser } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single();

        if (existingUser) {
          toast({
            title: 'Error',
            description: 'Email already exists',
            variant: 'destructive',
          });
        } else {
          const { error } = await supabase
            .from('users')
            .insert([{ email, password }]);

          if (error) throw error;

          toast({
            title: 'Account created!',
            description: 'You can now sign in.',
          });
          setIsSignUp(false);
        }
      } else {
        // 🔹 Login logic
       const { data: user, error } = await supabase
        .from('users')
        .select('id, email, name, role') // explicitly include role
        .eq('email', email)
        .eq('password', password)
        .single();

        if (error || !user) {
          toast({
            title: 'Invalid credentials',
            description: 'Email or password is incorrect',
            variant: 'destructive',
          });
        } else {
          localStorage.setItem('user', JSON.stringify(user));
          console.log(user.role)
          toast({
            title: 'Welcome back!',
            description: 'Logged in successfully',
          });
           if (user.role === 'admin') {
    navigate('/cms'); // admin → CMS
  } else {
    navigate('/'); // normal user → homepage
  }
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 to-primary/80 z-0" />

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md p-8 shadow-glow animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">Z</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Sign up to manage your tours' : 'Sign in to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-background"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full gradient-primary text-white hover:shadow-glow transition-smooth"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
