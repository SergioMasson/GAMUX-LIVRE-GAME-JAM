import * as BABYLON from "@babylonjs/core";
import { Board } from "./board";

export class Game 
{
    private scene : BABYLON.Scene;
    private canvas : HTMLCanvasElement;
    private board : Board;
    private mainCamera : BABYLON.FreeCamera;

    constructor(scene: BABYLON.Scene, canvas : HTMLCanvasElement) 
    {
        this.scene = scene;
        this.canvas = canvas;
        this.board = new Board(scene, 8, 8);

        let camera = new BABYLON.ArcRotateCamera("mainCamera", Math.PI / 4, Math.PI / 3, 9, new BABYLON.Vector3(-1, 0, 0), scene);
        camera.attachControl(canvas);

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        let tabuleiro = new Board(this.scene, 5, 5);
    }

    async Start() : Promise<void> 
    {
    }

    Update(deltaT: number) : void
    {

    }
}