import * as BABYLON from "@babylonjs/core";
import { Board } from "./board";

const CURSOR_BASE_HEIGHT = 0.5;

export class Cursor
{
    private board : Board;
    private camera : BABYLON.Camera;
    private scene : BABYLON.Scene;
    private mesh: BABYLON.Mesh;
    private animationGroupLow: BABYLON.AnimationGroup;
    private animationGroupHigh: BABYLON.AnimationGroup;
    private transformNode: BABYLON.TransformNode;

    constructor(board: Board, scene: BABYLON.Scene, camera: BABYLON.Camera, mesh: BABYLON.Mesh)
    {
        this.board = board;
        this.scene = scene;
        this.camera = camera;
        this.mesh = mesh;
        this.animationGroupLow = new BABYLON.AnimationGroup("Cursor");
        this.animationGroupHigh = new BABYLON.AnimationGroup("Cursor");
      
        this.CreateUpDownAnimation(CURSOR_BASE_HEIGHT, CURSOR_BASE_HEIGHT + 0.5, this.animationGroupLow);
        this.CreateUpDownAnimation(CURSOR_BASE_HEIGHT + 0.5, CURSOR_BASE_HEIGHT + 1, this.animationGroupHigh);

        this.transformNode = new BABYLON.TransformNode("CursorRoot");
        this.mesh.setParent(this.transformNode, true);
        this.mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);

        this.animationGroupLow.play(true);
    }

    private CreateUpDownAnimation(base: number, top: number, animgroup: BABYLON.AnimationGroup): void {
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
          value:  base
        });
    
        jumpYKeys.push({
          frame: 0.5 * animDuration,
          value: top
        });
    
        jumpYKeys.push({
          frame: 1 * animDuration,
          value: base
        });
    
    
        jumpY.setKeys(jumpYKeys);  
        animgroup.addTargetedAnimation(jumpY, this.mesh);
    }
    
 
    Update() : void
    {
        var ray = this.scene.createPickingRay(this.scene.pointerX, this.scene.pointerY, BABYLON.Matrix.Identity(), this.camera, false);	
        var pickResult = this.scene.pickWithRay(ray);

        if (pickResult.hit == true)
        {
          var worldPoint = pickResult.pickedPoint;

          let finalPosition = this.board.FitPositionToCell(worldPoint);

          this.transformNode.setAbsolutePosition(finalPosition);

          if (!pickResult) return;
          if (!pickResult.pickedMesh) return;
          if (!pickResult.pickedMesh.metadata) return;
          if (!pickResult.pickedMesh.metadata.type) return;
          if (pickResult.pickedMesh.metadata.type !== "cell") return;

          let metadataResultante = pickResult.pickedMesh.metadata;

          if (this.board.GetEntityAtCell(metadataResultante.x, metadataResultante.z) !== undefined) {
            this.animationGroupLow.stop();
            this.animationGroupHigh.play(true);
          }
          else {
            this.animationGroupHigh.stop();
            this.animationGroupLow.play(true);
          }
        }       
    }
}