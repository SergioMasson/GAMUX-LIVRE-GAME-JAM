import { GameState } from "./state";
import { EntitySelectState } from "./entitySelectState";
import { CellSelectState } from "./cellSelectState";
import { EntityMoveState } from "./entityMoveState";
import { ActionSelectState } from "./actionSelectState";
import { Board } from "../board";
import { Cursor } from "../cursor";
import * as BABYLON from "@babylonjs/core";

export class GameStateMachine 
{
    states: Array<GameState>;
    currentStateIndex: number;
    isEnemyTurn: Boolean;

    constructor(board: Board, scene: BABYLON.Scene, camera: BABYLON.Camera, cursor: Cursor)
    {
        this.states = new Array<GameState>();
        this.states.push(new EntitySelectState(scene, board, camera, cursor));
        this.states.push(new CellSelectState(scene, board, camera, cursor));
        this.states.push(new EntityMoveState(scene, board, camera, cursor));
        this.states.push(new ActionSelectState(scene, board, camera, cursor));
        this.currentStateIndex = 0;

        let currentState = this.GetCurrentState();
        currentState.Start([]);
    }

    Update(deltaT : number) : void
    {
        let currentState = this.GetCurrentState();

        if(currentState.ShouldEnd())
        {
            let selectData = currentState.End();
            currentState = this.MoveToNextState();
            currentState.Start(selectData);    
        }

        currentState.Update(deltaT);

    }

    GetCurrentState() : GameState
    {
        return this.states[this.currentStateIndex];
    }

    MoveToNextState() : GameState 
    {
        this.currentStateIndex++;
        this.currentStateIndex = this.currentStateIndex % this.states.length;
        return this.GetCurrentState();
    }
}