export default function extractFlowData(flowData, version) {
  // Default structure to ensure no undefined errors
  const defaultData = {
    slides: [],
    appearance: {},
    name: "",
    description: "",
    timing: { delay: 0 },
  };

  if (!flowData) return defaultData;

  // Handle versioning if schema changes in the future
  if (version === 0.1 || !version) {
    return {
      slides: flowData.slides || [],
      appearance: flowData.appearance || {},
      name: flowData.name || "",
      description: flowData.description || "",
      timing: flowData.timing || {},
    };
  }

  return defaultData;
}