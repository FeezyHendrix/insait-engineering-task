import { clientDataHelper } from "@/utils/clientDataHelper"
import { ClientInfoType } from "@/types/clientInfo"


const ClientInfo = (clientCollectedInfo: ClientInfoType) => {
    if (!clientCollectedInfo) return
    const formattedData = (clientDataHelper(clientCollectedInfo.data))
    const generateParagraphs = (data: object | undefined) => {
        if (!data) return
        const paragraphs = [];
        for (const [key, value] of Object.entries(data)) {
            const lines = value.split('\n')
            const formattedLines = lines.map((line: string, index: number) => <span key={index}>{line}<br /></span>);
            paragraphs.push(
                <p key={key}>
                    <strong>{key}:</strong><br />
                    {formattedLines}
                    <br />
                </p>
            );
        }
        return paragraphs;
    };
    
    return (
        <div style={{ position: 'absolute', background: 'white', borderRadius: 10, padding: 5 }}>
            {generateParagraphs(formattedData)}
        </div>

    )
}

export default ClientInfo