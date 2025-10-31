import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, UserPlus, Mail, Phone, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all students
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (!studentsData) return [];

      // Fetch attendance data for each student
      const studentsWithAttendance = await Promise.all(
        studentsData.map(async (student) => {
          const { data: attendanceData, count: attendedCount } = await supabase
            .from('attendance')
            .select('*', { count: 'exact' })
            .eq('student_id', student.id);

          const { count: totalSessions } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true });

          const attended = attendedCount || 0;
          const total = totalSessions || 0;
          const attendanceRate = total > 0 ? ((attended / total) * 100).toFixed(1) : "0.0";

          return {
            id: student.student_id,
            name: student.full_name,
            email: student.email || 'N/A',
            phone: student.phone || 'N/A',
            enrollmentDate: student.created_at || new Date().toISOString(),
            major: student.department || 'N/A',
            year: student.year || 'N/A',
            totalSessions: total,
            attended: attended,
            attendanceRate: `${attendanceRate}%`,
            status: attended > 0 ? 'Active' : 'Inactive',
            avatar: '/placeholder.svg',
            dbId: student.id
          };
        })
      );

      return studentsWithAttendance;
    }
  });

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
      {isLoading ? (
        <Card className="bg-card shadow-card border-0">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Loading students...</p>
          </CardContent>
        </Card>
      ) : (
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
      )}

      {!isLoading && filteredStudents.length === 0 && (
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