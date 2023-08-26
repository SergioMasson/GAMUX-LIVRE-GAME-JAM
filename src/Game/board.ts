import * as BABYLON from "@babylonjs/core/"

const CELL_WIDTH = 10;
const CELL_HEIGHT = 10;
const CELL_DEPTH = 1;


export class Board
{
    //TO DO: Add logic for creating the cells
    constructor(scene: BABYLON.Scene, width: number, height: number)
    {
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
            }
        }
    }

    SelectCell(width: number, height: number) : void
    {
        
    }

    GetCellObject(width: number, height: number) : BABYLON.Mesh
    {
        return null;
    }
}