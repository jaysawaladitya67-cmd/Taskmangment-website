import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">About Dashboard App</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A powerful work management system designed to streamline task assignment 
            and tracking for teams of all sizes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-primary">Our Mission</CardTitle>
              <CardDescription>
                Empowering teams through efficient workflow management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe that effective task management is the cornerstone of successful teams. 
                Our platform provides intuitive tools for administrators to assign work and for 
                team members to track their progress, creating a seamless workflow experience.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-primary">Key Features</CardTitle>
              <CardDescription>
                Everything you need in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Role-based access control (Admin & User)</li>
                <li>• Intuitive task assignment system</li>
                <li>• Real-time progress tracking</li>
                <li>• User registration and management</li>
                <li>• Clean, responsive dashboard interface</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="shadow-elegant inline-block">
            <CardHeader>
              <CardTitle className="text-primary">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
                <span className="px-3 py-1 bg-secondary rounded-full">React</span>
                <span className="px-3 py-1 bg-secondary rounded-full">TypeScript</span>
                <span className="px-3 py-1 bg-secondary rounded-full">Tailwind CSS</span>
                <span className="px-3 py-1 bg-secondary rounded-full">Shadcn/ui</span>
                <span className="px-3 py-1 bg-secondary rounded-full">LocalStorage</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;