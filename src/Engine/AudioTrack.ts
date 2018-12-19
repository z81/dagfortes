export class AudioTrack {
  private audio: HTMLAudioElement;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public load() {
    this.audio = new Audio(this.url);
    this.audio.load();

    return new Promise(resolve => this.audio.addEventListener('canplaythrough', resolve))
  }

  public play() {
    this.audio.play();
  }

  public stop() {
    this.audio.play();
  }

  public setVolume(value: number) {
    this.audio.volume = value / 100;
  }

  public get duration() {
    return this.audio.duration;
  }
}