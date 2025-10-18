import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  email: string;
  name: string;
  role: string;
  password: string;
}

interface WorkItem {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignedDate: string;
  dueDate: string;
  assignedTo?: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<WorkItem[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [workForm, setWorkForm] = useState({
    title: "",
    description: "",
    dueDate: ""
  });
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showSoftwareForm, setShowSoftwareForm] = useState(false);
  const [selectedUserForSoftware, setSelectedUserForSoftware] = useState("");
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [softwareForm, setSoftwareForm] = useState({
    softwareName: "",
    version: "",
    licenseKey: ""
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load registered users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    setUsers(registeredUsers);

    // Load assignments
    const savedAssignments = JSON.parse(localStorage.getItem("userAssignments") || "[]");
    setAssignments(savedAssignments);
  }, []);

  const handleAssignWork = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !workForm.title || !workForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const newAssignment: WorkItem = {
      id: Date.now().toString(),
      title: workForm.title,
      description: workForm.description,
      status: "pending",
      assignedDate: new Date().toLocaleDateString(),
      dueDate: workForm.dueDate || "No due date",
      assignedTo: selectedUser
    };

    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    localStorage.setItem("userAssignments", JSON.stringify(updatedAssignments));

    toast({
      title: "Work Assigned",
      description: `Task assigned to ${selectedUser}`,
    });

    // Reset form
    setWorkForm({ title: "", description: "", dueDate: "" });
    setSelectedUser("");
  };

  const handleFormChange = (field: string, value: string) => {
    setWorkForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const existingUser = users.find(u => u.email === newUserForm.email);
    if (existingUser) {
      toast({
        title: "User Exists",
        description: "A user with this email already exists",
        variant: "destructive",
      });
      return;
    }

    const newUser: User = {
      name: newUserForm.name,
      email: newUserForm.email,
      password: newUserForm.password,
      role: newUserForm.role
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    toast({
      title: "User Added",
      description: `${newUserForm.name} has been added successfully`,
    });

    setNewUserForm({ name: "", email: "", password: "", role: "user" });
    setShowAddUserForm(false);
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  const deleteUser = (userEmail: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter(u => u.email !== userEmail);
      setUsers(updatedUsers);
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
      toast({
        title: "User Deleted",
        description: "User has been removed from the system",
      });
    }
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUsers = users.map(u => 
      u.email === editingUser.email ? editingUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    
    toast({
      title: "User Updated",
      description: "User information has been updated successfully",
    });
    
    setEditingUser(null);
    setShowEditForm(false);
  };

  const handleAssignSoftware = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserForSoftware || !softwareForm.softwareName) {
      toast({
        title: "Missing Information",
        description: "Please select user and software name",
        variant: "destructive",
      });
      return;
    }

    const softwareAssignment = {
      id: Date.now().toString(),
      softwareName: softwareForm.softwareName,
      version: softwareForm.version || "Latest",
      licenseKey: softwareForm.licenseKey || "Auto-generated",
      assignedTo: selectedUserForSoftware,
      assignedDate: new Date().toLocaleDateString()
    };

    const existingSoftwareAssignments = JSON.parse(localStorage.getItem("softwareAssignments") || "[]");
    const updatedSoftwareAssignments = [...existingSoftwareAssignments, softwareAssignment];
    localStorage.setItem("softwareAssignments", JSON.stringify(updatedSoftwareAssignments));

    toast({
      title: "Software Assigned",
      description: `${softwareForm.softwareName} assigned to ${selectedUserForSoftware}`,
    });

    setSoftwareForm({ softwareName: "", version: "", licenseKey: "" });
    setSelectedUserForSoftware("");
    setShowSoftwareForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and assign work</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Assign Work Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-primary">Assign Work</CardTitle>
              <CardDescription>
                Create and assign new software to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignWork} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-select">Select User</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.email} value={user.email}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">software Title</Label>
                  <Input
                    id="title"
                    value={workForm.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="Enter task title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">software Description</Label>
                  <Textarea
                    id="description"
                    value={workForm.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date (Optional)</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={workForm.dueDate}
                    onChange={(e) => handleFormChange("dueDate", e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Assign Work
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Users Section */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-primary">Registered Users</CardTitle>
                <CardDescription>
                  View all registered users in the system
                </CardDescription>
              </div>
              <Button 
                onClick={() => setShowAddUserForm(true)}
                size="sm"
                variant="outline"
              >
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No registered users yet
                </p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.email}
                      className="p-4 border border-border rounded-lg bg-gradient-card"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Password: {user.password}</p>
                        </div>
                         <div className="flex gap-2 items-center">
                           <Badge variant="secondary">{user.role}</Badge>
                           {/* <Button
                             size="sm"
                             variant="outline"
                             onClick={() => {
                               setSelectedUserForSoftware(user.email);
                               setShowSoftwareForm(true);
                             }}
                           >
                             Assign Software
                           </Button> */}
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => editUser(user)}
                           >
                             Edit
                           </Button>
                           <Button
                             size="sm"
                             variant="destructive"
                             onClick={() => deleteUser(user.email)}
                           >
                             Delete
                           </Button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assignments Overview */}
        <Card className="shadow-card mt-6">
          <CardHeader>
            <CardTitle className="text-primary">All Assignments</CardTitle>
            <CardDescription>
              Overview of all assigned tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No assignments created yet
              </p>
            ) : (
              <div className="space-y-4">

                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 border border-border rounded-lg bg-gradient-card"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                      <Badge variant="outline">{assignment.status}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{assignment.description}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Assigned to: {assignment.assignedTo}</span>
                      <span>Due: {assignment.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add User Form Modal */}
        {showAddUserForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Create a new user account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Name</Label>
                    <Input
                      id="new-name"
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter user name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-role">Role</Label>
                    <Select 
                      value={newUserForm.role} 
                      onValueChange={(value) => setNewUserForm(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">Add User</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddUserForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Assign Software Form Modal */}
        {showSoftwareForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Assign Software</CardTitle>
                <CardDescription>Assign software to user</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAssignSoftware} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Assigned to</Label>
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded">
                      {selectedUserForSoftware}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="software-name">Software Name</Label>
                    <Input
                      id="software-name"
                      value={softwareForm.softwareName}
                      onChange={(e) => setSoftwareForm(prev => ({ ...prev, softwareName: e.target.value }))}
                      placeholder="Enter software name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="software-version">Version (Optional)</Label>
                    <Input
                      id="software-version"
                      value={softwareForm.version}
                      onChange={(e) => setSoftwareForm(prev => ({ ...prev, version: e.target.value }))}
                      placeholder="Enter version"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-key">License Key (Optional)</Label>
                    <Input
                      id="license-key"
                      value={softwareForm.licenseKey}
                      onChange={(e) => setSoftwareForm(prev => ({ ...prev, licenseKey: e.target.value }))}
                      placeholder="Enter license key"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">Assign Software</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowSoftwareForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit User Form Modal */}
        {showEditForm && editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Edit User</CardTitle>
                <CardDescription>Update user information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEditUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      placeholder="Enter user name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-password">Password</Label>
                    <Input
                      id="edit-password"
                      value={editingUser.password}
                      onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">Update User</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowEditForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;