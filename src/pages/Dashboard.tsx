import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, QrCode, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch total students
  const { data: studentsCount = 0 } = useQuery({
    queryKey: ['students-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Fetch total sessions
  const { data: sessionsCount = 0 } = useQuery({
    queryKey: ['sessions-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Fetch active sessions
  const { data: activeSessions = 0 } = useQuery({
    queryKey: ['active-sessions'],
    queryFn: async () => {
      const { count } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      return count || 0;
    }
  });

  // Fetch attendance rate
  const { data: attendanceRate = 0 } = useQuery({
    queryKey: ['attendance-rate'],
    queryFn: async () => {
      const { count: totalAttendance } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true });
      
      const { count: totalSessions } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });

      if (!totalSessions || totalSessions === 0) return 0;
      return ((totalAttendance || 0) / (totalSessions * studentsCount)) * 100;
    }
  });

  // Fetch recent sessions with attendance
  const { data: recentSessions = [] } = useQuery({
    queryKey: ['recent-sessions'],
    queryFn: async () => {
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (!sessions) return [];

      const sessionsWithAttendance = await Promise.all(
        sessions.map(async (session) => {
          const { count } = await supabase
            .from('attendance')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id);

          const now = new Date();
          const expiryTime = session.expiry_time ? new Date(session.expiry_time) : null;
          
          let status = 'Upcoming';
          if (session.is_active && expiryTime && expiryTime > now) {
            status = 'Active';
          } else if (expiryTime && expiryTime < now) {
            status = 'Completed';
          }

          return {
            id: session.session_id,
            name: session.session_name,
            time: session.created_at ? new Date(session.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
            date: 'Today',
            status,
            attended: count || 0,
            total: studentsCount
          };
        })
      );

      return sessionsWithAttendance;
    }
  });

  // Fetch recent activity
  const { data: recentActivity = [] } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data: attendance } = await supabase
        .from('attendance')
        .select(`
          *,
          student:students(full_name),
          session:sessions(session_id)
        `)
        .order('scanned_at', { ascending: false })
        .limit(4);

      if (!attendance) return [];

      return attendance.map((record: any) => {
        const scannedAt = record.scanned_at ? new Date(record.scanned_at) : new Date();
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - scannedAt.getTime()) / 60000);
        
        return {
          student: record.student?.full_name || 'Unknown',
          action: 'Checked in',
          class: record.session?.session_id || 'N/A',
          time: diffMinutes < 60 ? `${diffMinutes} minutes ago` : `${Math.floor(diffMinutes / 60)} hours ago`,
          status: 'success'
        };
      });
    }
  });

  const stats = [
    {
      title: "Total Students",
      value: studentsCount.toString(),
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Sessions",
      value: activeSessions.toString(),
      change: `+${activeSessions}`,
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "QR Codes Generated",
      value: sessionsCount.toString(),
      change: `+${sessionsCount}`,
      icon: QrCode,
      color: "text-purple-600"
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate.toFixed(1)}%`,
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-emerald-600"
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
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your attendance overview.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="gradient">
            <Link to="/generate">Generate QR</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/scan">Scan QR</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-success">
                    {stat.change}
                  </span>{" "}
                  from last week
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <Card className="lg:col-span-2 bg-card shadow-card border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Today's Sessions</CardTitle>
                <CardDescription>Manage your scheduled classes and attendance</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/sessions">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-card border border-border">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{session.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {session.id} • {session.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {session.attended}/{session.total}
                      </p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild variant="gradient" className="w-full justify-start">
              <Link to="/generate">
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR Code
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/scan">
                <Clock className="h-4 w-4 mr-2" />
                Scan Attendance
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/students">
                <Users className="h-4 w-4 mr-2" />
                Manage Students
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/sessions">
                <CheckCircle className="h-4 w-4 mr-2" />
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <CardDescription>Latest attendance scans and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success' : 'bg-warning'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.student} {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.class}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;