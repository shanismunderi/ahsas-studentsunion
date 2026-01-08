import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Hash, Lock, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, signIn, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ admissionNumber: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First, look up the email by admission number (member_id)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("member_id", formData.admissionNumber.trim())
        .maybeSingle();

      if (profileError) {
        toast({ title: "Login failed", description: "An error occurred. Please try again.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      if (!profile) {
        toast({ title: "Login failed", description: "Invalid admission number. Please check and try again.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      // Now sign in with the found email
      const { error } = await signIn(profile.email, formData.password);
      if (error) {
        toast({ title: "Login failed", description: "Invalid password. Please try again.", variant: "destructive" });
      } else {
        toast({ title: "Welcome back!" });
      }
    } catch (err) {
      toast({ title: "Login failed", description: "An unexpected error occurred.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-3 mb-8 sm:mb-12">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-card">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-foreground">Ahsas</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">Students Association</span>
            </div>
          </Link>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Member Login</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Sign in with your admission number and password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Admission Number</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your admission number"
                  value={formData.admissionNumber}
                  onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                  required
                  className="h-11 sm:h-12 pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-11 sm:h-12 pl-12 pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="gold" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              <span className="font-medium text-foreground">Don't have credentials?</span>
              <br />
              Contact your administrator to get your login details.
            </p>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Your password is securely encrypted and protected</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Home</Link>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-accent/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-teal/30 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <div className="w-24 h-24 rounded-3xl bg-accent/20 flex items-center justify-center mx-auto mb-8">
              <GraduationCap className="w-14 h-14 text-accent" />
            </div>
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">Welcome to the <span className="text-accent">Ahsas</span> Family</h2>
            <p className="text-lg text-primary-foreground/80 max-w-md">Access your dashboard, view achievements, download documents, and stay connected.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
