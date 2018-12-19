import "./style.scss";
import { Game } from "./Game";

const game = new Game();

if (module.hot) {
  module.hot.accept(function() {
    document.location.reload();
  });
}
