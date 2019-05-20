
import EventDispatcher = laya.events.EventDispatcher;  
   
export default class EventManager extends EventDispatcher{
    constructor(){
        super();
    }

    private static eventDispatcher:EventDispatcher = new EventDispatcher();

    private static _instance:EventManager;
    public static Instance(){
        if(EventManager._instance == null){
            EventManager._instance = new EventManager();
        }
        return EventManager._instance;
    }

    public PostEvent(eName:string,args?:any){
        //onsole.debug("分发事件");
        EventManager.eventDispatcher.event(eName,args);
    }

    public AddEventListener(eName:string,caller:any,listener:Function,args?:any[]){
        //console.log("侦听事件",eName);
        EventManager.eventDispatcher.on(eName,caller,listener,args);
    }

    public RemoveEventListener(eName:string,caller:any,listener:Function,once?:boolean){
        //console.log("移除事件",eName);
        EventManager.eventDispatcher.off(eName,caller,listener,once);
    }

}