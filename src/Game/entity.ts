import { Board } from "./board";
import * as BABYLON from "@babylonjs/core/";

// Base class for players and enemies. 
export class Entity 
{
    private mainBoard : Board;
    private instanceMesh: BABYLON.InstancedMesh;

    constructor(board : Board) 
    {
        this.mainBoard = board;
    }

    public CanMove(x: number, z: number) : boolean
    {
        return true;
    }

    public Move(x: number, z: number) : void
    {
        this.mainBoard.SetEntityToCell(this, x, z);
        const position = this.mainBoard.GetCellCenterPosition(x, z);

        //TO DO: Add logic to move using animation.


        this.instanceMesh.position = position;
    }

    public InstantiateMesh(rootMesh: BABYLON.Mesh) : void {
        this.instanceMesh = rootMesh.createInstance("entity");
    }
}