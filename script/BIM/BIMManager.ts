import ResManager from "../Resource/ResManager";
import GameManager from "../GameManager";
import LabelUpdatPos from "../Component/LabelUpdate";
import Common from "../Common/Common";
import NameConfig from "../Configure/NameConfig";
import { SpaceData } from "../Data/TableBIMSpace";

/**
 * BIM管理类，用于加载、初始化模型；模型打包格式为.lh文件，以层为单位
 * 
 */

export default class BIMManager{

    public Levels:Array<string>;
    public CurrenLevel:string;

    private m_spaceDic:Laya.WeakObject;
    private m_levelSpsceDic:Laya.WeakObject;
    private m_levelRes:Laya.WeakObject;
  
    constructor(){
        this.m_spaceDic = new Laya.WeakObject();
        this.m_levelSpsceDic = new Laya.WeakObject();
        this.m_levelRes = new Laya.WeakObject();
        this.Levels = new Array<string>();
    }

    /** 
     * 加载所有楼层资源，并初始化楼板，默认隐藏，GameManager中开启默认层
     * 回调函数若需要执行多次，则需要将once置为false
     * @param resUrl
     * @param onComplete
     */
    LoadRes(resUrl:Array<any>,onComplete?:any){
        if(resUrl==null || resUrl.length == 0) 
            return ;

        var index:number = 0;

        ResManager.Instance().LoadPrefabAssets(resUrl,Laya.Handler.create(this,(url,res)=>{

            //初始化3D场景，初始化一次
            GameManager.Instance().Init3DScene();

            //将资源加入场景
            GameManager.Instance().MainScene.addChild(res);

            //遍历所有资源
            this.TravelMeshSprite3D(res);

            //资源默认隐藏
            res.active = false;

            //获得所有楼层
            var level = Common.ParseLoadLevel(url);
            this.Levels.push(level);

            //记录当前楼层资源
            if(!this.m_levelRes.has(level)){
                this.m_levelRes.set(level,res);
            }

            index++;

            if(index == resUrl.length){
                //设置默认的楼层为第一个
                this.CurrenLevel = this.Levels[0];
                onComplete.apply();
            }
        },null,false)); 
    }


    /**
     * 刷新当前显示楼层Tags的内容，通过标签类型LabelType来改变;
     * @param type 标签类型
     */
    RefreshLabelContent(type: LabelType){
        if(this.CurrenLevel ==null||
           this.m_levelSpsceDic == null||
           this.m_spaceDic == null)
            return;

        if(this.m_levelSpsceDic.has(this.CurrenLevel)){
            this.m_levelSpsceDic.get(this.CurrenLevel).forEach(element => {
                if(this.m_spaceDic.has(element)){

                    var floor:FloorItem = this.m_spaceDic.get(element) as FloorItem;

                    if(floor == null)
                        return;
    
                    switch(type){
                        case LabelType.Depart:
                            floor.label.text = floor.Organiaztion;
                            this.SetHexColor(floor.Object, floor.organizationColor)
                            break;
                        case LabelType.Area:
                            floor.label.text = floor.area;
                            break;
                        case LabelType.Usage:
                            floor.label.text = floor.usage;
                            this.SetHexColor(floor.Object, floor.usageColor)
                            break
                    }
                }
            });
        }
    }

    /**
     * 
     * @param b 显示或隐藏全部楼层，显示全部楼层时，要关掉tags
     */
    ShowAllLevels(b:boolean){
        if(this.Levels == null||this.Levels.length == 0)
            return;

        this.Levels.forEach(element => {
            if(b){
                this.ShowOneLevelFloors(element,true)
            }else{
                this.HideOneLevelFloors(element);
            }
        });
    }


