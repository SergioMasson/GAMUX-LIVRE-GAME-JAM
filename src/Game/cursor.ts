import * as BABYLON from "@babylonjs/core";
import { Board } from "./board";

const CURSOR_BASE_HEIGHT = 0.5;

export class Cursor
{
    private board : Board;
    private camera : BABYLON.Camera;
    private scene : BABYLON.Scene;
    private mesh: BABYLON.Mesh;
    private animationGroup: BABYLON.AnimationGroup;
    private transformNode: BABYLON.TransformNode;

    constructor(board: Board, scene: BABYLON.Scene, camera: BABYLON.Camera, mesh: BABYLON.Mesh)
    {
        this.board = board;
        this.scene = scene;
        this.camera = camera;
        this.mesh = mesh;
        this.animationGroup = new BABYLON.AnimationGroup("Cursor");
        this.CreateUpDownAnimation();

        this.transformNode = new BABYLON.TransformNode("CursorRoot");
        this.mesh.setParent(this.transformNode, true);

        this.animationGroup.play(true);
    }

    private CreateUpDownAnimation(): void {
        const frameRate = 30;
        const animDuration = 2 * frameRate;   
    
        var jumpY = new BABYLON.Animation(
          "jumpY",
          "position.y",
          frameRate,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
    
        var jumpYKeys = [];
    
        jumpYKeys.push({
          frame: 0,
          value:  CURSOR_BASE_HEIGHT
        });
    
        jumpYKeys.push({
          frame: 0.5 * animDuration,
          value: CURSOR_BASE_HEIGHT + 0.5
        });
    
        jumpYKeys.push({
          frame: 1 * animDuration,
          value: CURSOR_BASE_HEIGHT
        });
    
    
        jumpY.setKeys(jumpYKeys);  
        this.animationGroup.addTargetedAnimation(jumpY, this.mesh);
      }
    
 
    Update() : void
    {
        var ray = this.scene.createPickingRay(this.scene.pointerX, this.scene.pointerY, BABYLON.Matrix.Identity(), this.camera, false);	
        var pickResult = this.scene.pickWithRay(ray);

        if (pickResult.hit == true)
        {
            var worldPoint = pickResult.pickedPoint;

            let finalPosition = this.board.FitPositionToCell(worldPoint);        
            this.transformNode.setAbsolutePosition(finalPosition)
        }       
    }
}