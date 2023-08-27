import { Board } from "./board";
import * as BABYLON from "@babylonjs/core/";

export class EnvironmentCreator
{
    constructor()
    {

    }

    async Populate(board: Board, scene: BABYLON.Scene) : Promise<void>
    {
        const rock = await this.LoadEntity("stone");
        const grass = await this.LoadEntity("grass");
        const flower = await this.LoadEntity("flower");

        const zBounds = board.GetBoundsDepth();
        const xBounds = board.GetBoundsWidth();

        const maxX = xBounds.y;
        const minX = xBounds.x;
        const maxZ = zBounds.y;
        const minZ = zBounds.x;

        this.DistributeRandomMeshes(rock as BABYLON.Mesh, new BABYLON.Vector3(0.2, 0.2, 0.2) ,10, maxX, minX, maxZ,minZ);
        this.DistributeRandomMeshes(grass as BABYLON.Mesh, new BABYLON.Vector3(0.5, 0.5, 0.5), 50, maxX, minX, maxZ,minZ);
        this.DistributeRandomMeshes(flower as BABYLON.Mesh, new BABYLON.Vector3(0.3, 0.3, 0.3), 15, maxX, minX, maxZ,minZ);
    }

    DistributeRandomMeshes(mesh: BABYLON.Mesh, scaling: BABYLON.Vector3 ,count: number, maxX: number, minX: number, maxZ: number, minZ: number)
    {
        for (let index = 0; index < count; index++) 
        {
            const instance = mesh.createInstance(`${mesh.name}_instance${index}`);
            instance.isVisible = true;
            instance.isPickable = false;
            instance.scaling = scaling;
            const randomX = Math.random() * (maxX - minX) + minX;
            const randomZ = Math.random() * (maxZ - minZ) + minZ;
            instance.position = new BABYLON.Vector3(randomX, 0, randomZ);
        }
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
}