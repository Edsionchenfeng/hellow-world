import Loader = Laya.loader;
import Handler = laya.utils.Handler;
import GameUI from "../GameUI";
import Common from "../Common/Common";
    
export default class ResManager{
    private static _instance:ResManager;  

    static Instance():ResManager{
        if(ResManager._instance == null){
            ResManager._instance = new ResManager();
        }
        return ResManager._instance;
    }

    public ResNames : Array<any>;
    public ResEnitityDic : Laya.WeakObject;

    constructor(){
        this.ResNames = new Array<any>();
        this.ResEnitityDic = new Laya.WeakObject();
    }

    //加载多个资源
    public LoadPrefabAssets(resNames:Array<any>,finished?:Handler){
        if(resNames ==null ||resNames.length == 0)return ;

        this.ResNames = resNames;

        Laya.loader.create(resNames,
            
            Handler.create(this,()=>{
                
                this.ResNames.forEach(element => {

                    var res:Laya.Sprite3D = Laya.loader.getRes(element.url) as Laya.Sprite3D;

                    if(!this.ResEnitityDic.has(element.url)){
                        this.ResEnitityDic.set(element.url,res);
                    }
                      
                    if(finished!=null){
                        var params:Array<any> = [element.url,res];
                        finished.runWith(params);
                    }
                });
            }),

            Handler.create(this,(p)=>{
               this.SetLoadPercent(p);
            })
        ); 
    }

    public GetOneAsset(url:string):Laya.Sprite3D{
        if(url == null) return null;

        if(this.ResEnitityDic.has(url)){
            return this.ResEnitityDic.get(url) as Laya.Sprite3D;
        }else{
            return null;
        }
    }

    public ReleaseOneAsset(url:string){
        if(url == null) return ;
        var res = this.GetOneAsset(url) as Laya.Sprite3D;

        if(res != null){
            //待测试，是否释放了内存
            res.destroy(true);
        }
    }

    
    //待测试
    ReleaseAllAssets(){
        if(this.ResEnitityDic!=null){
            this.ResNames.forEach(element => {
                if(this.ResEnitityDic.has(element)){
                    this.ResEnitityDic.get(element).destroy(true);
                }
            });
        }
    }

    private SetLoadPercent(p:number){
        GameUI._instance.SetLoadPercent(p);
    }
}