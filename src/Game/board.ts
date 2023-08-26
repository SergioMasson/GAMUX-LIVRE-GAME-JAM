import * as BABYLON from "@babylonjs/core/";
import { Entity } from "./entity";

const CELL_WIDTH = 0.5;
const CELL_HEIGHT = 0.05;
const CELL_DEPTH = 0.5;

export class Board
{
    private entities: Array<Entity>;
    private cells: Array<BABYLON.Mesh>
    private width : number;
    private height : number;

    //TO DO: Add logic for creating the cells
    constructor(scene: BABYLON.Scene, width: number, height: number)
    {
        let left = -((width >> 1) * CELL_WIDTH);
        let top = -((height >> 1) * CELL_DEPTH);

        for (let x = 0; x < width; x++) 
        {
            for (let y = 0; y < height; y++) 
            {
                const cell = BABYLON.MeshBuilder.CreateBox("box", 
                { 
                    width: CELL_WIDTH, 
                    height: CELL_HEIGHT,
                    depth: CELL_DEPTH
                    }, scene);
                
                cell.position = new BABYLON.Vector3(left + x * CELL_WIDTH, 0, top + y * CELL_DEPTH);

                const cellMaterial = new BABYLON.StandardMaterial("");
                cell.material = cellMaterial;

                cellMaterial.diffuseColor = (x & 1) ^ (y & 1) ? BABYLON.Color3.Red() : BABYLON.Color3.Green();
            }
        }

        this.entities = new Array<Entity>(width * height);
        this.width = width;
        this.height = height;
    }

    SelectCell(width: number, height: number) : void
    {
        
    }

    GetCellCenterPosition(x: number, z: number) : BABYLON.Vector3
    {
        const sceneX = (x * CELL_WIDTH) - (CELL_WIDTH * this.width / 2);
        const sceneZ = (z * CELL_DEPTH) - (CELL_DEPTH * this.height / 2);

        return new BABYLON.Vector3(sceneX, 0, sceneZ);
    }

    GetEntityAtCell(x: number, z: number) : Entity | null
    {
        return this.entities[x + (this.width * z)];
    }

    SetEntityToCell(entity: Entity, x: number, z: number) : void
    {
        this.entities[x + (this.width * z)] = entity;
    }
}