import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  Eye, 
  Trash2, 
  AlertCircle, 
  Database,
  ArrowRight
} from 'lucide-react';
import { UploadedDataset, ProtocolType } from '../types/ids';

interface NetworkDataViewProps {
  datasets: UploadedDataset[];
  onUploadDataset: (dataset: UploadedDataset) => void;
  onDeleteDataset: (id: string) => void;
  onManualSubmit: (data: { sourceIp: string; destinationIp: string; protocol: ProtocolType }) => void;
  onViewDataset: (dataset: UploadedDataset) => void;
}

export const NetworkDataView: React.FC<NetworkDataViewProps> = ({
  datasets,
  onUploadDataset,
  onDeleteDataset,
  onManualSubmit,
  onViewDataset,
}) => {
  // Manual Entry Form State
  const [sourceIp, setSourceIp] = useState('');
  const [destinationIp, setDestinationIp] = useState('');
  const [protocol, setProtocol] = useState<ProtocolType>('TCP');
  const [manualSuccessMsg, setManualSuccessMsg] = useState('');

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceIp || !destinationIp) return;

    onManualSubmit({
      sourceIp: sourceIp.trim(),
      destinationIp: destinationIp.trim(),
      protocol
    });

    setManualSuccessMsg(`Network record for ${sourceIp} -> ${destinationIp} processed and logged!`);
    setTimeout(() => setManualSuccessMsg(''), 4000);
    setSourceIp('');
    setDestinationIp('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(100);

            // Create uploaded dataset object
            const newDataset: UploadedDataset = {
              id: `up-${Date.now()}`,
              fileName: selectedFile.name,
              size: `${Math.round(selectedFile.size / 1024) || 140} KB`,
              uploadedOn: new Date().toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }),
              rowCount: 1450,
              status: 'Ready',
              normalCount: 1320,
              intrusionCount: 130,
              rows: [
                { id: 1, sourceIp: '192.168.1.100', destinationIp: '10.0.0.15', protocol: 'TCP', service: 'http', flag: 'SF', result: 'Normal', confidence: 97.4 },
                { id: 2, sourceIp: '192.168.1.101', destinationIp: '10.0.0.2', protocol: 'TCP', service: 'ssh', flag: 'S0', result: 'Intrusion', confidence: 94.1 },
                { id: 3, sourceIp: '192.168.1.102', destinationIp: '10.0.0.8', protocol: 'UDP', service: 'dns', flag: 'SF', result: 'Normal', confidence: 98.8 },
                { id: 4, sourceIp: '192.168.1.103', destinationIp: '10.0.0.9', protocol: 'ICMP', service: 'echo', flag: 'REJ', result: 'Intrusion', confidence: 93.5 }
              ]
            };

            onUploadDataset(newDataset);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }, 300);
          return 95;
        }
        return prev + 25;
      });
    }, 200);
  };

  const loadSampleDataset = (name: string, size: string) => {
    const newDataset: UploadedDataset = {
      id: `up-${Date.now()}`,
      fileName: name,
      size: size,
      uploadedOn: new Date().toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      rowCount: 3200,
      status: 'Ready',
      normalCount: 2850,
      intrusionCount: 350,
      rows: [
        { id: 1, sourceIp: '192.168.1.55', destinationIp: '10.0.0.20', protocol: 'TCP', service: 'http', flag: 'SF', result: 'Normal', confidence: 98.2 },
        { id: 2, sourceIp: '192.168.1.72', destinationIp: '10.0.0.4', protocol: 'TCP', service: 'ssh', flag: 'RSTO', result: 'Intrusion', confidence: 95.6 },
        { id: 3, sourceIp: '192.168.1.14', destinationIp: '10.0.0.11', protocol: 'UDP', service: 'ntp', flag: 'SF', result: 'Normal', confidence: 99.0 },
        { id: 4, sourceIp: '192.168.1.80', destinationIp: '10.0.0.12', protocol: 'ICMP', service: 'eco_i', flag: 'S0', result: 'Intrusion', confidence: 92.4 }
      ]
    };
    onUploadDataset(newDataset);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Network Data
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest packet capture files or submit network traces for anomaly evaluation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadSampleDataset('cicids2017_eval.csv', '310 KB')}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
          >
            + Load CICIDS2017 Sample
          </button>
        </div>
      </div>

      {/* Top 2 Cards Grid matching Screenshot 3. Network Data Page */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Upload Network Data */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              Upload Network Data
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Upload PCAP capture or CSV telemetry logs (supports .csv, .pcap, .log)
            </p>

            {/* File input container styled as screenshot */}
            <div className="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50/50 mb-5 flex flex-col items-center justify-center text-center">
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                accept=".csv,.pcap,.log,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-xs transition-colors"
              >
                <span>Choose File</span>
              </label>
              <span className="text-xs text-slate-500 mt-2 truncate max-w-[280px]">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
              {selectedFile && (
                <span className="text-[11px] text-blue-600 mt-1 font-medium">
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              )}
            </div>

            {/* Upload Progress Bar if active */}
            {isUploading && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Parsing network vectors...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Upload Button matching Screenshot */}
          <button
            onClick={handleUploadClick}
            disabled={!selectedFile || isUploading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold text-white shadow-xs transition-all ${
              selectedFile && !isUploading
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-blue-500/20'
                : 'bg-blue-400 cursor-not-allowed'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {/* Card 2: Or Enter Manually */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <form onSubmit={handleManualSubmit} className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                Or Enter Manually
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Inject custom telemetry socket data directly into detection pipeline
              </p>

              {manualSuccessMsg && (
                <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{manualSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Source IP */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Source IP
                  </label>
                  <input
                    type="text"
                    required
                    value={sourceIp}
                    onChange={(e) => setSourceIp(e.target.value)}
                    placeholder="eg. 192.168.1.1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Destination IP */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination IP
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationIp}
                    onChange={(e) => setDestinationIp(e.target.value)}
                    placeholder="eg. 192.168.1.2"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Protocol Dropdown */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Protocol
                </label>
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value as ProtocolType)}
                  className="w-full sm:w-1/2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                  <option value="ICMP">ICMP</option>
                  <option value="HTTP">HTTP</option>
                  <option value="DNS">DNS</option>
                  <option value="SSH">SSH</option>
                </select>
              </div>
            </div>

            {/* Submit Button matching Screenshot */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs self-start cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Table: Recent Uploaded Data matching Screenshot */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Recent Uploaded Data
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Uploaded On</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              {datasets.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{item.fileName}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {item.size}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {item.uploadedOn}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center space-x-3">
                      <button
                        onClick={() => onViewDataset(item)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onDeleteDataset(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
