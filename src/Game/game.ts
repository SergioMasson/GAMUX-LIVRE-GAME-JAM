import * as BABYLON from "@babylonjs/core";
import { Board } from "./board";
import { Cursor } from "./cursor";
import { GameStateMachine } from "./GameStates/gameStateMachine";
import { GameLevel } from "./level";

export class Game 
{
    private scene : BABYLON.Scene;
    private board : Board;
    private cursor : Cursor;
    private mainCamera : BABYLON.ArcRotateCamera;
    private gameStateMachine: GameStateMachine;

    constructor(scene: BABYLON.Scene, canvas : HTMLCanvasElement) 
    {
        this.scene = scene;
        this.mainCamera = new BABYLON.ArcRotateCamera("mainCamera", Math.PI / 4, Math.PI / 3, 9, new BABYLON.Vector3(-1, 0, 0), scene);
        this.mainCamera.attachControl(canvas);
        this.mainCamera.upperRadiusLimit = 10;
        this.mainCamera.lowerRadiusLimit = 3;
        this.mainCamera.upperBetaLimit = Math.PI / 3;
        this.mainCamera.lowerBetaLimit = Math.PI / 6;

        this.scene.debugLayer.show();

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
    }

    async Start() : Promise<void> 
    {
        const pointerMesh = await this.LoadEntity("pointer", new BABYLON.Vector3(0.7, 0.7, 0.7));
        pointerMesh.isVisible = true;
        
        this.board = await GameLevel.LoadFromJSONAsync("level0", this.scene);
        this.cursor = new Cursor(this.board, this.scene, this.mainCamera, pointerMesh as BABYLON.Mesh);    
        this.gameStateMachine = new GameStateMachine(this.board, this.scene, this.mainCamera, this.cursor);
    }

    async LoadEntity(entityName: string, scaling: BABYLON.Vector3) : Promise<BABYLON.AbstractMesh>
    {
        const resultPlayer = await BABYLON.SceneLoader.ImportMeshAsync(null, "./models/", `${entityName}.glb`);
        const result = resultPlayer.meshes[0].getChildMeshes()[0];
        result.scaling = scaling;
        const playerMaterial = new BABYLON.StandardMaterial("");
        result.material = playerMaterial;
        result.isVisible = false;

        playerMaterial.diffuseTexture = new BABYLON.Texture(`./textures/player.png`);
        return result;
    }


    Update(deltaT: number) : void
    {
        this.cursor.Update();
        this.board.update(deltaT);
        this.gameStateMachine.Update(deltaT);
    }
}