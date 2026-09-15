import { format } from "date-fns";

export default function PrintableReport({ incident }: { incident: any }) {
  return (
    <div
      id="printable-report"
      className="absolute top-[-9999px] left-[-9999px] w-[800px] bg-white text-black p-10 font-sans"
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "white",
        color: "black",
      }}
    >
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Incident Post-Mortem Report
            </h1>
            <p className="text-gray-500 font-medium">Aegis Security Operations Center</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 font-mono">CONFIDENTIAL</div>
            <div className="text-sm text-gray-700 mt-1">
              Generated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{incident.title}</h2>
      </div>

      {/* Metadata Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <tbody>
            <tr>
              <td className="border border-gray-300 bg-gray-100 p-2 font-semibold w-1/4">Incident ID</td>
              <td className="border border-gray-300 p-2 font-mono">{incident.id}</td>
              <td className="border border-gray-300 bg-gray-100 p-2 font-semibold w-1/4">Reported At</td>
              <td className="border border-gray-300 p-2">
                {new Date(incident.createdAt).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 bg-gray-100 p-2 font-semibold">Priority</td>
              <td className="border border-gray-300 p-2 font-semibold text-red-700">{incident.priority}</td>
              <td className="border border-gray-300 bg-gray-100 p-2 font-semibold">Status</td>
              <td className="border border-gray-300 p-2 font-semibold text-blue-700">{incident.status}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 bg-gray-100 p-2 font-semibold">Reporter</td>
              <td className="border border-gray-300 p-2">{incident.reporter.name || incident.reporter.email}</td>
              <td className="border border-gray-300 bg-gray-100 p-2 font-semibold">Escalation Tier</td>
              <td className="border border-gray-300 p-2 font-bold">{incident.tier}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Network Telemetry */}
      {(incident.sourceIp || incident.destinationIp || incident.sourcePort || incident.destinationPort) && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3">
            Network Telemetry
          </h3>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <tbody>
              <tr>
                <td className="border border-gray-300 bg-gray-100 p-2 font-semibold w-1/4">Source IP</td>
                <td className="border border-gray-300 p-2 font-mono">{incident.sourceIp || "N/A"}</td>
                <td className="border border-gray-300 bg-gray-100 p-2 font-semibold w-1/4">Source Port</td>
                <td className="border border-gray-300 p-2 font-mono">{incident.sourcePort || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-100 p-2 font-semibold">Destination IP</td>
                <td className="border border-gray-300 p-2 font-mono">{incident.destinationIp || "N/A"}</td>
                <td className="border border-gray-300 bg-gray-100 p-2 font-semibold">Destination Port</td>
                <td className="border border-gray-300 p-2 font-mono">{incident.destinationPort || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Description */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3">
          1. Incident Description
        </h3>
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
          {incident.description}
        </p>
      </div>

      {/* Escalation Timeline */}
      {incident.escalations?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3">
            2. Escalation Timeline
          </h3>
          <ul className="list-disc pl-5 text-sm space-y-2">
            {incident.escalations.map((esc: any) => (
              <li key={esc.id} className="text-gray-800">
                <span className="font-semibold text-gray-900">
                  [{new Date(esc.createdAt).toLocaleString()}]
                </span>{" "}
                Escalated from {esc.previousTier} to {esc.newTier} by {esc.escalatedBy.name || esc.escalatedBy.email}.
                {esc.reason && <span className="italic block mt-1 text-gray-600">Reason: "{esc.reason}"</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Comment Log */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3">
          3. War Room Action Log
        </h3>
        {incident.comments?.length > 0 ? (
          <div className="space-y-4">
            {incident.comments.map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 border border-gray-200 p-3 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-900 text-sm">
                    {comment.author.name || comment.author.email}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic text-sm">No action logs recorded.</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        Aegis Incident Response & Reporting System • Page 1
      </div>
    </div>
  );
}
