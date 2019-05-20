export default class LightControl extends Laya.Script3D{

    constructor(){
        super();
    }

    Camera:Laya.Camera;
    private Light:Laya.DirectionLight;

    onAwake(){
        this.Light = this.owner as Laya.DirectionLight;
    }

    onUpdate(){
        this.Light.transform.position = this.Camera.transform.position;
        this.Light.transform.rotationEuler = this.Camera.transform.rotationEuler;
    }
}