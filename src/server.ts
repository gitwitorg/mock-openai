import express, { Request, Response } from 'express';
import { Readable } from 'stream';
import path from 'path';
import { createDataStream } from './dataStream';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat/completions', (req: Request, res: Response) => {
  // Set the correct headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Example usage:
  const exampleString = "```javascript\nimport 'hi';\nprint('hello, friend!')\n```";
  const chunkSize = 3; // Define the size of each chunk.
  
  const dataStream = createDataStream(exampleString, chunkSize);

  // Create a readable stream
  const stream = new Readable({
    read() {}
  });

  // Push the structured data to the stream
  dataStream.forEach((data, index) => {
    setTimeout(() => {
      // Format the object to SSE format and push to the stream
      const sseFormattedData = `data: ${JSON.stringify(data)}\n\n`;
      stream.push(sseFormattedData);
      
      if (index === dataStream.length - 1) {
        stream.push(null); // Close the stream
      }
    }, 250 * index); // Simulate a delay between each chunk
  });

  // Pipe the stream to the response
  stream.pipe(res);
});

const port = 3002;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});