import { Board } from "./board";
import * as BABYLON from "@babylonjs/core/";

// Base class for players and enemies. 
export class Entity 
{
    private mainBoard : Board;
    private instanceMesh: BABYLON.InstancedMesh;
    private boardPosition: BABYLON.Vector2;
    private moveRange: number;
    private transformNode: BABYLON.TransformNode;
    private animationGroup: BABYLON.AnimationGroup;

    constructor(board : Board, rootMesh: BABYLON.Mesh) 
    {
        this.mainBoard = board;
        this.instanceMesh = rootMesh.createInstance("entity");
        this.instanceMesh.metadata = { type: "entity", x: 0, z: 0};
        this.moveRange = 4;

        this.transformNode = new BABYLON.TransformNode("CursorRoot");
        this.instanceMesh.setParent(this.transformNode, true);
    }

    public CanMove(x: number, z: number) : boolean
    {
        return true;
    }

    public getEntityBoardPos(): BABYLON.Vector2 {
        return this.boardPosition;
    }

    public SetPosition(x: number, z: number) : void
    {
        if(this.boardPosition) this.mainBoard.RemoveEntityFromCell(this.boardPosition.x, this.boardPosition.y);
        this.mainBoard.SetEntityToCell(this, x, z);
        const position = this.mainBoard.GetCellCenterPosition(x, z);

        this.transformNode.setAbsolutePosition(position);
        this.boardPosition = new BABYLON.Vector2(x, z);
        this.instanceMesh.metadata = { type: "entity", x: this.boardPosition.x, z: this.boardPosition.y};
    }

    public animatedMove(x: number, z: number): void {

    }

    public GetBoardPosition() :  BABYLON.Vector2
    {
        return this.boardPosition;
    }

    public GetRange() : number {
        return this.moveRange;
    }
}