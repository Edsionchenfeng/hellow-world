import { ui } from "./../ui/layaMaxUI";
import GameManager from "./GameManager";
import NameConfig from "./Configure/NameConfig";

/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */

export default class GameUI extends ui.portal.LoadingUI {

    static _instance : GameUI;
    
    constructor() {
        super();  
    }

    //Enable初始化
    onEnable():void{
        GameUI._instance = this;
        this.UIAdapter();
        this.LoginBtn.on(Laya.Event.CLICK,this,this.OnLoginBtnClicked);
    }

    //登陆
    OnLoginBtnClicked(e: Laya.Event): void {
        GameManager.Instance().Login();
    }

    //设置资源加载进度
    SetLoadPercent(percent:number){
        this.ProgressBar.visible = true;
        this.ProgressBar.value = percent;
        if(percent == 1){
            this.DestroyScene();
        }
    }

    DestroyScene(){
        //this.destroy();
        Laya.Scene.close(this.scene);
    }

    //UI适配
    UIAdapter(){
        this.width = NameConfig.screenWidth;
        this.height = NameConfig.screenHegiht;
        this.Background.width = NameConfig.screenWidth;
        this.Background.height = NameConfig.screenHegiht;
        this.Title.pos(NameConfig.screenWidth/2,NameConfig.screenHegiht/4);
        this.LoginBtn.pos(NameConfig.screenWidth/2,NameConfig.screenHegiht/3 + 100);
        this.ProgressBar.pos(NameConfig.screenWidth/2,NameConfig.screenHegiht * 3 / 4);
        this.ProgressBar.visible = false;
    }
}
