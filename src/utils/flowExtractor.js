export default function extractFlowData(flowData, version) 
{
    const defaultData = 
    {
        name: "",   
        description: "",
        slides: [],
        appearance:
        {
            bg_from: '#0f172a',
            bg_to: '#020617',
            hovered_option_from: '#ED8836',
            hovered_option_to: '#FB923C',
            option_from:'#ffffff',
            option_to:'#e2e2e2'
        },
        timing: { delay: 0 },
    };

    if (!flowData) return defaultData;

    if (version === 0.1 || version == null) 
    {
        return {
            name: flowData.name ?? defaultData.name,
            description: flowData.description ?? defaultData.description,
            slides: flowData.slides ?? defaultData.slides,
            appearance: {
                ...defaultData.appearance,
                ...(flowData.appearance ?? {})
            },
            timing: {
                ...defaultData.timing,
                ...(flowData.timing ?? {})
            }
        }
    }

    return defaultData;
}
