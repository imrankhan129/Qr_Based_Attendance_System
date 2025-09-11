import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Scan, Camera, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ScanQR = () => {
  const [scanResult, setScanResult] = useState<any>(null);
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([
    {
      id: "ATTENDANCE_CS101_1730000001",
      code: "ATTENDANCE_CS101_1730000001",
      studentName: "John Doe",
      studentId: "STU001",
      sessionName: "Computer Science 101",
      sessionId: "CS-101",
      timestamp: "2024-01-15 09:15:30",
      status: "success"
    },
    {
      id: "ATTENDANCE_MATH201_1730000002",
      code: "ATTENDANCE_MATH201_1730000002",
      studentName: "Jane Smith", 
      studentId: "STU002",
      sessionName: "Advanced Mathematics",
      sessionId: "MATH-201",
      timestamp: "2024-01-15 11:05:45",
      status: "success"
    },
    {
      id: "ATTENDANCE_PHY151_1730000003",
      code: "ATTENDANCE_PHY151_1730000003",
      studentName: "Mike Johnson",
      studentId: "STU003", 
      sessionName: "Physics Laboratory",
      sessionId: "PHY-151",
      timestamp: "2024-01-15 14:20:12",
      status: "late"
    }
  ]);
  const { toast } = useToast();

  const simulateQRScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
    const mockResult = {
      id: `ATTENDANCE_CS101_${Date.now()}`,
      code: `ATTENDANCE_CS101_${Date.now()}`,
      sessionName: "Computer Science 101",
      sessionId: "CS-101",
      studentName: "Demo Student",
      studentId: "STU999",
      timestamp: new Date().toISOString(),
      status: "success"
    };
      
      setScanResult(mockResult);
      setIsScanning(false);
      
      // Add to history
      setScanHistory(prev => [mockResult, ...prev]);
      
      toast({
        title: "Attendance Recorded",
        description: "Successfully marked attendance for Demo Student",
        variant: "default"
      });
    }, 2000);
  };

  const processManualCode = () => {
    if (!manualCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid QR code",
        variant: "destructive"
      });
      return;
    }

    const mockResult = {
      id: manualCode,
      code: manualCode,
      sessionName: "Manual Entry Session",
      sessionId: "MANUAL-001",
      studentName: "Manual Student",
      studentId: "STU888",
      timestamp: new Date().toISOString(),
      status: "success"
    };

    setScanResult(mockResult);
    setScanHistory(prev => [mockResult, ...prev]);
    setManualCode("");
    
    toast({
      title: "Attendance Recorded",
      description: "Successfully processed manual entry",
      variant: "default"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "late":
        return <Clock className="h-4 w-4 text-warning" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success text-success-foreground";
      case "late":
        return "bg-warning text-warning-foreground";
      case "error":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">QR Code Scanner</h1>
        <p className="text-muted-foreground">Scan QR codes to mark attendance instantly</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <Card className="bg-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Scan className="h-5 w-5 text-primary" />
              <span>QR Scanner</span>
            </CardTitle>
            <CardDescription>Position QR code within the camera frame</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera View Simulation */}
            <div className="aspect-square bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
              {isScanning ? (
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 border-2 border-primary rounded-lg animate-pulse flex items-center justify-center">
                    <Camera className="h-12 w-12 text-primary animate-pulse" />
                  </div>
                  <p className="text-white">Scanning...</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <Camera className="h-16 w-16 text-gray-400" />
                  <p className="text-gray-400">Camera view will appear here</p>
                  <div className="w-48 h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">QR Code Target Area</span>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={simulateQRScan} 
              className="w-full" 
              variant="gradient"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Scan className="h-4 w-4 mr-2 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanning
                </>
              )}
            </Button>

            {/* Manual Entry */}
            <div className="border-t pt-4">
              <Label htmlFor="manualCode" className="text-sm font-medium">Manual QR Code Entry</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="manualCode"
                  placeholder="Enter QR code manually..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && processManualCode()}
                />
                <Button onClick={processManualCode} variant="outline">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan Result */}
        <Card className="bg-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Scan Result</CardTitle>
            <CardDescription>
              {scanResult ? "Latest scan information" : "Scan results will appear here"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scanResult ? (
              <div className="space-y-4">
                <div className="bg-gradient-card rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-foreground">Attendance Recorded</h3>
                    <Badge className={getStatusColor(scanResult.status)}>
                      {scanResult.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Student</p>
                      <p className="font-medium text-foreground">{scanResult.studentName}</p>
                      <p className="text-sm text-muted-foreground">ID: {scanResult.studentId}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Session</p>
                      <p className="font-medium text-foreground">{scanResult.sessionName}</p>
                      <p className="text-sm text-muted-foreground">ID: {scanResult.sessionId}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Timestamp</p>
                      <p className="font-medium text-foreground">
                        {new Date(scanResult.timestamp).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">QR Code</p>
                      <p className="font-mono text-xs text-foreground break-all bg-muted/30 p-2 rounded">
                        {scanResult.code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Scan className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No scan results yet</p>
                <p className="text-sm text-muted-foreground">Scan a QR code to see the results here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scan History */}
      <Card className="bg-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>History of attendance scans from today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scanHistory.map((scan, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-card border border-border">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(scan.status)}
                  <div>
                    <h4 className="font-semibold text-foreground">{scan.studentName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {scan.sessionName} • {scan.studentId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {new Date(scan.timestamp).toLocaleTimeString()}
                  </p>
                  <Badge className={getStatusColor(scan.status)} variant="outline">
                    {scan.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanQR;