import { Board } from "../board";
import { GameState } from "./state";
import { Cursor } from "../cursor";
import * as BABYLON from "@babylonjs/core";

export class EntitySelectState implements GameState
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
        console.log("Starting  EntitySelectState");
        this.onClickObservable = this.scene.onPointerObservable.add((pointerInfo) => 
        {
            if(pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN)
            {
                if (this.cursor.getCursorOverEntity()) this.shouldEnd = true;
            }
        });

        this.shouldEnd = false;
    }

    End(): Array<Number> 
    {
        console.log("Ending  EntitySelectState");
        this.scene.onPointerObservable.remove(this.onClickObservable);
        this.cursor.fixCursor();
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