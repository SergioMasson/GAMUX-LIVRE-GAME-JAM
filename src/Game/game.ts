import * as BABYLON from "@babylonjs/core";
import { Board } from "./board";

export class Game 
{
    private scene : BABYLON.Scene;
    private canvas : HTMLCanvasElement;
    private board : Board;
    private mainCamera : BABYLON.Camera;

    constructor(scene: BABYLON.Scene, canvas : HTMLCanvasElement) 
    {
        this.scene = scene;
        this.canvas = canvas;
        this.board = new Board(scene, 8, 8);
        scene.createDefaultLight();
        this.mainCamera = new BABYLON.FreeCamera("mainCamera", new BABYLON.Vector3());
    }

    async Start() : Promise<void> 
    {
        
    }

    Update(deltaT: number) : void
    {

    }
}