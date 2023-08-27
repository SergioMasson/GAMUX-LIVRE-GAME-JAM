import { Board } from "../board";
import { GameState } from "./state";
import * as BABYLON from "@babylonjs/core";

export class CameraMoveToEntityState implements GameState
{
    private stateData: Array<Number>;
    private camera: BABYLON.ArcRotateCamera;
    private board: Board;
    private shouldEnd: boolean;

    constructor(board: Board, camera: BABYLON.ArcRotateCamera)
    {
        this.board = board;
        this.camera = camera;
        this.shouldEnd = false;
    }

    Start(state: Array<Number>): void 
    {
        this.stateData = state;
        const x = state[0] as number;
        const z = state[1] as number;
        const worldPosition = this.board.GetWorldFromBoardSpace(x, z);
        this.camera.setTarget(worldPosition);
        this.shouldEnd = true;
    }

    End(): Array<Number> 
    {
        return this.stateData;
    }

    Update(deltaT : number): void 
    {
        
    }

    ShouldEnd(): boolean 
    {
        return this.shouldEnd;
    }

}