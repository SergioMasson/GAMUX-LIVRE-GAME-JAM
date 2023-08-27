import { GameState } from "./state";
import { Cursor } from "../cursor";
import { Board } from "../board";
import { Entity } from "../entity";
import * as BABYLON from "@babylonjs/core";

export class EntityMoveState implements GameState
{
    private board: Board;
    private scene: BABYLON.Scene;
    private cursor: Cursor;
    private shouldEnd: boolean;
    private movedEntity: Entity;

    constructor(scene: BABYLON.Scene, board: Board, camera: BABYLON.Camera, cursor: Cursor) {
        this.board = board;
        this.scene = scene;
        this.cursor = cursor;
    }

    Start(selectedCellPos: Array<number>): void 
    {
        let entity = this.board.GetEntityAtCell(selectedCellPos[0], selectedCellPos[1]);
        if (entity) {
            this.movedEntity = entity;
            entity.SetPosition(selectedCellPos[2], selectedCellPos[3]);
            this.cursor.unfixCursor();
            this.shouldEnd = true;
        }
        else this.shouldEnd = false;
    }

    End(): Array<Number> 
    {
        console.log("Ending entityMoveState");
        return [0];
    }

    Update(deltaT : number): void 
    {
    }

    ShouldEnd(): boolean 
    {
        return this.shouldEnd;
    }
    
} 