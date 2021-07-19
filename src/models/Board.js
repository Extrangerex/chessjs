import { GameConst } from "../conf/Constants";
import { Tile } from "./Tile";

export class Board {
  constructor() {
    this.tiles = [];

    this.tiles.push([
      new Tile(GameConst.rook, GameConst.black),
      new Tile(GameConst.panter, GameConst.black),
      new Tile(GameConst.elephant, GameConst.black),
      new Tile(GameConst.queen, GameConst.black),
      new Tile(GameConst.king, GameConst.black),
      new Tile(GameConst.queen, GameConst.black),
      new Tile(GameConst.elephant, GameConst.black),
      new Tile(GameConst.panter, GameConst.black),
      new Tile(GameConst.rook, GameConst.black),
    ]);

    this.tiles.push([
      new Tile(GameConst.squirrel, GameConst.black),
      new Tile(GameConst.knight, GameConst.black),
      new Tile(GameConst.dog, GameConst.black),
      new Tile(GameConst.bishop, GameConst.black),
      new Tile(GameConst.lyon, GameConst.black),
      new Tile(GameConst.bishop, GameConst.black),
      new Tile(GameConst.dog, GameConst.black),
      new Tile(GameConst.knight, GameConst.black),
      new Tile(GameConst.squirrel, GameConst.black),
    ]);

    this.tiles.push([
      new Tile(GameConst.bunny, GameConst.black),
      new Tile(GameConst.pawn, GameConst.black),
      new Tile(GameConst.pawn, GameConst.black),
      new Tile(GameConst.pawn, GameConst.black),
      new Tile(GameConst.bunny, GameConst.black),
      new Tile(GameConst.pawn, GameConst.black),
      new Tile(GameConst.pawn, GameConst.black),
      new Tile(GameConst.pawn, GameConst.black),
      new Tile(GameConst.bunny, GameConst.black),
    ]);

    for (let i = 0; i < 4; i++) {
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

    this.tiles.push([
      new Tile( GameConst.bunny, GameConst.white),
      new Tile(GameConst.pawn,  GameConst.white),
      new Tile(GameConst.pawn,  GameConst.white),
      new Tile(GameConst.pawn,  GameConst.white),
      new Tile(GameConst.bunny,  GameConst.white),
      new Tile(GameConst.pawn,  GameConst.white),
      new Tile(GameConst.pawn,  GameConst.white),
      new Tile(GameConst.pawn,  GameConst.white),
      new Tile(GameConst.bunny,  GameConst.white),
    ]);

    this.tiles.push([
      new Tile(GameConst.squirrel, GameConst.white),
      new Tile(GameConst.knight, GameConst.white),
      new Tile(GameConst.dog, GameConst.white),
      new Tile(GameConst.bishop, GameConst.white),
      new Tile(GameConst.lyon, GameConst.white),
      new Tile(GameConst.bishop, GameConst.white),
      new Tile(GameConst.dog, GameConst.white),
      new Tile(GameConst.knight, GameConst.white),
      new Tile(GameConst.squirrel, GameConst.white),
    ]);

    this.tiles.push([
      new Tile(GameConst.rook, GameConst.white),
      new Tile(GameConst.panter, GameConst.white),
      new Tile(GameConst.elephant, GameConst.white),
      new Tile(GameConst.queen, GameConst.white),
      new Tile(GameConst.king, GameConst.white),
      new Tile(GameConst.queen, GameConst.white),
      new Tile(GameConst.elephant, GameConst.white),
      new Tile(GameConst.panter, GameConst.white),
      new Tile(GameConst.rook, GameConst.white),
    ]);

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
