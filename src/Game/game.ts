import { Scene } from "@babylonjs/core/scene";

export class Game 
{
    private scene : Scene;
    private canvas : HTMLCanvasElement;

    constructor(scene: Scene, canvas : HTMLCanvasElement) 
    {
        this.scene = scene;
        this.canvas = canvas;
    }

    async Start() : Promise<void> 
    {

    }

    Update(deltaT: number) : void
    {

    }
}