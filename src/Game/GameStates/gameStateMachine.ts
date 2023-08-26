import { GameState } from "./state";
import { EntitySelectState } from "./entitySelectState";
import { CellSelectState } from "./cellSelectState";
import { EntityMoveState } from "./entityMoveState";
import { ActionSelectState } from "./actionSelectState";
import { Board } from "../board";
import * as BABYLON from "@babylonjs/core";

export class GameStateMachine 
{
    states: Array<GameState>;
    currentStateIndex: number;

    constructor(board: Board, scene: BABYLON.Scene, camera: BABYLON.Camera)
    {
        this.states = new Array<GameState>();
        this.states.push(new EntitySelectState(scene, board, camera));
        this.states.push(new CellSelectState());
        this.states.push(new EntityMoveState);
        this.states.push(new ActionSelectState);
        this.currentStateIndex = 0;

        let currentState = this.GetCurrentState();
        currentState.Start()
    }

    Update(deltaT : number) : void
    {
        let currentState = this.GetCurrentState();

        if(currentState.ShouldEnd())
        {
            currentState.End();
            currentState = this.MoveToNextState();
            currentState.Start();
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