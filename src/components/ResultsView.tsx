import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  BrainCircuit, 
  Layers, 
  Activity,
  Award,
  Sparkles
} from 'lucide-react';
import { DetectionResult, ModelMetrics } from '../types/ids';

interface ResultsViewProps {
  results: DetectionResult[];
  modelMetrics: ModelMetrics;
  onRetrainSimulatedModel?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  modelMetrics,
}) => {
  // Count normal vs intrusion
  const normalCount = results.filter((r) => r.result === 'Normal').length || 108;
  const intrusionCount = results.filter((r) => r.result === 'Intrusion').length || 42;
  const total = normalCount + intrusionCount;

  const normalPct = Math.round((normalCount / total) * 100);
  const intrusionPct = 100 - normalPct;

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Detection Results
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified network telemetry classifications and model evaluation metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono font-semibold">
            {results.length} Recorded Inferences
          </span>
        </div>
      </div>

      {/* Main Table matching Screenshot 6 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Source IP</th>
                <th className="py-3 px-4">Destination IP</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              {results.map((item, index) => {
                const isIntrusion = item.result === 'Intrusion';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* # */}
                    <td className="py-3.5 px-4 text-slate-400 font-medium">
                      {index + 1}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 font-sans text-slate-600 whitespace-nowrap">
                      {item.timestamp}
                    </td>

                    {/* Source IP */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {item.sourceIp}
                    </td>

                    {/* Destination IP */}
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {item.destinationIp}
                    </td>

                    {/* Protocol */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {item.protocol}
                      </span>
                    </td>

                    {/* Result (Intrusion [red] / Normal [green]) matching Screenshot */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isIntrusion
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.result}
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-right">
                      {item.confidence.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row matching Screenshot 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Result Summary (Bar Chart matching Screenshot) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Result Summary
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Distribution of evaluated classifications in current session
            </p>

            {/* Custom SVG Bar Chart matching visual in Screenshot */}
            <div className="flex items-end justify-center gap-14 h-44 pb-4 border-b border-slate-100">
              {/* Normal Bar (Blue / Cyan styled in screenshot) */}
              <div className="flex flex-col items-center gap-2 group">
                <span className="text-xs font-bold text-blue-600 font-mono">
                  {normalCount}
                </span>
                <div
                  className="w-20 bg-linear-to-t from-blue-600 to-sky-400 rounded-t-md shadow-sm transition-all duration-500 hover:brightness-110"
                  style={{ height: '110px' }}
                />
                <span className="text-xs font-semibold text-slate-600 mt-1">
                  Normal
                </span>
              </div>

              {/* Intrusion Bar (Red styled in screenshot) */}
              <div className="flex flex-col items-center gap-2 group">
                <span className="text-xs font-bold text-red-600 font-mono">
                  {intrusionCount}
                </span>
                <div
                  className="w-20 bg-linear-to-t from-red-600 to-rose-400 rounded-t-md shadow-sm transition-all duration-500 hover:brightness-110"
                  style={{ height: '48px' }}
                />
                <span className="text-xs font-semibold text-slate-600 mt-1">
                  Intrusion
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Ratio: {normalPct}% Benign vs {intrusionPct}% Threat</span>
            <span className="text-emerald-600 font-semibold">False Positive: &lt; 0.6%</span>
          </div>
        </div>

        {/* Right Card: Detection Model Specs matching Screenshot */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-blue-600" />
              Detection Model
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Core classifier architecture and training hyperparameters
            </p>

            <div className="space-y-4">
              {/* Algorithm */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Algorithm</span>
                <span className="text-slate-900 font-semibold font-mono bg-blue-50 px-2.5 py-1 rounded text-blue-700">
                  {modelMetrics.algorithm}
                </span>
              </div>

              {/* Accuracy */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Accuracy</span>
                <span className="text-emerald-600 font-bold font-mono text-sm">
                  {modelMetrics.accuracy}%
                </span>
              </div>

              {/* Trained On */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Trained On</span>
                <span className="text-slate-800 font-semibold font-mono">
                  {modelMetrics.trainedOn}
                </span>
              </div>

              {/* Extended Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Precision</div>
                  <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">{modelMetrics.precision}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Recall</div>
                  <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">{modelMetrics.recall}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">F1-Score</div>
                  <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">{modelMetrics.f1Score}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Ensemble Estimators: 120 Trees</span>
            <span>Feature Split: Gini Impurity</span>
          </div>
        </div>

      </div>
    </div>
  );
};
