import { AudioTrack } from "./AudioTrack";

export class AudioPack {
  private sources: AudioTrack[] = [];
  private playingTrackIdx: number = -1;
  private isPlaying = false;

  public setSources(...sources: string[]) {
    this.sources = sources.map(url => new AudioTrack(url));
  }

  public async load() {
    await Promise.all(this.sources.map(audio => audio.load()));
  }

  public setVolume(volume: number) {
    this.sources.forEach(s => s.setVolume(volume));
  }

  public play = () => {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.playNext();
  };

  public stop = () => {
    this.isPlaying = false;
    this.playingTrackIdx = -1;
  };

  public playNext = () => {
    if (!this.isPlaying) return;

    if (this.playingTrackIdx >= this.sources.length - 1) {
      this.playingTrackIdx = 0;
    } else {
      this.playingTrackIdx++;
    }

    const audio = this.sources[this.playingTrackIdx];

    audio.play();
    setTimeout(this.playNext, audio.duration * 1000);
  };
}
