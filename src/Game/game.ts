import * as BABYLON from "@babylonjs/core";
import { Board } from "./board";
import { Entity, LookDirection } from "./entity";
import { Cursor } from "./cursor";
import { GameStateMachine } from "./GameStates/gameStateMachine";
import { EnvironmentCreator } from "./environmentCreator";

export class Game 
{
    private scene : BABYLON.Scene;
    private canvas : HTMLCanvasElement;
    private board : Board;
    private cursor : Cursor;
    private mainCamera : BABYLON.ArcRotateCamera;
    private shieldMesh: BABYLON.AbstractMesh;

    private players : Array<Entity>;
    private enemies : Array<Entity>;
    
    private mouseDown: boolean;

    private gameStateMachine: GameStateMachine;
    private environmentCreator: EnvironmentCreator;

    private loadedAnims: Array<BABYLON.Animation>;

    constructor(scene: BABYLON.Scene, canvas : HTMLCanvasElement) 
    {
        this.scene = scene;
        this.canvas = canvas;
        this.board = new Board(scene, 30, 30);
        this.environmentCreator = new EnvironmentCreator();

        this.mainCamera = new BABYLON.ArcRotateCamera("mainCamera", Math.PI / 4, Math.PI / 3, 9, new BABYLON.Vector3(-1, 0, 0), scene);
        this.mainCamera.attachControl(canvas);
        this.mainCamera.upperRadiusLimit = 10;
        this.mainCamera.lowerRadiusLimit = 3;
        this.mainCamera.upperBetaLimit = Math.PI / 3;
        this.mainCamera.lowerBetaLimit = Math.PI / 6;

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        this.loadedAnims = [];
    }

    async Start() : Promise<void> 
    {
        const playerMesh = await this.LoadEntity("swordman", new BABYLON.Vector3(0.5, 0.5, 0.5));
        const druidGirl = await this.LoadEntity("druidGirl", new BABYLON.Vector3(0.5, 0.5, 0.5));
        const enemyMesh = await this.LoadEntity("enemy", new BABYLON.Vector3(0.3, 0.3, 0.3));
        const pointerMesh = await this.LoadEntity("pointer", new BABYLON.Vector3(0.7, 0.7, 0.7));
        this.shieldMesh = await this.LoadEntity("shield", new BABYLON.Vector3(0.3, 0.3, 0.3));

        pointerMesh.isVisible = true;

        var player0 = new Entity(this.board, playerMesh as BABYLON.Mesh, "player", 2, 1, this.shieldMesh as BABYLON.Mesh);
        player0.SetPosition(1, 0);

        var player1 = new Entity(this.board, druidGirl as BABYLON.Mesh, "player",  2, 1, this.shieldMesh as BABYLON.Mesh);
        player1.SetPosition(4, 0);

        const enemy0 = new Entity(this.board, enemyMesh as BABYLON.Mesh, "enemy",  4, 1, this.shieldMesh as BABYLON.Mesh);
        enemy0.SetPosition(7, 10);

        const enemy1 = new Entity(this.board, enemyMesh as BABYLON.Mesh, "enemy",  4, 1, this.shieldMesh as BABYLON.Mesh);
        enemy1.SetPosition(9, 12);

        const enemy2 = new Entity(this.board, enemyMesh as BABYLON.Mesh, "enemy",  4, 1, this.shieldMesh as BABYLON.Mesh);
        enemy2.SetPosition(7, 15);

        enemy0.SetLookDirection(LookDirection.X_PLUS);
        enemy1.SetLookDirection(LookDirection.X_PLUS);
        enemy2.SetLookDirection(LookDirection.X_PLUS);

        this.cursor = new Cursor(this.board, this.scene, this.mainCamera, pointerMesh as BABYLON.Mesh);

        await this.environmentCreator.Populate(this.board, this.scene);

        this.gameStateMachine = new GameStateMachine(this.board, this.scene, this.mainCamera, this.cursor);

        //let attackAnim = await BABYLON.Animation.ParseFromFileAsync(null, "https://doc.babylonjs.com/examples/animations.json");
        //this.loadedAnims.push(attackAnim);
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