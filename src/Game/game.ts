import * as BABYLON from "@babylonjs/core";
import { Board } from "./board";
import { Entity } from "./entity";
import { Cursor } from "./cursor";
import { GameStateMachine } from "./GameStates/gameStateMachine";
import { EnvironmentCreator } from "./environmentCreator";

export class Game 
{
    private scene : BABYLON.Scene;
    private canvas : HTMLCanvasElement;
    private board : Board;
    private cursor : Cursor;
    private mainCamera : BABYLON.FreeCamera;

    private playerMesh : BABYLON.AbstractMesh;
    private enemyMesh: BABYLON.AbstractMesh;
    private pointerMesh: BABYLON.AbstractMesh;

    private players : Array<Entity>;
    private enemies : Array<Entity>;
    
    private mouseDown: boolean;

    private gameStateMachine: GameStateMachine;
    private environmentCreator: EnvironmentCreator;

    constructor(scene: BABYLON.Scene, canvas : HTMLCanvasElement) 
    {
        this.scene = scene;
        this.canvas = canvas;
        this.board = new Board(scene, 30, 30);
        this.environmentCreator = new EnvironmentCreator();

        let camera = new BABYLON.ArcRotateCamera("mainCamera", Math.PI / 4, Math.PI / 3, 9, new BABYLON.Vector3(-1, 0, 0), scene);
        camera.attachControl(canvas);
        camera.upperRadiusLimit = 10;
        camera.lowerRadiusLimit = 3;
        camera.upperBetaLimit = Math.PI / 3;
        camera.lowerBetaLimit = Math.PI / 6;


        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
    }

    async Start() : Promise<void> 
    {
        this.playerMesh = await this.LoadEntity("swordman");
        this.enemyMesh = await this.LoadEntity("enemy");
        this.pointerMesh = await this.LoadEntity("pointer");

        this.pointerMesh.isVisible = true;
        this.pointerMesh.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);

        var player0 = new Entity(this.board, this.playerMesh as BABYLON.Mesh);
        player0.SetPosition(1, 0);

        var player1 = new Entity(this.board, this.playerMesh as BABYLON.Mesh);
        player1.SetPosition(2, 0);

        this.cursor = new Cursor(this.board, this.scene, this.mainCamera, this.pointerMesh as BABYLON.Mesh);
        //this.scene.debugLayer.show();

        await this.environmentCreator.Populate(this.board, this.scene);

        this.gameStateMachine = new GameStateMachine(this.board, this.scene, this.mainCamera, this.cursor)
    }

    async LoadEntity(entityName: string) : Promise<BABYLON.AbstractMesh>
    {
        const resultPlayer = await BABYLON.SceneLoader.ImportMeshAsync(null, "./models/", `${entityName}.glb`);
        const result = resultPlayer.meshes[0].getChildMeshes()[0];
        result.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
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