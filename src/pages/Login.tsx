import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, signIn, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await signIn(formData.email, formData.password);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-card">
              <GraduationCap className="w-7 h-7 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">Ahsas</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Students Association</span>
            </div>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Member Login</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in with credentials provided by admin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 pl-12"
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
                  className="h-12 pl-12 pr-12"
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

          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              <span className="font-medium text-foreground">Don't have an account?</span>
              <br />
              Contact your administrator to get your login credentials.
            </p>
          </div>

          <div className="mt-8 text-center">
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
