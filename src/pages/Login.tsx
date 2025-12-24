import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import logo from "/lovable-uploads/c8289fc4-78f6-43b7-b2e5-947c434bbeda.png";
import { Footer } from "@/components/layout/Footer";

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
    <div className="min-h-screen flex flex-col">
      {/* Curved Header */}
      <div className="gradient-header curved-header-lg pt-6 pb-20 sm:pb-28 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="AHSAS" className="w-12 h-12 sm:w-14 sm:h-14" />
              <div className="text-white">
                <span className="text-lg sm:text-xl font-bold">AHSAS</span>
                <p className="text-[8px] sm:text-[9px] uppercase tracking-wide opacity-80">Al Hasanath Students Association</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Login Content */}
      <div className="flex-1 bg-gradient-to-b from-purple-light/20 to-background flex items-start justify-center px-4 -mt-12 sm:-mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">Hello, Welcome back</h1>
          </div>

          <div className="bg-card rounded-3xl shadow-card p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 bg-muted/50 border-border/50 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-12 bg-muted/50 border-border/50 rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <Link to="#" className="text-sm text-muted-foreground hover:text-primary">Forgot password?</Link>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSubmitting ? "Signing in..." : "Log in"}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back to Home</Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
