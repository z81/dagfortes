import { AudioTrack, AudioPack } from "../../Engine";

export const stepSandAudio = new AudioPack();
stepSandAudio.setSources(
  "../audio/Fantozzi-SandL1.ogg",
  "../audio/Fantozzi-SandR1.ogg",
  "../audio/Fantozzi-SandL2.ogg",
  "../audio/Fantozzi-SandR2.ogg",
  "../audio/Fantozzi-SandL3.ogg",
  "../audio/Fantozzi-SandR3.ogg"
);

export const mainAudioTheme = new AudioTrack("../audio/TheLoomingBattle.OGG");
