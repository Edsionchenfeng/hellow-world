
import MtProtocalCommon from "./MtProtocalCommon";

export default class MtHttp{

    private m_ip:string;
    private m_port:string;
    public URL: string

    public m_token:string;

    private m_http:Laya.HttpRequest; 
    private m_protocalCommon : MtProtocalCommon;
    private m_callback:any;
    private m_caller:any;

    constructor(ip:string,port:string){
        this.m_ip = ip;
        this.m_port = port;
        this.URL = "http://"+this.m_ip + ":" + this.m_port;

        this.m_http  = new Laya.HttpRequest;
        this.m_protocalCommon = new MtProtocalCommon();
    }


    public get(url:string,caller:any,callback:any){
        this.m_caller = caller;
        this.m_callback = callback;
        this.m_http.once(Laya.Event.COMPLETE,this,this.onHttpRequestComplete);
        this.m_http.once(Laya.Event.ERROR,this,this.onHttpRequestError);
        this.m_http.send(url,null,'get','text');
        return this;
       }

    public post(url:string,data:any,caller:any,callback:any){
        this.m_caller = caller;
        this.m_callback = callback;
        this.m_http.once(Laya.Event.COMPLETE, this, this.onHttpRequestComplete);
        this.m_http.once(Laya.Event.ERROR, this, this.onHttpRequestError);
        this.m_http.send(url, data, 'post', 'json',this.m_protocalCommon.CommonHeader);
        return this;
    }

    private onHttpRequestError(e: any): void {
        this.m_callback.apply(this.m_caller,[{state:"failed",msg:e}]);
    }
    
    private onHttpRequestComplete(e: any): void {
        this.m_callback.apply(this.m_caller,[{state:"succeed",data:this.m_http.data}]);
    }
    
}