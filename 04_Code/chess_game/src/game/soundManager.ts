/**
 * SoundManager: Generates 8-bit "Minecraft-style" sound effects using Web Audio API.
 * No external assets required.
 */
class SoundManager {
    private audioCtx: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() {
        // Initialize on first user interaction if needed
    }

    private getContext(): AudioContext | null {
        if (typeof window === 'undefined') return null;
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioCtx;
    }

    private playTone(freq: number, type: 'square' | 'sine' | 'sawtooth' | 'triangle', duration: number, volume: number = 0.1) {
        const ctx = this.getContext();
        if (!ctx || this.isMuted) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + duration);
    }

    private playNoise(duration: number, volume: number = 0.1) {
        const ctx = this.getContext();
        if (!ctx || this.isMuted) return;

        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const gainNode = ctx.createGain();

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        noise.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
    }

    public playMove() {
        // High "click" - like placing a block
        this.playTone(300, 'square', 0.1, 0.05);
    }

    public playCapture() {
        // "Break" sound
        this.playNoise(0.15, 0.1);
        this.playTone(100, 'sawtooth', 0.1, 0.05);
    }

    public playCheck() {
        // Warning beep
        this.playTone(800, 'sine', 0.1, 0.05);
        setTimeout(() => this.playTone(600, 'sine', 0.2, 0.05), 100);
    }

    public playCastle() {
        // Slide sound
        this.playTone(200, 'square', 0.1, 0.05);
        setTimeout(() => this.playTone(250, 'square', 0.1, 0.05), 150);
    }

    public playPromote() {
        // Level up jingle
        this.playTone(400, 'square', 0.1, 0.05);
        setTimeout(() => this.playTone(500, 'square', 0.1, 0.05), 100);
        setTimeout(() => this.playTone(600, 'square', 0.2, 0.05), 200);
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}

export const soundManager = new SoundManager();
