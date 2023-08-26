import * as BABYLON from "@babylonjs/core/";
import { Entity } from "./entity";

const CELL_WIDTH = 0.5;
const CELL_HEIGHT = 0.05;
const CELL_DEPTH = 0.5;

const flashingPeriod = 0.5;

export class Board
{
    private entities: Array<Entity>;
    private cells: Array<BABYLON.Mesh>;
    private highlightedCells: Array<BABYLON.Mesh>;
    private width : number;
    private height: number;
    
    private colorAlpha: number;
    private timer: number;

    //TO DO: Add logic for creating the cells
    constructor(scene: BABYLON.Scene, width: number, height: number)
    {
        this.cells = new Array<BABYLON.Mesh>(0);
        let left = -((width >> 1) * CELL_WIDTH);
        let top = -((height >> 1) * CELL_DEPTH);

        for (let x = 0; x < width; x++) 
        {
            for (let z = 0; z < height; z++) 
            {
                const cell = BABYLON.MeshBuilder.CreateBox("box", 
                { 
                    width: CELL_WIDTH, 
                    height: CELL_HEIGHT,
                    depth: CELL_DEPTH
                    }, scene);
                
                cell.position = new BABYLON.Vector3(left + x * CELL_WIDTH, 0, top + z * CELL_DEPTH);
                cell.metadata = {type: "cell", x: x, z: z};

                const cellMaterial = new BABYLON.StandardMaterial("");
                cell.material = cellMaterial;

                cellMaterial.diffuseColor = (x & 1) ^ (z & 1) ? BABYLON.Color3.Red() : BABYLON.Color3.Green();

                this.cells.push(cell);
            }
        }

        this.entities = new Array<Entity>(width * height);
        this.highlightedCells = new Array<BABYLON.Mesh>(0);
        this.width = width;
        this.height = height;

        this.colorAlpha = 1;
        this.timer = 0;
    }

    update(deltaT: number): void {
        for (let k = 0; k < this.highlightedCells.length; k++) {
            let cell = this.highlightedCells[k];
            let material = cell.material as BABYLON.StandardMaterial;

            material.emissiveColor = new BABYLON.Color3(0.2 + this.colorAlpha / 2, 0.2 + this.colorAlpha / 2, 0.2 + this.colorAlpha / 2);
        }

        for (let t = 0; t < deltaT; t += 1000 / 60) {
            let halfPeriod = flashingPeriod * 60;
            if (this.timer < halfPeriod) this.colorAlpha = this.timer / halfPeriod;
            else this.colorAlpha = 1 - ((this.timer - halfPeriod) / halfPeriod);
    
            if (this.timer > 2 * halfPeriod) this.timer = 0;
            this.timer++;
        }
    }

    HighlightCells(x: number, z: number, range: number): void
    {
        for (let xp = -range; xp <= range; xp++) {
            for (let zp = -range; zp <= range; zp++) {
                if (xp === 0 && zp === 0) continue;
                let nomr1Dist = Math.abs(zp) + Math.abs(xp);

                if (nomr1Dist <= range) {
                    let celula = this.cells.find(function (e) {
                        if (e.metadata) {
                            if (e.metadata.type === "cell") {
                                if (e.metadata.x === x + xp && e.metadata.z === z + zp) {
                                    return true;
                                }
                                else return false;
                            }
                            else return false;
                        }
                        else return false;
                    });

                    if (celula) this.highlightedCells.push(celula);
                }
            }
        }
    }

    UnHighlightCells(): void {
        this.highlightedCells = [];
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