    /**
     * 显示隐藏楼层及楼层Tag
     * @param level 楼层
     * @param b 显/隐
     */
    ShowOneLevelFloors(level:string,isShowAll?:boolean){
        if(level == null)
            return;

        //开启levelRoot
        if(this.m_levelRes.has(level)){
            var res:Laya.Sprite3D = this.m_levelRes.get(level);
            res.active = true;
        }

        if(this.m_levelSpsceDic.has(level)){
            this.m_levelSpsceDic.get(level).forEach(element => {
                if(this.m_spaceDic.has(element)){

                    var floorItem:FloorItem = this.m_spaceDic.get(element);

                    if(floorItem!=null && floorItem.label!=null)
                    {
                        if(isShowAll){
                            floorItem.label.visible = false;
                        }else{
                            floorItem.label.visible = true;
                        }
                    }
                }
            });
        }
        this.CurrenLevel = level;
    }

    HideOneLevelFloors(level:string){
        if(level == null)
        return;

        //开启levelRoot
        if(this.m_levelRes.has(level)){
            var res:Laya.Sprite3D = this.m_levelRes.get(level);
            res.active = false;
        }

        if(this.m_levelSpsceDic.has(level)){
            this.m_levelSpsceDic.get(level).forEach(element => {
                if(this.m_spaceDic.has(element)){
                    var floorItem:FloorItem = this.m_spaceDic.get(element);
                    if(floorItem!=null){
                        if(floorItem.label!=null){
                            floorItem.label.visible = false;
                        }
                    }
                }
            });
        }
    }

    /**
     * 通过Code获取一个FloorItem
     * @param code 
     */
    GetOneFloorItem(code:string):FloorItem{
        if(code == null) return null;

        if(this.m_spaceDic.has(code)){
            return this.m_spaceDic.get(code);
        }else{
            return null;
        }
    }


    GetOneFloorSprite3D(code:string):Laya.MeshSprite3D{
        if(code == null)return null;

        if(this.m_spaceDic.has(code)){
            var floor = this.m_spaceDic.get(code) as FloorItem;
            return floor.Object;
        }else
        {
            return null;
        }
    }

    
    private TravelMeshSprite3D(parent:Laya.Sprite3D){
        if(parent== null) return;
        
        for(var i = 0;i<parent._children.length;i++){

            var meshSprite3D : Laya.MeshSprite3D = parent.getChildAt(i) as Laya.MeshSprite3D;

            if(meshSprite3D != null){
                if(meshSprite3D.meshFilter!=null 
                    && meshSprite3D.parent.name == NameConfig.floor){

                    this.InstantiateFloorItem(meshSprite3D);

                }else{
                    this.TravelMeshSprite3D(meshSprite3D);
                }     
            } 
        }
    }

    /**
     * 对象化Floor
     * @param floor 
     */
    private InstantiateFloorItem(floor:Laya.MeshSprite3D){
        if(floor ==null)return;
         var meshName = floor.name;
         var data:SpaceData = GameManager.Instance().Data.GetOneSpaceData(meshName);

         if(data!=null){
            var floorItem = this.CreateFloorItem(floor,data);

            if(!this.m_spaceDic.has(meshName)){
                this.m_spaceDic.set(meshName,floorItem);              
            }

              //记录当前层所有的楼板
            if(!this.m_levelSpsceDic.has(data.levelCode)){
                this.m_levelSpsceDic.set(data.levelCode,new Array<any>());
            }
            var arr:Array<any> = this.m_levelSpsceDic.get(data.levelCode);
            arr.push(meshName);

         }else
         {
             console.log("DB not contain this {0} floor",meshName);
         }
    }

    private CreateFloorItem(floor:Laya.MeshSprite3D, data:SpaceData):FloorItem{
        if(floor == null || data == null)
            return;       
        var item = new FloorItem();
        item.Object = floor;
        item.Transform = floor.transform;
        item.Organiaztion = GameManager.Instance().Data.GetOneOrganizationName(data.organizationCode);
        item.organizationColor = GameManager.Instance().Data.GetOneOrganizationColor(data.organizationCode);
        item.usage = GameManager.Instance().Data.GetOneUsageName(data.usageTypeCode)
        item.usageColor = GameManager.Instance().Data.GetOneUsageColor(data.usageTypeCode);
        item.area = data.useArea;  

        //TEMP:默认显示用途
        item.label = this.CreateOneFloorTag(GameManager.Instance().Camera.Camera,floor,item.usage);
        this.SetHexColor(floor,item.usageColor);

        //默认Tag隐藏
        item.label.visible = false;
        return item;
    }

