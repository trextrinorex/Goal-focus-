// Web Audio API pure synthesizer for ambient focus sounds and celebrations
class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentSourceNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentType: string = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playAmbient(type: 'rain' | 'whitenoise' | 'binaural' | 'drone' | 'silence', volume: number = 0.3) {
    this.stopAmbient();
    if (type === 'silence') {
      this.currentType = 'silence';
      return;
    }

    try {
      this.initContext();
      if (!this.ctx) return;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      if (type === 'whitenoise' || type === 'rain') {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Pink/Brownian noise filter for soft rainfall texture
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          } else {
            // Smooth white noise
            output[i] = (lastOut + (0.05 * white)) / 1.05;
            lastOut = output[i];
            output[i] *= 2.0;
          }
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Bandpass filter for gentle rain/whisper atmosphere
        const filter = this.ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(type === 'rain' ? 800 : 1200, this.ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(this.gainNode);
        whiteNoise.start();
        this.currentSourceNode = whiteNoise;
      } else if (type === 'binaural') {
        // Binaural alpha frequency (200Hz base + 10Hz alpha wave difference)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(216, this.ctx.currentTime);
        osc2.frequency.setValueAtTime(226, this.ctx.currentTime); // 10Hz Alpha beat

        const merger = this.ctx.createChannelMerger(2);
        osc1.connect(merger, 0, 0);
        osc2.connect(merger, 0, 1);
        merger.connect(this.gainNode);

        osc1.start();
        osc2.start();
        this.currentSourceNode = osc1;
      } else if (type === 'drone') {
        // Deep space focus drone
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, this.ctx.currentTime); // Deep A2 note

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(240, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(this.gainNode);
        osc.start();
        this.currentSourceNode = osc;
      }

      this.isPlaying = true;
      this.currentType = type;
    } catch (e) {
      console.warn('Could not initialize ambient audio:', e);
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stopAmbient() {
    if (this.currentSourceNode) {
      try {
        (this.currentSourceNode as any).stop?.();
        this.currentSourceNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.currentSourceNode = null;
    }
    this.isPlaying = false;
    this.currentType = 'none';
  }

  public playChime(success: boolean = true) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = success ? [523.25, 659.25, 783.99, 1046.5] : [440, 392]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.65);
      });
    } catch (e) {
      // Audio might be blocked
    }
  }

  public playTick() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // ignore
    }
  }
}

export const audioEngine = new AmbientAudioEngine();
