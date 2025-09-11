import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GenerateQR = () => {
  const [qrData, setQrData] = useState({
    sessionName: "",
    sessionId: "",
    duration: "60",
    description: "",
    expiryTime: ""
  });
  const [qrCode, setQrCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async () => {
    if (!qrData.sessionName || !qrData.sessionId) {
      toast({
        title: "Missing Information",
        description: "Please fill in session name and ID",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate QR generation
    setTimeout(() => {
      const qrText = `ATTENDANCE_${qrData.sessionId}_${Date.now()}`;
      setQrCode(qrText);
      setIsGenerating(false);
      toast({
        title: "QR Code Generated",
        description: "Your QR code is ready for use",
        variant: "default"
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCode);
    toast({
      title: "Copied!",
      description: "QR code data copied to clipboard",
    });
  };

  const downloadQR = () => {
    // In a real app, this would generate and download an actual QR code image
    toast({
      title: "Download Started",
      description: "QR code image is being downloaded",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Generate QR Code</h1>
        <p className="text-muted-foreground">Create unique QR codes for your attendance sessions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="bg-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5 text-primary" />
              <span>Session Details</span>
            </CardTitle>
            <CardDescription>Configure your attendance session parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionName">Session Name *</Label>
              <Input
                id="sessionName"
                placeholder="e.g., Computer Science 101"
                value={qrData.sessionName}
                onChange={(e) => setQrData({ ...qrData, sessionName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionId">Session ID *</Label>
              <Input
                id="sessionId"
                placeholder="e.g., CS-101-2024-001"
                value={qrData.sessionId}
                onChange={(e) => setQrData({ ...qrData, sessionId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Session Duration</Label>
              <Select value={qrData.duration} onValueChange={(value) => setQrData({ ...qrData, duration: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryTime">Expiry Time</Label>
              <Input
                id="expiryTime"
                type="datetime-local"
                value={qrData.expiryTime}
                onChange={(e) => setQrData({ ...qrData, expiryTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Additional notes about this session..."
                value={qrData.description}
                onChange={(e) => setQrData({ ...qrData, description: e.target.value })}
                rows={3}
              />
            </div>

            <Button 
              onClick={generateQRCode} 
              className="w-full" 
              variant="gradient"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card className="bg-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
            <CardDescription>
              {qrCode ? "Your QR code is ready to use" : "Generate a QR code to see it here"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {qrCode ? (
              <>
                {/* QR Code Placeholder - In real app, this would be an actual QR code */}
                <div className="aspect-square bg-gradient-card rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center space-y-4">
                    <div className="w-48 h-48 bg-white rounded-lg shadow-card flex items-center justify-center mx-auto">
                      <div className="grid grid-cols-8 gap-1 p-4">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 ${
                              Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{qrCode}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={downloadQR} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={copyToClipboard} variant="outline" className="w-full">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2">Session Information:</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p><span className="font-medium">Name:</span> {qrData.sessionName}</p>
                      <p><span className="font-medium">ID:</span> {qrData.sessionId}</p>
                      <p><span className="font-medium">Duration:</span> {qrData.duration} minutes</p>
                      {qrData.expiryTime && (
                        <p><span className="font-medium">Expires:</span> {new Date(qrData.expiryTime).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center space-y-4">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">QR code will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Templates */}
      <Card className="bg-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>Use pre-configured session templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Morning Lecture", duration: "90", id: "LECTURE-AM" },
              { name: "Lab Session", duration: "180", id: "LAB-SESSION" },
              { name: "Tutorial", duration: "60", id: "TUTORIAL" }
            ].map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => setQrData({
                  ...qrData,
                  sessionName: template.name,
                  sessionId: `${template.id}-${Date.now()}`,
                  duration: template.duration
                })}
              >
                <div>
                  <div className="font-semibold">{template.name}</div>
                  <div className="text-sm text-muted-foreground">{template.duration} minutes</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateQR;