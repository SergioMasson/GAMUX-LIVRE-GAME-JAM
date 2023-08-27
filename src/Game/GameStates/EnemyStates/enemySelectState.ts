import { Board } from "../../board";
import { GameState } from "./../state";
import { Cursor } from "../../cursor";
import * as BABYLON from "@babylonjs/core";

export class EnemySelectState implements GameState
{
    private scene: BABYLON.Scene;
    private onClickObservable: BABYLON.Observer<BABYLON.PointerInfo>;
    private shouldEnd: boolean;
    private board: Board;
    private camera: BABYLON.Camera;
    private cursor: Cursor;

    constructor(scene: BABYLON.Scene, board: Board, camera: BABYLON.Camera, cursor: Cursor) 
    {
        this.scene = scene;
        this.board = board;
        this.camera = camera;
        this.cursor = cursor;
    }

    Start(startSelect: Array<Number>): void
    {
			this.shouldEnd = false;
			
			console.log(this.board.FindEntitiesOfType("enemy"));
    }

    End(): Array<Number> 
    {
        return [this.cursor.getCursorOverPos().x, this.cursor.getCursorOverPos().y];
    }

    Update(deltaT : number): void 
    {
    }

    ShouldEnd(): boolean 
    {
        return this.shouldEnd;
    }   
}