import { GameState } from "./state";

export class CellSelectState implements GameState
{
    Start(): void 
    {
        console.log("Starting  CellSelectState");
    }

    End(): void 
    {
        console.log("Ending  CellSelectState");
    }

    Update(deltaT : number): void 
    {
    }

    ShouldEnd(): boolean 
    {
        return false;
    }
} 