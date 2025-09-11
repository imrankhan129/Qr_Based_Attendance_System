import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, Search, Plus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const Sessions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const sessions = [
    {
      id: "CS-101-001",
      name: "Computer Science Fundamentals",
      instructor: "Dr. Smith",
      date: "2024-01-15",
      startTime: "09:00",
      endTime: "10:30",
      duration: "90 minutes",
      location: "Room A-101",
      totalStudents: 50,
      attended: 45,
      status: "Completed",
      attendanceRate: "90%"
    },
    {
      id: "MATH-201-002",
      name: "Advanced Mathematics",
      instructor: "Prof. Johnson",
      date: "2024-01-15",
      startTime: "11:00",
      endTime: "12:30",
      duration: "90 minutes",
      location: "Room B-203",
      totalStudents: 42,
      attended: 38,
      status: "Completed",
      attendanceRate: "90.5%"
    },
    {
      id: "PHY-151-003",
      name: "Physics Laboratory",
      instructor: "Dr. Wilson",
      date: "2024-01-15",
      startTime: "14:00",
      endTime: "17:00",
      duration: "3 hours",
      location: "Lab C-301",
      totalStudents: 35,
      attended: 32,
      status: "Active",
      attendanceRate: "91.4%"
    },
    {
      id: "ENG-101-004",
      name: "English Literature",
      instructor: "Ms. Brown",
      date: "2024-01-15",
      startTime: "16:00",
      endTime: "17:30",
      duration: "90 minutes",
      location: "Room D-105",
      totalStudents: 28,
      attended: 0,
      status: "Upcoming",
      attendanceRate: "N/A"
    },
    {
      id: "CHEM-201-005",
      name: "Organic Chemistry",
      instructor: "Dr. Davis",
      date: "2024-01-16",
      startTime: "10:00",
      endTime: "11:30",
      duration: "90 minutes",
      location: "Lab B-201",
      totalStudents: 32,
      attended: 0,
      status: "Scheduled",
      attendanceRate: "N/A"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Completed":
        return "bg-muted text-muted-foreground";
      case "Upcoming":
        return "bg-warning text-warning-foreground";
      case "Scheduled":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground">Manage your class sessions and attendance</p>
        </div>
        <Button asChild variant="gradient">
          <Link to="/generate">
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions by name, instructor, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold text-foreground">
                  {sessions.filter(s => s.status === "Active").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold text-foreground">
                  {sessions.filter(s => s.status === "Completed").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Attendance</p>
                <p className="text-2xl font-bold text-foreground">90.6%</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="bg-card shadow-card border-0 hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{session.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.id} • {session.instructor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium text-foreground">{session.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.startTime} - {session.endTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{session.location}</p>
                  <p className="text-sm text-muted-foreground">{session.duration}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="font-medium text-foreground">
                    {session.attended}/{session.totalStudents}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rate: {session.attendanceRate}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {session.status === "Active" && (
                    <Button asChild variant="gradient" size="sm">
                      <Link to="/scan">Scan QR</Link>
                    </Button>
                  )}
                  {session.status === "Upcoming" && (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/generate">Generate QR</Link>
                    </Button>
                  )}
                  {session.status === "Completed" && (
                    <Button variant="outline" size="sm">
                      View Report
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Sessions;