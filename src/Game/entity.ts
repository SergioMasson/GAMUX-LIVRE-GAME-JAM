import { Board } from "./board";
import * as BABYLON from "@babylonjs/core/";

export enum LookDirection
{
    Z_PLUS,
    Z_MINUS,
    X_PLUS,
    X_MINUS
}

// Base class for players and enemies. 
export class Entity 
{
    private mainBoard : Board;
    private instanceMesh: BABYLON.InstancedMesh;
    private boardPosition: BABYLON.Vector2;
    private moveRange: number;
    private attackRange: number;
    private startHealth: number;
    private health: number;
    private transformNode: BABYLON.TransformNode;
    private animationGroup: BABYLON.AnimationGroup;
    private type: string;

    constructor(board : Board, rootMesh: BABYLON.Mesh, type: string, maxHealth: number) 
    {
        this.mainBoard = board;
        this.instanceMesh = rootMesh.createInstance("entity");
        this.instanceMesh.metadata = { type: "entity", x: 0, z: 0};
        this.moveRange = 4;
        this.attackRange = 2;
        this.transformNode = new BABYLON.TransformNode("CursorRoot");
        this.instanceMesh.setParent(this.transformNode, true);

        this.instanceMesh.metadata = {
            type: type,
            x: 0,
            z: 0
        };

        var plane = BABYLON.MeshBuilder.CreatePlane("plane", {
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            width: 0.25,
            height: 0.125
        });
        plane.parent = this.transformNode;
        plane.position.y = 1;

        this.startHealth = maxHealth;
        this.health = this.startHealth;

        let material = new BABYLON.StandardMaterial("")
        plane.material = material;
        material.emissiveColor = new BABYLON.Color3(0.7, 0.2, 0.2);
        
        //plane.scaling.x = 0.25;
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
        this.instanceMesh.metadata.x = this.boardPosition.x;
        this.instanceMesh.metadata.z = this.boardPosition.y;
    }

    public animatedMove(x: number, z: number): void {

    }

    public SetLookDirection(forward: LookDirection)
    {
        switch(forward)
        {
            case LookDirection.X_MINUS:
                this.instanceMesh.rotation = new BABYLON.Vector3(0, 0, 0);
                break;

            case LookDirection.X_PLUS:
                this.instanceMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
                break;

            case LookDirection.Z_MINUS:
                this.instanceMesh.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
                break;

            case LookDirection.Z_PLUS:
                this.instanceMesh.rotation = new BABYLON.Vector3(0,  - Math.PI / 2, 0);
                break;
        }
    }

    public GetBoardPosition() :  BABYLON.Vector2
    {
        return this.boardPosition;
    }

    public GetRange() : number {
        return this.moveRange;
    }

    public GetAttackRange(): number {
        return this.attackRange;
    }

    public GetType(): string {
        return this.instanceMesh.metadata.type;
    }
}