import { GameState } from "./state";
import { EntitySelectState } from "./entitySelectState";
import { CellSelectState } from "./cellSelectState";
import { EntityMoveState } from "./entityMoveState";
import { ActionSelectState } from "./actionSelectState";
import { Board } from "../board";

export class GameStateMachine 
{
    states: Array<GameState>;
    currentStateIndex: number;

    constructor(board: Board)
    {
        this.states = new Array<GameState>();
        this.states.push(new EntitySelectState());
        this.states.push(new CellSelectState());
        this.states.push(new EntityMoveState);
        this.states.push(new ActionSelectState);
        this.currentStateIndex = 0;
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