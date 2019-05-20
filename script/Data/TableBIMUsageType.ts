import GameManager from "../GameManager";
import NameConfig from "../Configure/NameConfig";

export default class TableUsageType{

    private readonly TabelName:string = "BIMUsageType";
    private UsageTypeDic:Laya.WeakObject;

    IsLoaded:boolean;

    Init(url:string,finished?:any){

        this.InitContainer();

        var postUrl = url.concat("/IVS/Common/retrieveAllByTableName");
        var postBody = JSON.stringify({"tableName":this.TabelName});

        this.AsynLoadData(postUrl,postBody,finished);

    }

    GetOneUsageName(code:string):string{
        if(code == null) return null;
        if(this.UsageTypeDic.has(code)){
            var data:UsageType = this.UsageTypeDic.get(code);
            return data.name;
        }else{
            return null;
        }
    }

    GetOneUsageColor(code:string):string{
        if(code == null) return null;

        var level:string = this.GetUsageLevelLevel(code);

        if(level!="2"){
            code = code.substr(0,4);
        }

        if(this.UsageTypeDic.has(code)){
            var data:UsageType = this.UsageTypeDic.get(code);
            return data.color;
        }else{
            return null;
        }
    }

    GetUsageLevelLevel(code:string){
        if(code == null) return null;
        if(this.UsageTypeDic.has(code)){
            var data:UsageType = this.UsageTypeDic.get(code);
            return data.level;
        }else{
            return null;
        }
    }

    private InitContainer(){
        this.UsageTypeDic = new Laya.WeakObject();
    }

    private AsynLoadData(url:string,postbody:any,fininshed?:any){
        GameManager.Instance().Http.post(url,postbody,this,(e:any)=>{
            if(e.state == "succeed"){
                var rst =e.data["data"]["list"];
                rst.forEach(element => {
                    var ele = this.CreateUsageType(element);
                    if(ele!=null&& ele.code!=null){
                        if(!this.UsageTypeDic.has(ele.code)){
                            this.UsageTypeDic.set(ele.code,ele);
                        }
                    }
                });

                fininshed.apply();

                this.IsLoaded =true;
            }
        });
    }

    private CreateUsageType(element:any):UsageType {
        var data: UsageType = new UsageType();
        data.code = element.code;
        data.name = element.name;
        data.level = element.level;
        data.color = element.color;
        return data;
    }

}

export class UsageType{
    public code: string;
    public name: string;
    public level:string;
    public color:string;
}  