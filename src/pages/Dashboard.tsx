import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, QrCode, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Students",
      value: "1,248",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Sessions",
      value: "24",
      change: "+3",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "QR Codes Generated",
      value: "3,847",
      change: "+156",
      icon: QrCode,
      color: "text-purple-600"
    },
    {
      title: "Attendance Rate",
      value: "94.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-emerald-600"
    }
  ];

  const recentSessions = [
    {
      id: "CS-101",
      name: "Computer Science Fundamentals",
      time: "09:00 AM",
      date: "Today",
      status: "Active",
      attended: 45,
      total: 50
    },
    {
      id: "MATH-201",
      name: "Advanced Mathematics",
      time: "11:00 AM",
      date: "Today",
      status: "Completed",
      attended: 38,
      total: 42
    },
    {
      id: "PHY-151",
      name: "Physics Laboratory",
      time: "02:00 PM",
      date: "Today",
      status: "Upcoming",
      attended: 0,
      total: 35
    },
    {
      id: "ENG-101",
      name: "English Literature",
      time: "04:00 PM",
      date: "Today",
      status: "Upcoming",
      attended: 0,
      total: 28
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
            {[
              { student: "John Doe", action: "Checked in", class: "CS-101", time: "2 minutes ago", status: "success" },
              { student: "Jane Smith", action: "Checked in", class: "MATH-201", time: "5 minutes ago", status: "success" },
              { student: "Mike Johnson", action: "Late check-in", class: "CS-101", time: "8 minutes ago", status: "warning" },
              { student: "Sarah Wilson", action: "Checked in", class: "PHY-151", time: "12 minutes ago", status: "success" },
            ].map((activity, index) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;