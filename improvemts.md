Suggestions for Future Improvements
To further improve the "Go Live" experience, consider the following:

1. WebSockets or Server-Sent Events (SSE)
Why: Polling (even every 3 seconds) is not instant and adds unnecessary load to the server. Recommendation: Implement a WebSocket connection or SSE endpoint. The server can push a message immediately when encoding is finished, allowing the UI to update instantly.

2. Detailed Encoding Status
Why: "Processing..." is vague. Recommendation: If the backend can provide progress (e.g., "Encoding: 50%"), we can show a progress bar. This requires the API to return status details.

3. Stream Health Monitoring
Why: Broadcasters need to know if their stream is stable. Recommendation: Add an endpoint (or use WebSockets) to push RTMP statistics (bitrate, FPS, dropped frames) to the client so the user can adjust their OBS settings if needed.

4. Error Handling for Encoding Failures
Why: Encoding might fail. Recommendation: Ensure the API returns a specific status for "failed" so the UI can show an error message instead of polling indefinitely.