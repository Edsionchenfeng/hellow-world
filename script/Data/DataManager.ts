import Handler = laya.utils.Handler;
import NameConfig from "../Configure/NameConfig";
import GameManager from "../GameManager";
import TableOrgnization from "./TableOrgnization";
import MtHttp from "../Network/MtHttp";
import TableUsageType from "./TableBIMUsageType";
import TableBIMSpace, { SpaceData } from "./TableBIMSpace";

export default class DataManager{

    //private SpaceDataDic:Laya.WeakObject;

    tableOrganization:TableOrgnization;
    tableUsageType:TableUsageType;
    tableBimSpace:TableBIMSpace;

    constructor(){

        //this.SpaceDataDic = new Laya.WeakObject;
    }

    Init(){
        this.RegisterTables();
    }

    RegisterTables(){

        this.tableBimSpace = new TableBIMSpace();
        this.tableBimSpace.Init(GameManager.Instance().Http.URL,()=>{

            this.tableOrganization = new TableOrgnization();
            this.tableOrganization.Init(GameManager.Instance().Http.URL,()=>{

                this.tableUsageType = new TableUsageType();
                this.tableUsageType.Init(GameManager.Instance().Http.URL,()=>{

                    GameManager.Instance().LoadRes();

                });

            });    
        });
    }


    GetOneOrganizationName(code:string):string{
        if(this.tableOrganization.IsLoaded){
            return this.tableOrganization.GetOneOrganizationName(code);
        }else
            return null;        
    }

    GetOneOrganizationColor(code:string):string{
        if(this.tableOrganization.IsLoaded){
            return this.tableOrganization.GetOneOrganizationColor(code);
        }else
            return null;
    }

    GetOneUsageName(code:string):string{
        if(this.tableOrganization.IsLoaded){
            return this.tableUsageType.GetOneUsageName(code);
        }else
            return null;
    }

    GetOneUsageColor(code:string):string{
        if(this.tableOrganization.IsLoaded){
            return this.tableUsageType.GetOneUsageColor(code);
        }else
            return null;
    }

    GetOneSpaceData(code:string):SpaceData{
        if(this.tableOrganization.IsLoaded){
            return this.tableBimSpace.GetOneSpaceData(code);
        }else
            return null;
    }


    // LoadSpaceData(url:string,posBody:string,finished:Function){
    //     if(url == null || posBody ==null) return ;

    //     GameManager.Instance().Http.post(url,posBody,this,(e:any)=>{
    //         if(e.state == "succeed"){
    //             var rst =e.data["data"]["list"];
    //             rst.forEach(element => {
    //                 var ele = this.CreateSpaceData(element);
    //                 if(ele!=null&& ele.code!=null){
    //                     if(!this.SpaceDataDic.has(ele.code)){
    //                         this.SpaceDataDic.set(ele.code,ele);
    //                     }
    //                 }
    //             });
    //         }
    //         finished.apply(this);
    //     });
    // }

    // GetOneSpaceData(code:string):SpaceData{
    //     if(code == null) return null;
    //     if(this.SpaceDataDic.has(code)){
    //         return this.SpaceDataDic.get(code);
    //     } else
    //     return null;
    // }

    // CreateSpaceData(element:any):SpaceData {
    //     var data: SpaceData = new SpaceData();
    //     data.code = element.code;
    //     data.usageName = element.usageName;
    //     data.buildingCode = element.buildingCode;
    //     data.campusCode = element.campusCode;
    //     data.levelCode = element.levelCode;
    //     data.organizationCode = element.organizationCode;
    //     data.useArea = element.useArea.toFixed(2).toString() + "m²";
    //     data.perimeter = element.perimeter;
    //     return data;
    // }
}

// export class SpaceData{
//     public code:             string;
//     public usageName:        string;
//     public buildingCode:     string;
//     public campusCode:       string;
//     public levelCode:        string;
//     public organizationCode: string;
//     public usageTypeCode:    string;
//     public useArea:          string;
//     public netHeight:        string;
//     public perimeter:        string;
// }  