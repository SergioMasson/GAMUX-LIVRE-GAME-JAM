import { Board } from "./board";
import * as BABYLON from "@babylonjs/core/";

// Base class for players and enemies. 
export class Entity 
{
    private mainBoard : Board;
    private instanceMesh: BABYLON.InstancedMesh;

    constructor(board : Board, rootMesh: BABYLON.Mesh) 
    {
        this.mainBoard = board;
        this.instanceMesh = rootMesh.createInstance("entity");
        this.instanceMesh.metadata = { type: "entity" };
    }

    public CanMove(x: number, z: number) : boolean
    {
        return true;
    }

    public SetPosition(x: number, z: number) : void
    {
        this.mainBoard.SetEntityToCell(this, x, z);
        const position = this.mainBoard.GetCellCenterPosition(x, z);

        //TO DO: Add logic to move using animation.
        this.instanceMesh.position = position;
    }
}