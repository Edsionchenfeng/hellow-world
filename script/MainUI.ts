import {ui} from "./../ui/layaMaxUI";
import NameConfig from "./Configure/NameConfig";
import GameManager from "./GameManager";
import { LabelType } from "./BIM/BIMManager";

import Button = Laya.Button;
import Common from "./Common/Common";
import EventManager from "./Events/EventManager";
import { Events } from "./Events/Events";

export default class MainUI extends ui.MainScene.MainSceneUI{

    static _instance = null;

    private m_is2D:Boolean;
    private m_levelBtns:Array<Button>;
    private m_levelPos:Laya.WeakObject;

    private m_levelBtnOriPos:Laya.Vector2;

    private m_isShowMultiBtns:boolean = true;
    private m_isShowAllLevels:boolean = false;

    constructor(){
        super();
    }

    onEnable(){
        MainUI._instance = this;
        this.UIAdapter();   
        this.AddEvent(); 
        this.m_is2D = false;

        this.m_levelBtns = new Array<Button>();
        this.m_levelPos = new Laya.WeakObject();

    }


    private UIAdapter(){

        this.width = NameConfig.screenWidth;
        this.height = NameConfig.screenHegiht;

        this._2D3DBtn.pos(100,this.height-100)

        this.DepBtn.pos(100,this.height/3);
        this.UsageBtn.pos(100,this.height/3+150);
        this.AreaBtn.pos(100,this.height/3+300);

        this.MultiBtn.pos(this.width-150,this.height-180);    
        this.AllBtn.pos(this.width-150,this.height-100)
    }

    //应该有RemoveEvenet
    AddEvent(){
        this._2D3DBtn.on(Laya.Event.CLICK,null,(e)=>{
            this._2D3DBtnClicked();
            e.stopPropagation();
        });

        this.DepBtn.on(Laya.Event.CLICK,null,(e)=>{
             GameManager.Instance().BIM.RefreshLabelContent(LabelType.Depart);
             e.stopPropagation();
        });

        this.UsageBtn.on(Laya.Event.CLICK,null,(e)=>{
            GameManager.Instance().BIM.RefreshLabelContent(LabelType.Usage);
            e.stopPropagation();
        });

        this.AreaBtn.on(Laya.Event.CLICK,null,(e)=>{
             GameManager.Instance().BIM.RefreshLabelContent(LabelType.Area);
             e.stopPropagation();
        });

        this.MultiBtn.on(Laya.Event.CLICK,null,(e)=>{
            this.ShowLevels(this.m_isShowMultiBtns);
            e.stopPropagation();   
        });  

        this.AllBtn.on(Laya.Event.CLICK,null,(e)=>{

            this.m_isShowAllLevels = !this.m_isShowAllLevels

            GameManager.Instance().BIM.ShowAllLevels(this.m_isShowAllLevels);
            
            e.stopPropagation();   
        });  
    }

    CreateLevels(levels:Array<string>){
        if(levels==null||levels.length == 0)
            return;

        this.m_levelBtns.splice(0);
        
        var underGroundLevel = new Array<string>();
        var upGroundLevel = new Array<string>();

        levels.forEach(element => {

            if(element.length!=15){
                console.debug("level name is not legal!");
                return;
            }

            if(Common.GetPurLevel(element).match("B")!=null){
                underGroundLevel.push(element);
            }else{
                upGroundLevel.push(element);
            }
        });

        underGroundLevel.sort((a,b):number=>{
            return a.charAt(14)>b.charAt(14)?-1:1;
        });

        upGroundLevel.sort((a,b):number=>{
            return a.charAt(14)>b.charAt(14)?1:-1;
        });

        var realLevels:Array<string> = underGroundLevel.concat(upGroundLevel);

        //temp
        let index = 0;
        this.m_levelBtnOriPos = new Laya.Vector2(this.MultiBtn.x,this.MultiBtn.y);

        realLevels.forEach(element => {
            this.CreateOneButton(element,new Laya.Vector2(this.m_levelBtnOriPos.x,this.m_levelBtnOriPos.y - ++index*80))
        });
    }

    CreateOneButton(levelCode:string,pos:Laya.Vector2){
        if(levelCode == null) return ;

        var purLevel = Common.GetPurLevel(levelCode);

        var lvlBtn:Button = new Button("comp/button.png");
        
        lvlBtn.name = levelCode;
        lvlBtn.width = 80;
        lvlBtn.height = 60;
        lvlBtn.pos(pos.x,pos.y);
        lvlBtn.labelSize = 30;
        lvlBtn.label = purLevel.charAt(0)+purLevel.charAt(3);
        lvlBtn.on(Laya.Event.CLICK,null,(e,lvlName)=>{
            e.stopPropagation();
            EventManager.Instance().PostEvent(Events.OnUI_LevelBtn_Clicked.toString(),lvlBtn.name)
        })

        Laya.stage.addChild(lvlBtn);

        this.m_levelBtns.push(lvlBtn);

        this.m_levelPos.set(lvlBtn,new Laya.Vector2(lvlBtn.x,lvlBtn.y));
    }

    ShowLevels(b:boolean){
        this.m_isShowMultiBtns = !b;

        if(!this.m_isShowMultiBtns){
            this.MultiBtn.label = "展开";
            this.m_levelBtns.forEach(element => {
                Laya.Tween.to(element,{x:this.m_levelBtnOriPos.x,y:this.m_levelBtnOriPos.y},50,Laya.Ease.linearIn,Laya.Handler.create(this,()=>{
                    element.visible = this.m_isShowMultiBtns;
                }));
            });
        }else{
            this.MultiBtn.label = "折叠";
            this.m_levelBtns.forEach(element => {
                element.visible = this.m_isShowMultiBtns;
                var pos = this.m_levelPos.get(element) as Laya.Vector2;
                Laya.Tween.to(element,{x:pos.x,y:pos.y},50);
            });
        }
    }

    _2D3DBtnClicked(){
        this.m_is2D = !this.m_is2D;
        GameManager.Instance().Camera.ResetCamera(this.m_is2D);
        if(this.m_is2D){
            this._2D3DBtn.label = "3D";
        }else{
            this._2D3DBtn.label = "2D";
        }
    }
}