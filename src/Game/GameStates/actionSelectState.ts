import { GameState } from "./state";
import { Board } from "../board";
import { Cursor } from "../cursor";
import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

export class ActionSelectState implements GameState
{
    private board: Board;
    private UI: GUI.AdvancedDynamicTexture;
    private shouldEnd: boolean;
    
    constructor(scene: BABYLON.Scene, board: Board, camera: BABYLON.Camera, cursor: Cursor)
    {
        this.board = board;
    }

    createButton(texto: string, left: number, top: number, actionState: ActionSelectState): GUI.Button {
        var button1 = GUI.Button.CreateSimpleButton("but1", texto);
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            actionState.UI.dispose();
            actionState.shouldEnd = true;
        });

        button1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

        button1.left = left + "%";
        button1.top = top + "%";

        return button1;
    }

    Start(state: Array<number>): void 
    {
        let entity = this.board.GetEntityAtCell(state[2], state[3]);
        let adjacentCells = this.board.FindAround(state[2], state[3], 2, "cell", true);
        let attackedEntities = [];
        this.UI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        for (let c in adjacentCells) {
            let cell = adjacentCells[c];
            let enemyEntity = this.board.GetEntityAtCell(cell.metadata.x, cell.metadata.z);

            if (enemyEntity) {
                if (enemyEntity.GetType() === "enemy") attackedEntities.push(enemyEntity);
            }
        }

        if (attackedEntities.length > 0) {
            this.UI.addControl(this.createButton("Atacar", -10, 50, this));   
            this.UI.addControl(this.createButton("Bloquear", 10, 50, this));
        }
        else {
            this.UI.addControl(this.createButton("Bloquear", 0, 50, this));
        }

        this.shouldEnd = false;
    }

    End(): Array<Number> 
    {
        this.UI.dispose();
        return [0];
    }

    Update(deltaT : number): void 
    {
        
    }

    ShouldEnd(): boolean 
    {
        return this.shouldEnd;
    }

}