import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, IdCard, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, signInWithAdmissionNumber, isLoading } = useAuth();
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
    if (!formData.admissionNumber.trim() || !formData.password.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const { error } = await signInWithAdmissionNumber(formData.admissionNumber, formData.password);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background order-2 lg:order-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-3 mb-8 lg:mb-12">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-card">
              <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-foreground">Ahsas</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">Students Association</span>
            </div>
          </Link>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Member Login</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Sign in with your admission number
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Admission Number</label>
              <div className="relative">
                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your admission number"
                  value={formData.admissionNumber}
                  onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value.toUpperCase() })}
                  required
                  className="h-11 sm:h-12 pl-12 uppercase"
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
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting} 
              className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary"
            >
              {isSubmitting ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              <span className="font-medium text-foreground">Don't have an account?</span>
              <br />
              Contact your administrator to get your login credentials.
            </p>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="hidden lg:flex flex-1 gradient-hero relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6 lg:mb-8">
              <GraduationCap className="w-10 h-10 lg:w-14 lg:h-14 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Welcome to the <span className="text-primary">Ahsas</span> Family
            </h2>
            <p className="text-base lg:text-lg text-primary-foreground/80 max-w-md">
              Access your dashboard, view achievements, download documents, and stay connected.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mobile Hero Banner */}
      <div className="lg:hidden gradient-hero p-6 order-1">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-foreground">Ahsas Students Association</h2>
            <p className="text-xs text-primary-foreground/70">Member Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
