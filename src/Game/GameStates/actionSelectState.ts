import { GameState } from "./state";

export class ActionSelectState implements GameState
{
    constructor()
    {

    }

    Start(): void 
    {
    }

    End(): void 
    {
        
    }

    Update(deltaT : number): void 
    {
        
    }

    ShouldEnd(): boolean 
    {
        return false;
    }

}