import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Sharda Associates
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Manage your work efficiently with our powerful dashboard system
            </p>
            {!user ? (
              <div className="flex justify-center space-x-4">
                <Link to="/login">
                  <Button size="lg" variant="secondary" className="text-black">
                    Get Started
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground text-black hover:bg-primary-foreground hover:text-primary"
                  >
                    Register Now
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to={user.role === "admin" ? "/admin-dashboard" : "/user-dashboard"}>
                <Button size="lg" variant="secondary">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage your workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-primary">User Management</CardTitle>
                <CardDescription>
                  Efficient user registration and authentication system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Secure login system with role-based access control for users and administrators.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-primary">Task Assignment</CardTitle>
                <CardDescription>
                  Streamlined work assignment and tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Admins can easily assign tasks to users and track progress in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-primary">Dashboard Analytics</CardTitle>
                <CardDescription>
                  Comprehensive overview of all activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Beautiful dashboards with insights into user activity and work progress.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
