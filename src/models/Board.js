import { GameConst } from "../config/Constants";
import { Tile } from "./Tile";

export class Board {
  constructor(payload) {
    if (payload !== undefined) {
      this.tiles = payload?.tiles;
    } else {
      this.tiles = [];

      this.tiles.push([
        new Tile(GameConst.rook, GameConst.black),
        new Tile(GameConst.king, GameConst.black),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
      ]);

      this.tiles.push([
        new Tile(GameConst.squirrel, GameConst.black),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.knight, GameConst.black),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.squirrel, GameConst.black),
      ]);

      this.tiles.push([
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.pawn, GameConst.black),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.pawn, GameConst.black),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.pawn, GameConst.black),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
      ]);

      
        this.tiles.push([
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.queen, GameConst.white),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.pawn, GameConst.black),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.bunny, GameConst.black),
        ]);
        this.tiles.push([
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.queen, GameConst.black),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.pawn, GameConst.black),
          new Tile(GameConst.empty, GameConst.empty),
        ]);
        this.tiles.push([
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.pawn, GameConst.black),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
        ]);
        this.tiles.push([
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.pawn, GameConst.white),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.empty, GameConst.empty),
          new Tile(GameConst.pawn, GameConst.white),
          new Tile(GameConst.pawn, GameConst.white),
          new Tile(GameConst.empty, GameConst.empty),
        ]);
      

      this.tiles.push([
        new Tile(GameConst.bunny, GameConst.white),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.bunny, GameConst.white),
      ]);

      this.tiles.push([
        new Tile(GameConst.squirrel, GameConst.white),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.rook, GameConst.white),
        new Tile(GameConst.king, GameConst.white),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.queen, GameConst.white),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.squirrel, GameConst.white),
      ]);

      this.tiles.push([
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
        new Tile(GameConst.empty, GameConst.empty),
      ]);
    }

    if (payload?.validMoves != null) {
      this.validMoves = payload?.validMoves;
    } else {
      this.validMoves = [];

      for (let i = 0; i < GameConst.boardHeight; i++) {
        this.validMoves.push([
          GameConst.invalid,
          GameConst.invalid,
          GameConst.invalid,
          GameConst.invalid,
          GameConst.invalid,
          GameConst.invalid,
          GameConst.invalid,
          GameConst.invalid,
          GameConst.invalid,
        ]);
      }
    }
  }

  resetValidMoves(callback) {
    for (let i = 0; i < GameConst.boardHeight; i++) {
      for (let j = 0; j < GameConst.boardWidth; j++) {
        this.validMoves[i][j] = GameConst.invalid;
      }
    }

    // callback();
  }
}
