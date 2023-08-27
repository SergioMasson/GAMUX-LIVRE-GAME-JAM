import { GameState } from "./state";
import { Board } from "../board";
import { Cursor } from "../cursor";
import * as BABYLON from "@babylonjs/core";

import { EntitySelectState } from "./PlayerStates/entitySelectState";
import { CellSelectState } from "./PlayerStates/cellSelectState";
import { EntityMoveState } from "./PlayerStates/entityMoveState";
import { ActionSelectState } from "./PlayerStates/actionSelectState";
import { ActionExecuteState } from "./PlayerStates/actionExecuteState";
import { CameraMoveToEntityState } from "./PlayerStates/cameraMoveToEntityState";
import { EnemySelectState } from "./EnemyStates/enemySelectState";

export class GameStateMachine 
{
    states: Array<GameState>;
    currentStateIndex: number;
    isEnemyTurn: Boolean;

    constructor(board: Board, scene: BABYLON.Scene, camera: BABYLON.Camera, cursor: Cursor)
    {
        this.states = new Array<GameState>();
        this.states.push(new EntitySelectState(scene, board, camera, cursor));
        this.states.push(new CameraMoveToEntityState(board, camera as BABYLON.ArcRotateCamera));
        this.states.push(new CellSelectState(scene, board, camera, cursor));
        this.states.push(new EntityMoveState(scene, board, camera, cursor));
        this.states.push(new ActionSelectState(scene, board, camera, cursor));
        this.states.push(new ActionExecuteState(scene, board, camera, cursor));

        this.states.push(new EnemySelectState(scene, board, camera, cursor));

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