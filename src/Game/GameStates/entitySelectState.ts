import { GameState } from "./state";

export class EntitySelectState implements GameState
{
    Start(): void 
    {
        //throw new Error("Method not implemented.");
    }

    End(): void 
    {
        //throw new Error("Method not implemented.");
    }

    Update(deltaT : number): void 
    {
        //throw new Error("Method not implemented.");
    }

    ShouldEnd(): boolean 
    {
        return false;
        throw new Error("Method not implemented.");
    }
    
}