    private CreateOneFloorTag(camera:Laya.Camera, floor:Laya.MeshSprite3D , content:string) :Laya.Label{
        var label :Laya.Label = new Laya.Label();
        label.addComponent(LabelUpdatPos);
        Laya.stage.addChild(label);

        var component = label.getComponent(LabelUpdatPos) as LabelUpdatPos;
        component.Init(floor,camera,content);
        return label;
    }




    /**
     * ************************************************暂时先将设置颜色的方法放到BIM内********************************
     */

    /**
    * 记录设置颜色后的材质球；
    */
    private MaterialsDic:Laya.WeakObject = new Laya.WeakObject();


    /**
     * 设置对象颜色
     * @param target 
     * @param color Laya内部的Color
     */
    SetLayaColor(target:Laya.MeshSprite3D,color:Laya.Color){
        if(target == null||color == null) return;

        var mats = target.meshRenderer.materials;

        if(mats == null) return ;

        mats.forEach(element => {
            this.SetColor(element,new Laya.Vector4(color.r,color.g,color.b,color.a));
        });
    }


    /**
     * 设置对象的颜色
     * @param target 对象
     * @param hexColor 十六进制颜色
     */
    SetHexColor(target:Laya.MeshSprite3D,hexColor:string){
        if(target == null||hexColor == null) return;

        var mats = target.meshRenderer.materials;

        if(mats == null) return ;

        var color:Laya.Vector4 = this.ConvertColor(hexColor);

        mats.forEach(element => {
            this.SetColor(element,color);
        });
    }

    SetColor(mat:Laya.BaseMaterial,color:Laya.Vector4){
        if(mat == null || color == null)
            return;
        (mat as Laya.BlinnPhongMaterial).albedoColor = color;
        
        if(!this.MaterialsDic.has(mat)) {
            this.MaterialsDic.set(mat,color);
        }
    }

    /**
     * 颜色转换，将hexColor转换成Vector4
     * @param hexColor 
     */
    ConvertColor(hexColor:string):Laya.Vector4{
        try {
            var count:number = hexColor.length;
            var r = parseInt(hexColor.substr(0, 2), 16);
            var g = parseInt(hexColor.substr(2, 2), 16);
            var b = parseInt(hexColor.substr(4, 2), 16);
            var a = 255;
            if (count == 8)
                a = parseInt(hexColor.substr(6, 2), 16);
            return this.Convert(r, g, b, a);
        } catch (error) {
            console.debug("<color=yellow>{0}</color>", "十六进制颜色值格式错误,需输入6位或8位(带alpha)16进制值,如:0091EAFF,不加#或0x");
        }
        return new Laya.Vector4(1,1,1,1);
    }

    Convert(r:number,g:number, b:number, a:number) :Laya.Vector4{
        return new Laya.Vector4(r/255,g/255, b/255, a/255);
    }

    ResetColor(floor:Laya.MeshSprite3D){
        if(floor == null||floor.meshRenderer == null) return ;

        var mats = floor.meshRenderer.materials;
        if(mats!=null){
            mats.forEach(element => {
                if(this.MaterialsDic.has(element)){
                    var mat:Laya.BlinnPhongMaterial = element as Laya.BlinnPhongMaterial;
                    mat.albedoColor = this.MaterialsDic.get(element);
                }
            });
        }
    }
}

export enum LabelType{
    Depart,
    Usage,
    Area,
}

class FloorItem{
    public Object:Laya.MeshSprite3D;
    public Transform:Laya.Transform3D;
    public Organiaztion:string;
    public organizationColor:string;
    public usage:string;
    public usageColor:string;
    public area:string;
    public label:Laya.Label;
}