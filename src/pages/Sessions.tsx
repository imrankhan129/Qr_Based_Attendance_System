import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, Search, Plus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Sessions = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all sessions with attendance data
  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!sessionsData) return [];

      // Get total students count
      const { count: totalStudentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      const sessionsWithAttendance = await Promise.all(
        sessionsData.map(async (session) => {
          const { count: attendedCount } = await supabase
            .from('attendance')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id);

          const now = new Date();
          const expiryTime = session.expiry_time ? new Date(session.expiry_time) : null;
          
          let status = 'Upcoming';
          if (expiryTime) {
            if (expiryTime < now) {
              status = 'Completed';
              // Update is_active to false if expired
              if (session.is_active) {
                await supabase
                  .from('sessions')
                  .update({ is_active: false })
                  .eq('id', session.id);
              }
            } else if (session.is_active) {
              status = 'Active';
            }
          }

          const attended = attendedCount || 0;
          const total = totalStudentsCount || 0;
          const attendanceRate = total > 0 ? ((attended / total) * 100).toFixed(1) : "0.0";

          return {
            id: session.session_id,
            name: session.session_name,
            instructor: 'Teacher',
            date: session.created_at ? format(new Date(session.created_at), 'yyyy-MM-dd') : 'N/A',
            startTime: session.created_at ? format(new Date(session.created_at), 'HH:mm') : 'N/A',
            endTime: expiryTime ? format(expiryTime, 'HH:mm') : 'N/A',
            duration: `${session.duration} minutes`,
            location: session.description || 'N/A',
            totalStudents: total,
            attended: attended,
            status: status,
            attendanceRate: status === 'Upcoming' ? 'N/A' : `${attendanceRate}%`,
            dbId: session.id
          };
        })
      );

      return sessionsWithAttendance;
    },
    refetchInterval: 30000 // Refetch every 30 seconds to update status
  });

  // Calculate average attendance rate
  const avgAttendanceRate = sessions.length > 0
    ? sessions
        .filter(s => s.status !== 'Upcoming')
        .reduce((acc, s) => {
          const rate = parseFloat(s.attendanceRate);
          return acc + (isNaN(rate) ? 0 : rate);
        }, 0) / sessions.filter(s => s.status !== 'Upcoming').length
    : 0;

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
                <p className="text-2xl font-bold text-foreground">
                  {avgAttendanceRate > 0 ? `${avgAttendanceRate.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <Card className="bg-card shadow-card border-0">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Loading sessions...</p>
          </CardContent>
        </Card>
      ) : filteredSessions.length === 0 ? (
        <Card className="bg-card shadow-card border-0">
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Create your first session to get started"}
            </p>
            {!searchTerm && (
              <Button asChild variant="gradient">
                <Link to="/generate">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  );
};

export default Sessions;