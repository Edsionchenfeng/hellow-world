import GameManager from "../GameManager";
import Vector3 = Laya.Vector3;
import MeshRenderer = Laya.MeshRenderer;
import EventManager from "../Events/EventManager";
import { Events } from "../Events/Events";
import Common from "../Common/Common";

export default class RaySelector extends Laya.Script3D{

    public Camera:Laya.Camera;
    public Scene3D:Laya.Scene3D;
    public Mask:number;

    public Lock:boolean;

    private m_isClicked:boolean;

    private m_deltaClickTime:number;

    private m_selected:Laya.MeshSprite3D;
    
    private m_ray:Laya.Ray;
    private m_hitResult:Laya.HitResult;
    private m_mousePoint:Laya.Vector2 = new Laya.Vector2();

    onAwake(){
        if(this.owner!=null){
            var cam = this.owner as Laya.Camera;
            if(cam!=null){
                this.Camera = cam;
            }
        }

        this.m_ray = new Laya.Ray(new Vector3(),new Vector3());
        this.m_hitResult = new Laya.HitResult();
    
        this.AddMouseEvent();
    }

    onUpdate(){
        this.RayCastHit();
    }

    AddMouseEvent(){
        Laya.stage.on(Laya.Event.CLICK,this,this.OnRayCastClicked);
    }

    RemoveMouseEvent(){
        Laya.stage.off(Laya.Event.CLICK,this,this.OnRayCastClicked);
    }

    onDisable(){
        this.RemoveMouseEvent();
    }


    private RayCastHit(){
        this.m_mousePoint.x = Laya.stage.mouseX;
        this.m_mousePoint.y = Laya.stage.mouseY;

        if(this.Camera!=null&&this.Scene3D!=null){
            this.Camera.viewportPointToRay(this.m_mousePoint,this.m_ray);
            this.Scene3D.physicsSimulation.rayCast(this.m_ray,this.m_hitResult);
            if(this.m_hitResult.succeeded){
                var collider = this.m_hitResult.collider.owner as Laya.MeshSprite3D;

                //this.m_deltaClickTime +=Laya.timer.delta;

                if(this.m_isClicked){
                    EventManager.Instance().PostEvent(Events.OnSpaceClicked.toString(),collider);
                    GameManager.Instance().BIM.SetLayaColor(collider,Laya.Color.RED);        
                }

                if(this.m_selected!=collider){
                    this.m_isClicked = false;

                    if(this.m_selected!=null){

                        EventManager.Instance().PostEvent(Events.OnSpaceExit.toString(),this.m_selected);

                        GameManager.Instance().BIM.ResetColor(this.m_selected);

                        this.m_selected = null;
                    }

                    this.m_selected = collider;

                    EventManager.Instance().PostEvent(Events.OnSpaceExit.toString(),this.m_selected);

                    GameManager.Instance().BIM.SetLayaColor(collider,Laya.Color.YELLOW);
                }
            }
        }
    }


    OnRayCastClicked(){


        this.m_isClicked = true;

        // this.m_mousePoint.x = Laya.stage.mouseX;
        // this.m_mousePoint.y = Laya.stage.mouseY;

        // this.Camera.viewportPointToRay(this.m_mousePoint,this.m_ray);

        // if(this.Scene3D!=null){
           
        //     this.Scene3D.physicsSimulation.rayCast(this.m_ray,this.m_hitResult);

        //     if(this.m_hitResult.succeeded){

        //         var colliderName = this.m_hitResult.collider.owner.name;

        //         //console.debug("碰撞的对象为："+ colliderName);

        //         var floor:Laya.MeshSprite3D = GameManager.Instance().BIM.GetOneFloorSprite3D(colliderName);

        //         if(floor==null)return ;

        //         var mats = floor.meshRenderer.materials;

        //         mats.forEach(element => {
        //             var mat:Laya.BlinnPhongMaterial = element as Laya.BlinnPhongMaterial;
        //             mat.albedoColor = new Laya.Vector4(1,0,0,1);
        //         });
        //     }
        // }
    }



    


    DrawLine(){
        // this.m_mousePoint.x = Laya.MouseManager.instance.mouseX;
        // this.m_mousePoint.y = Laya.MouseManager.instance.mouseY;
     
        // this.m_camera.worldToViewportPoint(this.m_camera.transform.position,this.camPos);

        // this.sp.graphics.clear();
        // this.sp.graphics.drawLine(this.camPos.x,this.camPos.y,this.m_mousePoint.x,this.m_mousePoint.y,"#ff0000",1); 
    }
}