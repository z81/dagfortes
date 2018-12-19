import {
  Character,
  Direction,
  CharStates,
  Controller,
  AudioPack
} from "../Engine";
import { playerSkins } from "./Skins";

export class Player {
  public readonly char: Character;
  public readonly width = 10;
  public readonly height = 5;
  private controller!: Controller;
  private controlKeys = {
    up: "KeyW",
    down: "KeyS",
    left: "KeyA",
    right: "KeyD"
  };
  private upKeys = new Set();
  private keyToDirection = {
    [this.controlKeys.down]: Direction.Down,
    [this.controlKeys.up]: Direction.Up,
    [this.controlKeys.right]: Direction.Right,
    [this.controlKeys.left]: Direction.Left
  };
  private audioEffects = new Map();

  constructor() {
    this.char = new Character({
      skin: playerSkins.default,
      speed: 15
    });
    this.char.setDirection(Direction.Right);
    this.initController();
  }

  private initController() {
    this.controller = new Controller();

    const controlKeys = Object.values(this.controlKeys);

    this.controller.onKey("down", (e: KeyboardEvent) => {
      if (controlKeys.indexOf(e.code) !== -1) {
        this.char.setState(CharStates.walk);
        this.char.setDirection(this.keyToDirection[e.code]);
        this.upKeys.add(e.code);
        this.playAudioEffect();
      }
    });

    this.controller.onKey("up", (e: KeyboardEvent) => {
      if (controlKeys.indexOf(e.code) !== -1) {
        this.upKeys.delete(e.code);
        this.char.setState(CharStates.Idle);

        this.upKeys.forEach(key => {
          this.char.setState(CharStates.walk);
          this.char.setDirection(this.keyToDirection[key]);
        });

        if (this.char.getState() !== CharStates.walk) {
          this.stopPlayAudioEffect();
        }
      }
    });
  }

  private playAudioEffect() {
    this.audioEffects.get("stepSand").play();
  }

  private stopPlayAudioEffect() {
    this.audioEffects.get("stepSand").stop();
  }

  public addAudioEffect = (name: string, value: AudioPack) => {
    this.audioEffects.set(name, value);
  };

  public loadSkin = async () => {
    await this.char.loadSkin();
  };
}
