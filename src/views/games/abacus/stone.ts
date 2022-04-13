import { Image } from "@svgdotjs/svg.js";
import { Drawable } from "./interfaces";
import { ABACUS_STONE_WIDTH, ABACUS_STONE_HEIGHT } from "./constants";

import stoneSkin from "@@/img/abacus/stone_yellow.svg";

export class AbacusStone extends Image implements Drawable {
  public isActive = false;
  public isHigh = false;
  public slot = 0;

  public draw() {
    this.load(
      `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gR2VuZXJhdG9yOiBHcmF2aXQuaW8gLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgc3R5bGU9Imlzb2xhdGlvbjppc29sYXRlIiB2aWV3Qm94PSIwIDAgNzIgMzgiIHdpZHRoPSI3MnB0IiBoZWlnaHQ9IjM4cHQiPjxkZWZzPjxjbGlwUGF0aCBpZD0iX2NsaXBQYXRoX2YxU0dYamRjTmhtcDNWSmVuWkd3d0tFaUVqQWhFOERaIj48cmVjdCB3aWR0aD0iNzIiIGhlaWdodD0iMzgiLz48L2NsaXBQYXRoPjwvZGVmcz48ZyBjbGlwLXBhdGg9InVybCgjX2NsaXBQYXRoX2YxU0dYamRjTmhtcDNWSmVuWkd3d0tFaUVqQWhFOERaKSI+PGc+PGc+PHBhdGggZD0iIE0gNTIuMjczIC0wLjE1OCBDIDU5Ljg3MyAtMC4zNzggNjYuNTMzIDQuMDAyIDY5LjYwMyAxMC40NTIgQyA3MC42NzMgMTIuNzIyIDcxLjMxMyAxNS4yNDIgNzEuMzgzIDE3LjkxMiBDIDcxLjczMyAzMC4zMDIgNzEuNzMzIDMwLjMwMiA3MS4zODMgMTcuOTEyIEMgNzEuNjczIDI4LjE4MiA2My41ODMgMzYuNzQyIDUzLjMxMyAzNy4wMzIgQyA0Mi43NjMgMzcuMzIyIDI5LjcwMyAzNy42OTIgMTkuMTQzIDM3Ljk5MiBDIDguODczIDM4LjI4MiAwLjMxMyAzMC4xOTIgMC4wMzMgMTkuOTIyIEMgLTAuMDc3IDE2LjIwMiAwLjEzMyAyMy42MzIgMC4wMzMgMTkuOTIyIEMgLTAuMjU3IDkuNjUyIDcuODMzIDEuMDkyIDE4LjEwMyAwLjgwMiBDIDUuNzAzIDEuMTUyIDE3LjA5MyAwLjgzMiA1Mi4yNzMgLTAuMTU4IFogIiBmaWxsPSJyZ2IoMjQ0LDEyNCwzOSkiLz48L2c+PGc+PHBhdGggZD0iIE0gNDkuNzQzIDAuMzEyIEMgNTcuMDUzIDAuMzEyIDYzLjMyMyA0LjcxMiA2NS45NTMgMTAuOTYyIEMgNjYuODAzIDEyLjk5MiA2Ny4yNzMgMTUuMjIyIDY3LjI3MyAxNy41NTIgQyA2Ny4yNzMgMjEuMDAyIDY3LjI3MyAyOS4wNTIgNjcuMjczIDE3LjU5MiBDIDY3LjI3MyAyMS41ODIgNjUuODkzIDI1LjI1MiA2My41NjMgMjguMTcyIEMgNjAuMzYzIDMyLjIwMiA1NS4zNjMgMzQuNzkyIDQ5Ljc0MyAzNC43OTIgQyAxNi41OTMgMzQuNzkyIDUuNzYzIDM0Ljc5MiAxNy4yNTMgMzQuNzkyIEMgNy43MzMgMzQuNzkyIDAuMDEzIDI3LjA3MiAwLjAxMyAxNy41NTIgQyAwLjAxMyAxNC4xMDIgMC4wMTMgMjEuMDAyIDAuMDEzIDE3LjU1MiBDIDAuMDEzIDguMDMyIDcuNzMzIDAuMzEyIDE3LjI1MyAwLjMxMiBDIDIzLjc1MyAwLjMxMiAzOS44MDMgMC4zMTIgNDkuNzQzIDAuMzEyIFogIiBmaWxsPSJyZ2IoMjU1LDE5NCwyNSkiLz48L2c+PC9nPjwvZz48L3N2Zz4=`
    )

      .size(ABACUS_STONE_WIDTH, ABACUS_STONE_HEIGHT)
      .css("cursor", "pointer")
      .attr({ class: "is-highlightless" });
  }

  public activate(duration = 100) {
    if (!this.isActive) {
      this.animate(duration).dy(
        this.isHigh ? ABACUS_STONE_HEIGHT : -ABACUS_STONE_HEIGHT
      );
      this.isActive = true;
    }
  }

  public inactivate(duration = 100) {
    if (this.isActive) {
      this.animate(duration).dy(
        this.isHigh ? -ABACUS_STONE_HEIGHT : ABACUS_STONE_HEIGHT
      );
      this.isActive = false;
    }
  }
}
