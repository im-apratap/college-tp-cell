import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, CheckCircle, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const ScannerPage = () => {
  const navigate = useNavigate();
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);

  // No need to load all students anymore: Server-side optimization

  const onScan = async (detectedCodes) => {
    if (paused || !detectedCodes || detectedCodes.length === 0) return;

    const scannedId = detectedCodes[0].rawValue;
    setPaused(true);
    setLoading(true);

    try {
      // 1. Server-side Lookup
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/students/${encodeURIComponent(scannedId)}`,
        { withCredentials: true },
      );

      const student = response.data.data;
      setScannedData(student);

      // 2. Mark Present if not already
      if (!student.isPresent) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/admin/verify/${student._id}`,
            { status: true },
            { withCredentials: true },
          );
          toast.success("Marked Present ✅");
          setScannedData((prev) => ({ ...prev, isPresent: true }));
        } catch (error) {
          console.error(error);
          toast.error("Failed to update attendance");
        }
      } else {
        toast.info("Already Present ℹ️");
        // Still show details even if already present
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(`Invalid QR Code: ${scannedId}`);
      } else {
        console.error(error);
        toast.error("Error scanning student");
      }
      setTimeout(() => setPaused(false), 2000); // Resume after 2s
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setScannedData(null);
    setPaused(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-gray-900 border-b border-gray-800 z-10">
        <button
          onClick={() => navigate("/admin")}
          className="p-2 -ml-2 text-gray-300 hover:text-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">QR Scanner</h1>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      {/* Camera Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-2" />
            <p className="text-gray-400">Verifying...</p>
          </div>
        )}

        {!scannedData && (
          <Scanner
            onScan={onScan}
            onError={(err) => console.error(err)}
            styles={{ container: { width: "100%", height: "100%" } }}
            components={{
              audio: false,
              torch: true,
              finder: true,
            }}
          />
        )}

        {/* Verification Overlay */}
        {scannedData && (
          <div className="absolute inset-0 bg-white text-gray-900 flex flex-col p-6 z-30 animate-in fade-in slide-in-from-bottom-10 duration-300">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {scannedData.fullName}
              </h2>
              <p className="text-gray-500 font-mono text-lg mb-6">
                {scannedData.uniqueId}
              </p>

              <div className="bg-gray-50 rounded-xl p-4 w-full border border-gray-200 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Branch</span>
                  <span className="font-medium">{scannedData.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Batch</span>
                  <span className="font-medium">{scannedData.batch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Registration</span>
                  <span className="font-medium">
                    {scannedData.registrationNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-2 mt-2">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                    PRESENT
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="primary"
                className="w-full py-4 text-lg shadow-lg shadow-blue-500/30"
                onClick={handleNext}
              >
                Scan Next Student
              </Button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="bottom-center" theme="dark" autoClose={2000} />
    </div>
  );
};

export default ScannerPage;
