interface ChatCompletionChunk {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choice[];
}

interface Choice {
    index: number;
    delta: { content?: string };
    finish_reason: string | null;
}

export function createDataStream(inputString: string, chunkSize: number): ChatCompletionChunk[] {
    const dataStream: ChatCompletionChunk[] = [];
    const modelId: string = "gpt-3.5-turbo-0613";
    const timestamp: number = Math.floor(Date.now() / 1000);

    for (let i = 0; i < inputString.length; i += chunkSize) {
        const chunk = inputString.slice(i, i + chunkSize);
        dataStream.push({
            id: `chatcmpl-${Math.random().toString(36).substr(2, 16)}`,
            object: "chat.completion.chunk",
            created: timestamp,
            model: modelId,
            choices: [{
                index: 0,
                delta: {
                    content: chunk
                },
                finish_reason: null
            }]
        });
    }

    // Adding a final object to signify the end of the stream
    dataStream.push({
        id: `chatcmpl-${Math.random().toString(36).substr(2, 16)}`,
        object: "chat.completion.chunk",
        created: timestamp,
        model: modelId,
        choices: [{
            index: 0,
            delta: {},
            finish_reason: "stop"
        }]
    });

    return dataStream;
}