import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react"; // 👈 Eye icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (login(email, password)) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      if (email === "admin@1") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    // TODO: Call backend API to send OTP
    toast({
      title: "OTP Sent",
      description: `An OTP has been sent to ${forgotEmail}`,
    });

    setIsForgotOpen(false);
    setForgotEmail("");
  };
 const handleSendOtp = async () => {
    if (!forgotEmail) {
      toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
      return;
    }

    // ✅ Call backend API to send OTP
    const response = await fetch("http://localhost:3000/api/auth/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });

    if (response.ok) {
      toast({ title: "OTP Sent", description: `An OTP has been sent to ${forgotEmail}` });
      setStep("otp"); // Go to OTP step
    } else {
      toast({ title: "Error", description: "Failed to send OTP", variant: "destructive" });
    }
  };

  const handleVerifyOtp = async () => {
    const response = await fetch("http://localhost:3000/api/auth/verifyResetOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail, otp }),
    });

    if (response.ok) {
      toast({ title: "Success", description: "OTP verified" });
      setStep("reset"); // Go to Reset step
    } else {
      toast({ title: "Error", description: "Invalid OTP", variant: "destructive" });
    }
  };

  const handleResetPassword = async () => {
    const response = await fetch("http://localhost:3000/api/auth/resetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail, password:newPassword }),
    });
    console.log(response);
    if (response.ok) {
      toast({ title: "Success", description: "Password reset successful" });
      setIsForgotOpen(false);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setStep("email"); // reset flow
    } else {
      toast({ title: "Error", description: "Failed to reset password", variant: "destructive" });
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Login</CardTitle>
          <CardDescription>
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // 👈 toggle karega
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => setIsForgotOpen(true)}
            >
              Forgot Password?
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Popup */}
         <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
        </DialogHeader>

        {/* Step 1: Enter Email */}
        {step === "email" && (
          <div className="space-y-4">
            <Label htmlFor="forgotEmail">Enter your Email</Label>
            <Input
              id="forgotEmail"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <DialogFooter className="mt-4">
              <Button onClick={handleSendOtp}>Send OTP</Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === "otp" && (
          <div className="space-y-4">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <DialogFooter className="mt-4">
              <Button onClick={handleVerifyOtp}>Verify OTP</Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === "reset" && (
          <div className="space-y-4">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <DialogFooter className="mt-4">
              <Button onClick={handleResetPassword}>Reset Password</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default Login;
