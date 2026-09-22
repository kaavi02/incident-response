export interface ParsedIncident {
  description: string;
  otherInfo: string | null;
  logFile: {
    name: string;
    content: string;
  } | null;
}

export function parseIncidentDescription(rawDescription: string): ParsedIncident {
  if (!rawDescription) {
    return {
      description: "",
      otherInfo: null,
      logFile: null,
    };
  }

  let mainDescription = rawDescription;
  let otherInfo: string | null = null;
  let logFile: { name: string; content: string } | null = null;

  // Check for attached log file pattern
  const logMatch = mainDescription.match(/\n\n--- ATTACHED LOG FILE: (.*?) ---\n([\s\S]*)$/);
  if (logMatch) {
    logFile = {
      name: logMatch[1]?.trim() || "system.log",
      content: logMatch[2] || "",
    };
    mainDescription = mainDescription.substring(0, logMatch.index);
  }

  // Check for other information pattern
  const otherInfoMatch = mainDescription.match(/\n\n--- OTHER INFORMATION ---\n([\s\S]*)$/);
  if (otherInfoMatch) {
    otherInfo = otherInfoMatch[1]?.trim() || null;
    mainDescription = mainDescription.substring(0, otherInfoMatch.index);
  }

  return {
    description: mainDescription.trim(),
    otherInfo,
    logFile,
  };
}

export function formatIncidentDescription(params: {
  description: string;
  otherInfo?: string;
  logFileName?: string;
  logContent?: string;
}): string {
  let formatted = params.description.trim();

  if (params.otherInfo && params.otherInfo.trim()) {
    formatted += `\n\n--- OTHER INFORMATION ---\n${params.otherInfo.trim()}`;
  }

  if (params.logContent && params.logContent.trim()) {
    const fileName = params.logFileName?.trim() || "incident.log";
    formatted += `\n\n--- ATTACHED LOG FILE: ${fileName} ---\n${params.logContent.trim()}`;
  }

  return formatted;
}
