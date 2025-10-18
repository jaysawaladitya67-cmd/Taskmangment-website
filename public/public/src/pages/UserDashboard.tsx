import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface WorkItem {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignedDate: string;
  dueDate: string;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<WorkItem[]>([]);

  useEffect(() => {
    const savedAssignments = localStorage.getItem("userAssignments");
    if (savedAssignments) {
      const allAssignments = JSON.parse(savedAssignments);
      const userAssignments = allAssignments.filter((assignment: WorkItem & {assignedTo: string}) => 
        assignment.assignedTo === user?.email
      );
      setAssignments(userAssignments);
    }
  }, [user?.email]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  const markAsCompleted = (assignmentId: string) => {
    const savedAssignments = localStorage.getItem("userAssignments");
    if (savedAssignments) {
      const allAssignments = JSON.parse(savedAssignments);
      const updatedAssignments = allAssignments.map((assignment: any) => 
        assignment.id === assignmentId 
          ? { ...assignment, status: "completed" }
          : assignment
      );
      localStorage.setItem("userAssignments", JSON.stringify(updatedAssignments));
      
      const userAssignments = updatedAssignments.filter((assignment: any) => 
        assignment.assignedTo === user?.email
      );
      setAssignments(userAssignments);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">User Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{assignments.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {assignments.filter(a => a.status === "completed").length}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {assignments.filter(a => a.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-primary">Your Assignments</CardTitle>
            <CardDescription>
              View all your assigned work items and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No assignments yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Wait for admin to assign work to you
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 border border-border rounded-lg bg-gradient-card"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                      <div className="flex gap-2 items-center">
                        <Badge className={getStatusColor(assignment.status)}>
                          {getStatusText(assignment.status)}
                        </Badge>
                        {assignment.status === "pending" && (
                          <button
                            onClick={() => markAsCompleted(assignment.id)}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{assignment.description}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Assigned: {assignment.assignedDate}</span>
                      <span>Due: {assignment.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;