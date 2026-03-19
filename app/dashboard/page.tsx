"use client";

import * as React from "react";
import { useState } from "react";
import { Thermometer, Wind, Zap, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SensorReading = {
  temperature: string;
  humidity: string;
  vibration: string;
  timestamp: string;
  status: "normal" | "warning" | "critical";
  nodeId: string;
  notes: string;
};

type ValidationError = {
  temperature?: string;
  humidity?: string;
  vibration?: string;
  nodeId?: string;
};

export default function DataInputPage() {
  const [formData, setFormData] = useState<SensorReading>({
    temperature: "",
    humidity: "",
    vibration: "",
    timestamp: new Date().toISOString().slice(0, 16),
    status: "normal",
    nodeId: "ESP32-001",
    notes: "",
  });

  const [errors, setErrors] = useState<ValidationError>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [recentSubmissions, setRecentSubmissions] = useState<SensorReading[]>([]);

  // Auto-determine status based on sensor values
  const determineStatus = (temp: number, hum: number, vib: number): "normal" | "warning" | "critical" => {
    if (temp > 35 || hum > 80 || vib > 0.15) return "critical";
    if (temp > 30 || hum > 70 || vib > 0.08) return "warning";
    return "normal";
  };

  // Validation logic
  const validateForm = (): boolean => {
    const newErrors: ValidationError = {};

    // Temperature validation (realistic range: -20 to 50°C)
    const temp = parseFloat(formData.temperature);
    if (!formData.temperature) {
      newErrors.temperature = "Temperature is required";
    } else if (isNaN(temp) || temp < -20 || temp > 50) {
      newErrors.temperature = "Temperature must be between -20°C and 50°C";
    }

    // Humidity validation (0-100%)
    const hum = parseFloat(formData.humidity);
    if (!formData.humidity) {
      newErrors.humidity = "Humidity is required";
    } else if (isNaN(hum) || hum < 0 || hum > 100) {
      newErrors.humidity = "Humidity must be between 0% and 100%";
    }

    // Vibration validation (0-1g)
    const vib = parseFloat(formData.vibration);
    if (!formData.vibration) {
      newErrors.vibration = "Vibration is required";
    } else if (isNaN(vib) || vib < 0 || vib > 1) {
      newErrors.vibration = "Vibration must be between 0g and 1g";
    }

    // Node ID validation
    if (!formData.nodeId.trim()) {
      newErrors.nodeId = "Node ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    // Auto-calculate status
    const temp = parseFloat(formData.temperature);
    const hum = parseFloat(formData.humidity);
    const vib = parseFloat(formData.vibration);
    const calculatedStatus = determineStatus(temp, hum, vib);

    const submissionData = {
      ...formData,
      status: calculatedStatus,
    };

    // TODO: Replace with actual API call
    console.log("Submitting data:", submissionData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSubmitStatus("success");
    setRecentSubmissions([submissionData, ...recentSubmissions.slice(0, 4)]);

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        temperature: "",
        humidity: "",
        vibration: "",
        timestamp: new Date().toISOString().slice(0, 16),
        status: "normal",
        nodeId: formData.nodeId, // Keep the same node ID
        notes: "",
      });
      setSubmitStatus("idle");
      setErrors({});
    }, 2000);
  };

  // Handle input changes
  const handleChange = (field: keyof SensorReading, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationError]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Quick fill buttons for testing
  const quickFillNormal = () => {
    setFormData({
      ...formData,
      temperature: "27.5",
      humidity: "60.0",
      vibration: "0.03",
    });
  };

  const quickFillWarning = () => {
    setFormData({
      ...formData,
      temperature: "32.0",
      humidity: "72.0",
      vibration: "0.10",
    });
  };

  const quickFillCritical = () => {
    setFormData({
      ...formData,
      temperature: "38.0",
      humidity: "85.0",
      vibration: "0.20",
    });
  };

  return (
    <div className="flex flex-col gap-5 p-5 overflow-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Input</h1>
        <p className="text-base text-muted-foreground mt-1">
          Manually enter sensor readings from ESP32 nodes
        </p>
      </div>

      {/* Success/Error Message (without Alert component) */}
      {submitStatus === "success" && (
        <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="text-emerald-600 text-base">
            Reading submitted successfully! Data has been logged.
          </p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-600 text-base">
            Please fix the validation errors below before submitting.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main input form */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Sensor Reading Form</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Enter measurements from your ESP32 sensor node
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="font-mono text-[11px] tracking-widest text-blue-600 border-blue-500/30 bg-blue-500/5"
              >
                MANUAL INPUT
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Node ID and Timestamp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nodeId" className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                    Node ID
                  </Label>
                  <Input
                    id="nodeId"
                    value={formData.nodeId}
                    onChange={(e) => handleChange("nodeId", e.target.value)}
                    placeholder="ESP32-001"
                    className={`font-mono text-base ${errors.nodeId ? "border-red-500" : ""}`}
                  />
                  {errors.nodeId && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.nodeId}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timestamp" className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                    Timestamp
                  </Label>
                  <Input
                    id="timestamp"
                    type="datetime-local"
                    value={formData.timestamp}
                    onChange={(e) => handleChange("timestamp", e.target.value)}
                    className="font-mono text-base"
                  />
                </div>
              </div>

              {/* Sensor readings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Temperature */}
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-sm font-mono tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    Temperature
                  </Label>
                  <div className="relative">
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => handleChange("temperature", e.target.value)}
                      placeholder="28.4"
                      className={`font-mono text-base pr-12 ${errors.temperature ? "border-red-500" : ""}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                      °C
                    </span>
                  </div>
                  {errors.temperature && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.temperature}
                    </p>
                  )}
                </div>

                {/* Humidity */}
                <div className="space-y-2">
                  <Label htmlFor="humidity" className="text-sm font-mono tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                    <Wind className="h-4 w-4 text-sky-500" />
                    Humidity
                  </Label>
                  <div className="relative">
                    <Input
                      id="humidity"
                      type="number"
                      step="0.1"
                      value={formData.humidity}
                      onChange={(e) => handleChange("humidity", e.target.value)}
                      placeholder="62.1"
                      className={`font-mono text-base pr-10 ${errors.humidity ? "border-red-500" : ""}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                      %
                    </span>
                  </div>
                  {errors.humidity && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.humidity}
                    </p>
                  )}
                </div>

                {/* Vibration */}
                <div className="space-y-2">
                  <Label htmlFor="vibration" className="text-sm font-mono tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-violet-500" />
                    Vibration
                  </Label>
                  <div className="relative">
                    <Input
                      id="vibration"
                      type="number"
                      step="0.01"
                      value={formData.vibration}
                      onChange={(e) => handleChange("vibration", e.target.value)}
                      placeholder="0.03"
                      className={`font-mono text-base pr-10 ${errors.vibration ? "border-red-500" : ""}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                      g
                    </span>
                  </div>
                  {errors.vibration && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.vibration}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                  Notes (Optional)
                </Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Additional observations or context..."
                  className="font-mono text-base"
                />
              </div>

              {/* Quick fill buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <p className="text-sm text-muted-foreground font-mono tracking-wider w-full mb-1">
                  QUICK FILL:
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={quickFillNormal}
                  className="text-sm font-mono"
                >
                  Normal Values
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={quickFillWarning}
                  className="text-sm font-mono"
                >
                  Warning Values
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={quickFillCritical}
                  className="text-sm font-mono"
                >
                  Critical Values
                </Button>
              </div>

              {/* Submit button */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-base h-11"
                  disabled={submitStatus === "success"}
                >
                  <Save className="h-5 w-5 mr-2" />
                  Submit Reading
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Guidelines sidebar */}
        <div className="flex flex-col gap-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Input Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="font-mono font-semibold text-orange-500">Temperature</span>
                </div>
                <p className="text-muted-foreground ml-6">
                  Range: -20°C to 50°C
                  <br />
                  <span className="text-emerald-600">Normal: &lt; 30°C</span>
                  <br />
                  <span className="text-amber-600">Warning: 30-35°C</span>
                  <br />
                  <span className="text-red-600">Critical: &gt; 35°C</span>
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Wind className="h-4 w-4 text-sky-500" />
                  <span className="font-mono font-semibold text-sky-500">Humidity</span>
                </div>
                <p className="text-muted-foreground ml-6">
                  Range: 0% to 100%
                  <br />
                  <span className="text-emerald-600">Normal: &lt; 70%</span>
                  <br />
                  <span className="text-amber-600">Warning: 70-80%</span>
                  <br />
                  <span className="text-red-600">Critical: &gt; 80%</span>
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap className="h-4 w-4 text-violet-500" />
                  <span className="font-mono font-semibold text-violet-500">Vibration</span>
                </div>
                <p className="text-muted-foreground ml-6">
                  Range: 0g to 1g
                  <br />
                  <span className="text-emerald-600">Normal: &lt; 0.08g</span>
                  <br />
                  <span className="text-amber-600">Warning: 0.08-0.15g</span>
                  <br />
                  <span className="text-red-600">Critical: &gt; 0.15g</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent submissions */}
          {recentSubmissions.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent Submissions</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Last {recentSubmissions.length} entries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentSubmissions.map((submission, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-md bg-muted/30 border border-border/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">
                        {new Date(submission.timestamp).toLocaleTimeString()}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${
                          submission.status === "critical"
                            ? "border-red-500/30 bg-red-500/5 text-red-600"
                            : submission.status === "warning"
                            ? "border-amber-500/30 bg-amber-500/5 text-amber-600"
                            : "border-emerald-500/30 bg-emerald-500/5 text-emerald-600"
                        }`}
                      >
                        {submission.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                      <span className="text-orange-500">{submission.temperature}°C</span>
                      <span className="text-sky-500">{submission.humidity}%</span>
                      <span className="text-violet-500">{submission.vibration}g</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}