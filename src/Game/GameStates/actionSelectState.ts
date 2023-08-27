import { GameState } from "./state";

export class ActionSelectState implements GameState
{
    constructor()
    {

    }

    Start(state: Array<Number>): void 
    {
    }

    End(): Array<Number> 
    {
        return [0];
    }

    Update(deltaT : number): void 
    {
        
    }

    ShouldEnd(): boolean 
    {
        return false;
    }

}