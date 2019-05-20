import GameManager from "../GameManager";

export default class TableBIMSpace{

    private readonly TabelName:string = "BIMSpace";
    private SpaceDataDic:Laya.WeakObject;

    IsLoaded:boolean;

    Init(url:string,finished?:any){

        this.InitContainer();

        var postUrl = url.concat("/IVS/BIMSpace/dynamicQuery");
        var postBody = JSON.stringify({"levelCodeList":["PUMCHW-D03-F001","PUMCHW-D03-F002","PUMCHW-D03-F003"]});

        this.AsynLoadData(postUrl,postBody,finished);
    }

    GetOneSpaceData(code:string):SpaceData{
        if(code == null) return null;
        if(this.SpaceDataDic.has(code)){
            return this.SpaceDataDic.get(code);
        } else
        return null;
    }

    private InitContainer(){
        this.SpaceDataDic = new Laya.WeakObject();
    }

    private AsynLoadData(url:string,postBody:any,finished?:any){
        if(url == null || postBody ==null) return ;

        GameManager.Instance().Http.post(url,postBody,this,(e:any)=>{
            if(e.state == "succeed"){
                var rst =e.data["data"]["list"];
                rst.forEach(element => {
                    var ele = this.CreateSpaceData(element);
                    if(ele!=null&& ele.code!=null){
                        if(!this.SpaceDataDic.has(ele.code)){
                            this.SpaceDataDic.set(ele.code,ele);
                        }
                    }
                });

                finished.apply();

                this.IsLoaded = true;
            }
        });
    }

    private CreateSpaceData(element:any):SpaceData {
        var data: SpaceData = new SpaceData();
        data.code = element.code;
        data.usageName = element.usageName;
        data.buildingCode = element.buildingCode;
        data.campusCode = element.campusCode;
        data.levelCode = element.levelCode;
        data.organizationCode = element.organizationCode;
        data.usageTypeCode = element.usageTypeCode;
        data.useArea = element.useArea.toFixed(2).toString() + "m²";
        data.perimeter = element.perimeter;
        return data;
    }
}


export class SpaceData{
    public code:             string;
    public usageName:        string;
    public buildingCode:     string;
    public campusCode:       string;
    public levelCode:        string;
    public organizationCode: string;
    public usageTypeCode:    string;
    public useArea:          string;
    public perimeter:        string;
}  

