export interface GameState
{
    Start(): void;
    End(): void;
    Update(deltaT : number): void;
    ShouldEnd(): boolean;
}