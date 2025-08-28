class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      // Send Float32 PCM frames to main thread
      this.port.postMessage(input[0]);
    }
    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
