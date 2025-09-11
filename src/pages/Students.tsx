import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, UserPlus, Mail, Phone, Calendar } from "lucide-react";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const students = [
    {
      id: "STU001",
      name: "John Doe",
      email: "john.doe@university.edu",
      phone: "+1 (555) 123-4567",
      enrollmentDate: "2023-09-01",
      major: "Computer Science",
      year: "Sophomore",
      totalSessions: 45,
      attended: 42,
      attendanceRate: "93.3%",
      status: "Active",
      avatar: "/placeholder.svg"
    },
    {
      id: "STU002",
      name: "Jane Smith",
      email: "jane.smith@university.edu",
      phone: "+1 (555) 234-5678",
      enrollmentDate: "2023-09-01",
      major: "Mathematics",
      year: "Junior",
      totalSessions: 52,
      attended: 50,
      attendanceRate: "96.2%",
      status: "Active",
      avatar: "/placeholder.svg"
    },
    {
      id: "STU003",
      name: "Mike Johnson",
      email: "mike.johnson@university.edu",
      phone: "+1 (555) 345-6789",
      enrollmentDate: "2023-09-01",
      major: "Physics",
      year: "Senior",
      totalSessions: 38,
      attended: 35,
      attendanceRate: "92.1%",
      status: "Active",
      avatar: "/placeholder.svg"
    },
    {
      id: "STU004",
      name: "Sarah Wilson",
      email: "sarah.wilson@university.edu",
      phone: "+1 (555) 456-7890",
      enrollmentDate: "2024-01-15",
      major: "Chemistry",
      year: "Freshman",
      totalSessions: 15,
      attended: 14,
      attendanceRate: "93.3%",
      status: "Active",
      avatar: "/placeholder.svg"
    },
    {
      id: "STU005",
      name: "David Brown",
      email: "david.brown@university.edu",
      phone: "+1 (555) 567-8901",
      enrollmentDate: "2022-09-01",
      major: "English Literature",
      year: "Senior",
      totalSessions: 67,
      attended: 60,
      attendanceRate: "89.6%",
      status: "Inactive",
      avatar: "/placeholder.svg"
    },
    {
      id: "STU006",
      name: "Emily Davis",
      email: "emily.davis@university.edu",
      phone: "+1 (555) 678-9012",
      enrollmentDate: "2023-09-01",
      major: "Biology",
      year: "Sophomore",
      totalSessions: 41,
      attended: 39,
      attendanceRate: "95.1%",
      status: "Active",
      avatar: "/placeholder.svg"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Inactive":
        return "bg-muted text-muted-foreground";
      case "Suspended":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getAttendanceColor = (rate: string) => {
    const percentage = parseFloat(rate);
    if (percentage >= 95) return "text-success";
    if (percentage >= 85) return "text-warning";
    return "text-destructive";
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage student records and attendance data</p>
        </div>
        <Button variant="gradient">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Search */}
        <Card className="lg:col-span-3 bg-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email, ID, or major..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="bg-card shadow-card border-0 hover:shadow-elegant transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{student.id}</p>
                </div>
                <Badge className={getStatusColor(student.status)}>
                  {student.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Major:</span>
                  <span className="font-medium">{student.major}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Year:</span>
                  <span className="font-medium">{student.year}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Attendance:</span>
                  <span className={`font-medium ${getAttendanceColor(student.attendanceRate)}`}>
                    {student.attendanceRate}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sessions:</span>
                  <span className="font-medium">{student.attended}/{student.totalSessions}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="bg-card shadow-card border-0">
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "No students have been added yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Students;