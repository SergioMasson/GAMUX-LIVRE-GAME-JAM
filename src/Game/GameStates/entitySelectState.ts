import { Board } from "../board";
import { GameState } from "./state";
import * as BABYLON from "@babylonjs/core";

export class EntitySelectState implements GameState
{
    private scene: BABYLON.Scene;
    private onClickObservable: BABYLON.Observer<BABYLON.PointerInfo>;
    private shouldEnd: boolean;
    private board: Board;
    private camera: BABYLON.Camera;

    constructor(scene: BABYLON.Scene, board: Board, camera: BABYLON.Camera) 
    {
        this.scene = scene;
        this.board = board;
        this.camera = camera;
    }

    Start(): void 
    {
        console.log("Starting  EntitySelectState");
        this.onClickObservable = this.scene.onPointerObservable.add((pointerInfo) => 
        {
            if(pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN)
            {
                console.log("Pointer down");

                var ray = this.scene.createPickingRay(this.scene.pointerX, this.scene.pointerY, BABYLON.Matrix.Identity(), this.camera, false);	
                var hit = this.scene.pickWithRay(ray);
    
                if (hit.pickedMesh) 
                {
                    if (hit.pickedMesh.metadata) 
                    {
                        if (hit.pickedMesh.metadata.type === "cell") 
                        {
                            const entity = this.board.GetEntityAtCell(hit.pickedMesh.metadata.x, hit.pickedMesh.metadata.z);
                            
                            if (entity != undefined) 
                            {
                                console.log("Entity selected!");
                                this.shouldEnd = true;
                            }
                            else
                            {
                                console.log("No mesh found on the cell.");
                            }
                        }
                    }
                }
            }
        });

        this.shouldEnd = false;
    }

    End(): void 
    {
        console.log("Ending  EntitySelectState");
        this.scene.onPointerObservable.remove(this.onClickObservable);
    }

    Update(deltaT : number): void 
    {
    }

    ShouldEnd(): boolean 
    {
        return this.shouldEnd;
    }   
}