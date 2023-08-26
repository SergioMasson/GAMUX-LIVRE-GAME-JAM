import * as BABYLON from "@babylonjs/core";
import { Board } from "./board";
import { Entity } from "./entity";

export class Game 
{
    private scene : BABYLON.Scene;
    private canvas : HTMLCanvasElement;
    private board : Board;
    private mainCamera : BABYLON.FreeCamera;

    private playerMesh : BABYLON.AbstractMesh;
    private enemyMesh : BABYLON.AbstractMesh;

    private players : Array<Entity>;
    private enemies : Array<Entity>;

    constructor(scene: BABYLON.Scene, canvas : HTMLCanvasElement) 
    {
        this.scene = scene;
        this.canvas = canvas;
        this.board = new Board(scene, 8, 8);

        let camera = new BABYLON.ArcRotateCamera("mainCamera", Math.PI / 4, Math.PI / 3, 9, new BABYLON.Vector3(-1, 0, 0), scene);
        camera.attachControl(canvas);
        camera.upperRadiusLimit = 10;
        camera.lowerRadiusLimit = 3;

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        scene.onPointerDown = function castRay(){
            var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera, false);	

            var hit = scene.pickWithRay(ray);

            if (hit.pickedMesh){
                console.log(hit.pickedMesh.metadata);
                if (hit.pickedMesh.metadata.type === "cell") {
                    const cellMaterial = new BABYLON.StandardMaterial("");
                    cellMaterial.diffuseColor = BABYLON.Color3.Blue();
                    hit.pickedMesh.material = cellMaterial;
                }
            }
        }   

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
    }

    async Start() : Promise<void> 
    {
        this.playerMesh = await this.LoadEntity("player");
        this.enemyMesh = await this.LoadEntity("enemy");

        var player0 = new Entity(this.board, this.playerMesh as BABYLON.Mesh);
        player0.SetPosition(1, 0);

        var player1 = new Entity(this.board, this.playerMesh as BABYLON.Mesh);
        player1.SetPosition(2, 0);
    }

    async LoadEntity(entityName: string) : Promise<BABYLON.AbstractMesh>
    {
        const resultPlayer = await BABYLON.SceneLoader.ImportMeshAsync(null, "./models/", `${entityName}.glb`);
        const result = resultPlayer.meshes[0].getChildMeshes()[0];
        result.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
        const playerMaterial = new BABYLON.StandardMaterial("");
        result.material = playerMaterial;
        result.isVisible = false;

        playerMaterial.diffuseTexture = new BABYLON.Texture(`./textures/${entityName}.png`);
        return result;
    }


    Update(deltaT: number) : void
    {

    }
}