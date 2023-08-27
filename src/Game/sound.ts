import * as BABYLON from "@babylonjs/core";

export class Sound
{ 
	private attackSfx: BABYLON.Sound;
	private select1: BABYLON.Sound;
	private select2: BABYLON.Sound;
	private move: BABYLON.Sound;

	constructor(scene: BABYLON.Scene) {
		this.attackSfx = new BABYLON.Sound("Attack_sfx", "./sfx/attack.wav", scene, function () { });
		this.select1 = new BABYLON.Sound("Select1", "./sfx/select1.wav", scene, function () { });
		this.select2 = new BABYLON.Sound("Select1", "./sfx/select2.wav", scene, function () { });
		this.move =  new BABYLON.Sound("Move", "./sfx/move.wav", scene, function () {});

		let efeitos = this;

		window.addEventListener("keydown", function () { 
			efeitos.AttackSound();
		});
	}

	public AttackSound(): void {
		this.attackSfx.play();
	}

	public MoveSound(): void {
		this.move.play();
	}

	public SelectSound(): void {
		let qual = Math.random() > 0.5;
		
		if (qual) this.select1.play();
		else this.select2.play();
	}
}