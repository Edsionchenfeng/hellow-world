import GameManager from "../GameManager";
import NameConfig from "../Configure/NameConfig";

export default class TableOrgnization{

    private readonly TabelName:string = "Organization";
    private orgnizationDic:Laya.WeakObject;

    IsLoaded:boolean;

    Init(url:string,finished?:any){

        this.InitContainer();

        //var postUrl = url.concat("/IVS/Common/retriByTableNameCampusCode");
        //var postBody = JSON.stringify({"tableName":this.TabelName,"campusCode": NameConfig.campusCode});

        var postUrl = url.concat("/IVS/Common/retrieveAllByTableName");
        var postBody = JSON.stringify({"tableName":this.TabelName});

        this.AsynLoadData(postUrl,postBody,finished);

    }

    GetOneOrganizationName(code:string):string{
        if(code == null) return null;

        var level:string = this.GetOrganizationLevel(code);

        if(level!="2"){
            code = code.substr(0,4);
        }

        if(this.orgnizationDic.has(code)){
            var data:Orgnization = this.orgnizationDic.get(code);
            return data.name;
        }else{
            return null;
        }
    }

    GetOneOrganizationColor(code:string):string{
        if(code == null) return null;

        var level:string = this.GetOrganizationLevel(code);

        if(level!="2"){
            code = code.substr(0,4);
        }

        if(this.orgnizationDic.has(code)){
            var data:Orgnization = this.orgnizationDic.get(code);
            return data.color;
        }else{
            return null;
        }
    }

    GetOrganizationLevel(code:string){
        if(code == null) return null;
        if(this.orgnizationDic.has(code)){
            var data:Orgnization = this.orgnizationDic.get(code);
            return data.level;
        }else{
            return null;
        }
    }

    private InitContainer(){
        this.orgnizationDic = new Laya.WeakObject();
    }

    private AsynLoadData(url:string,postbody:any,fininshed?:any){
        GameManager.Instance().Http.post(url,postbody,this,(e:any)=>{
            if(e.state == "succeed"){
                var rst =e.data["data"]["list"];
                rst.forEach(element => {
                    var ele = this.CreateOrganization(element);
                    if(ele!=null&& ele.code!=null){
                        if(!this.orgnizationDic.has(ele.code)){
                            this.orgnizationDic.set(ele.code,ele);
                        }
                    }
                });

                fininshed.apply();
                this.IsLoaded =true;
            }
        });
    }

    private CreateOrganization(element:any):Orgnization {
        var data: Orgnization = new Orgnization();
        data.code = element.code;
        data.name = element.name;
        data.level = element.level;
        data.color = element.color;
        return data;
    }

}

export class Orgnization{
    public code: string;
    public name: string;
    public level:string;
    public color:string;
}  