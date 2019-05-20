
export default class Common{


    /**
     * 通过楼板Code获得LevelCode
     * @param code 
     */
    static GetLevelByFloorCode(code:string):string{
        if(code == null) return null;

        var names = code.split("-");
        if(names.length < 3){
            return null;
        }else{
            return code.substring(0,15);
        }            
    }

    
    /**
     * 通过楼板Code获得BuildingCode
     * @param code 
     */
    static GetBuildingByFloorCode(code:string):string{
        if(code == null) return null;

        var names = code.split("-");
        if(names.length < 3){
            return null;
        }else{
            return code.substring(0,10);
        }         
    }

    /**
     * 通过加载的资源，获取当前资源的所在的楼层
     * @param url .lh资源的url路径，.lh文件的命名规则必须为楼层的Code
     */
    static ParseLoadLevel(url:string):string{
        if(url == null) return null;

        var temp = url.substr(url.lastIndexOf("/") + 1);
        var level = temp.substr(0,temp.indexOf("."));

        return level;
    }

    /**
     * 返回前端显示的LevelCode;例如F1
     * @param levelCode 楼层编码：BDHCMU-A02-F001
     */
    static GetPurLevel(levelCode:string):string{
        if(levelCode == null || levelCode.match("-") == null)
            return null;

        var eles = levelCode.split("-");

        if(eles.length<3)
            return null;

        return eles[2];
    }
}