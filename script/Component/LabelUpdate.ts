import GameManager from "../GameManager";

export default class LabelUpdatPos extends Laya.Script{

    private m_parent : Laya.MeshSprite3D;
    private m_camera : Laya.Camera;
    private m_label : Laya.Label;

    onAwake(){
        this.m_label = this.owner as Laya.Label;
        //console.debug("++++++++++++++++++++++");
    }

    onStart(){
        this.SetLabelPos();
    }

    onUpdate(){
        this.SetLabelPos();
    }

    public Init(parent:Laya.MeshSprite3D, camera:Laya.Camera,content: string){
        this.m_parent = parent;
        this.m_camera = camera;

        this.InitLabel();
        this.SetLabelContent(content);
    }

    public SetLabelContent(content:string){
        if(this.m_label == null) return ;

        this.m_label.text = content;
    }

    private InitLabel(){
        if(this.m_label==null) return ;

        this.m_label.width = 300;
        this.m_label.height = 50;
        this.m_label.pivotX = 150;
        this.m_label.pivotY = 25;
        this.m_label.font = "Microsoft YaHei";
        this.m_label.text = "SAMPLE DEMO";
        this.m_label.fontSize = 14;
        //this.m_label.bold = true;
        //this.m_label.color = "#000000"
        this.m_label.color = "#ffffff"
        this.m_label.stroke = 0.05;
        this.m_label.strokeColor = "#000000";
        //this.m_label.strokeColor = "#FFFFFF";
        this.m_label.align = "center";
    }


    private SetLabelPos(){
        if(this.m_parent == null || this.m_camera == null) return ;

        var floorPos = this.m_parent.transform.localPosition;

        var newPos = new Laya.Vector3(floorPos.x,floorPos.y,floorPos.z);

        var screenPos = new Laya.Vector3(newPos.x,newPos.y);
        this.m_camera.worldToViewportPoint(newPos,screenPos) ;

        this.m_label.pos(screenPos.x,screenPos.y+10);
    }
}