import CameraMoveScript from "../Component/CameraMoveScript";
import GameManager from "../GameManager";

import Vector3 = Laya.Vector3;
import Handler = Laya.Handler;
import RaySelector from "../Component/RaySelector";
import EventManager from "../Events/EventManager";
import { Events } from "../Events/Events";
import LightControl from "../Component/LightControl";

export default class CameraManager{

    Camera:Laya.Camera;

    Is2D:Boolean;

    private _3dPos:Vector3;
    private _3dRot:Vector3;
    private _2dPos:Vector3;
    private _2dRot:Vector3;
    private _oriOrthSize;

    constructor(){
        this._3dPos = new Vector3(-6,45,17);
        this._3dRot = new Vector3(-78,0,0);
        this._2dPos = new Vector3(-5,50,17);
        this._2dRot = new Vector3(-90,0,0);
        this._oriOrthSize = 70;
    }

    InitCamera(){
        var camera:Laya.Camera = new Laya.Camera(); 
        camera.transform.position = this._3dPos;
        camera.transform.localRotationEuler = this._3dRot;
        camera.clearColor = new Laya.Vector4(0,0,0,0);
        this.Camera = camera;

        //摄像机控制
        camera.addComponent(CameraMoveScript);
        //射线检测
        camera.addComponent(RaySelector);
        var rayselector = camera.getComponent(RaySelector) as RaySelector;
        rayselector.Scene3D = GameManager.Instance().MainScene;

        GameManager.Instance().MainScene.addChild(camera);

        this.InitLight();
    }

    InitLight(){
        var directionLight: Laya.DirectionLight = new Laya.DirectionLight();
        GameManager.Instance().MainScene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(0.2, 0.2, 0.2);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
        directionLight.transform.position = this.Camera.transform.position;
        directionLight.transform.rotation = this.Camera.transform.rotation;

        directionLight.addComponent(LightControl);
        var lightcontrl = directionLight.getComponent(LightControl) as LightControl;
        lightcontrl.Camera = this.Camera;
    }

    ResetCamera(is2D:Boolean){
        this.Is2D = is2D;
        var component = this.Camera.getComponent(CameraMoveScript) as CameraMoveScript;
        if(is2D){
            this.Camera.orthographic = true;
            this.Camera.orthographicVerticalSize = 60;
            this.Camera.transform.position = this._2dPos;
            this.Camera.transform.localRotationEuler = this._2dRot;
            component.Is2D = true;

            // Laya.Tween.to(this.Camera,{position:this._2dPos,rotation:this._2dRot},1000,null,Handler.create(this,()=>{
            //     this.Camera.orthographic = true;
            //     this.Camera.orthographicVerticalSize = 60;
            //     component.Is2D = true;
            // }));

        }else{
            this.Camera.orthographic = false;
            this.Camera.transform.position = this._3dPos;
            this.Camera.transform.localRotationEuler = this._3dRot;
            component.Is2D = false;

            // Laya.Tween.to(this.Camera,{position:this._3dPos,rotation:this._3dRot},1000,null,Handler.create(this,()=>{
            //     this.Camera.orthographic = false;
            //     component.Is2D = false;
            // }));
        }
    }

    CameraMove(object:Object, fromPos:Vector3,toPos:Vector3){
        
    }

    CameraRotate(fromRotate:Vector3,toRotate:Vector3){

    }

    AddEvent(){
        EventManager.Instance().AddEventListener(Events.OnUI_LevelBtn_Clicked.toString(),this,this.CameraMoveInLevel);
    }

    CameraMoveInLevel(levelName:string){

    }
}