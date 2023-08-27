import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";
import { Game } from "./Game/game";

const levelsArray = ["level0", "level1", "level2"];
let currentLevel = 0;

class App 
{
    constructor() 
    {
        // create the canvas html element and attach it to the webpage
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
        const canvas = document.createElement("canvas");
        canvas.id = "gameCanvas";
        canvas.style.border = "0";
        canvas.style.outline = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.oncontextmenu = () => false;
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new BABYLON.Engine(canvas, true);
        var game = new Game(engine, canvas);

        window.addEventListener("resize", () => {
            engine.resize();
        });

        game.StartLevel(levelsArray[currentLevel]).then(function() : void 
        {
            // run the main render loop
            engine.runRenderLoop(() => 
            {
                game.Update(engine.getDeltaTime() / 1000);
                
                if(game.ShouldEndGame())
                {
                    currentLevel++;
                    game.LoadNewLevel(levelsArray[currentLevel]);
                }

            });
        });
    }
}

new App();