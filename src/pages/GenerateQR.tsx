import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const GenerateQR = () => {
  const [qrData, setQrData] = useState({
    sessionName: "",
    sessionId: "",
    duration: "60",
    description: "",
    expiryTime: ""
  });
  const [qrCode, setQrCode] = useState<string>("");
  const [existingSessionId, setExistingSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Check for existing active session when session ID changes
  useEffect(() => {
    const checkExistingSession = async () => {
      if (!qrData.sessionId || !user) return;

      const { data: existingSessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_id', qrData.sessionId)
        .eq('is_active', true)
        .single();

      if (existingSessions) {
        setExistingSessionId(existingSessions.id);
        setQrCode(existingSessions.qr_data);
        setQrData({
          sessionName: existingSessions.session_name,
          sessionId: existingSessions.session_id,
          duration: existingSessions.duration.toString(),
          description: existingSessions.description || "",
          expiryTime: existingSessions.expiry_time ? new Date(existingSessions.expiry_time).toISOString().slice(0, 16) : ""
        });
        toast({
          title: "Active Session Found",
          description: "Showing existing QR code for this session",
        });
      } else {
        setExistingSessionId(null);
        setQrCode("");
      }
    };

    const timeoutId = setTimeout(checkExistingSession, 500);
    return () => clearTimeout(timeoutId);
  }, [qrData.sessionId, user]);

  const generateQRCode = async () => {
    if (!qrData.sessionName || !qrData.sessionId || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in session name and ID",
        variant: "destructive"
      });
      return;
    }

    if (existingSessionId) {
      toast({
        title: "Session Already Exists",
        description: "This session is still active. Using existing QR code.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create a fixed timestamp for this session (no regeneration)
      const sessionCreationTime = Date.now();
      
      const qrPayload = JSON.stringify({
        type: "ATTENDANCE",
        sessionId: qrData.sessionId,
        sessionName: qrData.sessionName,
        duration: qrData.duration,
        createdAt: sessionCreationTime
      });

      const { error } = await supabase.from("sessions").insert({
        session_name: qrData.sessionName,
        session_id: qrData.sessionId,
        duration: parseInt(qrData.duration),
        description: qrData.description,
        expiry_time: qrData.expiryTime || null,
        qr_data: qrPayload,
        created_by: user.id,
      });

      if (error) throw error;

      setQrCode(qrPayload);
      toast({
        title: "QR Code Generated",
        description: "Session created. This QR code will remain the same until session completes.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCode);
    toast({
      title: "Copied!",
      description: "QR code data copied to clipboard",
    });
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1000;
    canvas.height = 1000;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 1000, 1000);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `qr-${qrData.sessionId}-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
          toast({
            title: "Download Complete",
            description: "QR code saved to your device",
          });
        }
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
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
              disabled={isGenerating || !!existingSessionId}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : existingSessionId ? (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Active Session (QR Locked)
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </>
              )}
            </Button>
            {existingSessionId && (
              <p className="text-xs text-muted-foreground text-center">
                This session is active. The QR code cannot be changed until the session is completed.
              </p>
            )}
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
                <div className="aspect-square bg-gradient-card rounded-lg flex items-center justify-center border-2 border-dashed border-border p-6">
                  <div className="text-center space-y-4" ref={qrRef}>
                    <div className="bg-white p-6 rounded-lg shadow-card inline-block">
                      <QRCodeSVG 
                        value={qrCode}
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Scan with any QR scanner</p>
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