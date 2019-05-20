//协议--请求头文件
export default class ProtocolCommon{

    public CommonHeader :Array<any>;

    private readonly AccessControlAllowOrigin = "Access-Control-Allow-Origin";
    private readonly AccessControlAllowOriginValue = "*";
    private readonly AccessControlAllowHeaders = "Access-Control-Allow-Headers";
    private readonly AccessControlAllowHeadersValue = "Content-Type,Content-Length, Authorization, Accept,X-Requested-With";
    private readonly AccessControlAllowMethods = "Access-Control-Allow-Methods";
    private readonly AccessControlAllowMethodsValue = "POST, GET, OPTIONS,DELETE,PUT";
    
    private readonly XAuthTokenField:string = "X-Auth-Token";
    private readonly XAuthTokenFieldValue:string = "open-sesame";
    private readonly AcceptField:string = "Accept";
    private readonly ContentTypeFieldValue:string = "application/json";
    private readonly ContentTypeField:string = "Content-Type";
    private readonly TokenField:string = "cookie";
 
    private cookie:string;
    
    constructor(){
        this.CommonHeader = new Array<any>()
        this.CommonHeader.push(this.AccessControlAllowOrigin,this.AccessControlAllowOriginValue);
        this.CommonHeader.push(this.AccessControlAllowHeaders,this.AccessControlAllowHeadersValue);
        this.CommonHeader.push(this.AccessControlAllowMethods,this.AccessControlAllowMethodsValue);
        this.CommonHeader.push(this.XAuthTokenField,this.XAuthTokenFieldValue);
        this.CommonHeader.push(this.AcceptField,this.ContentTypeFieldValue);
        this.CommonHeader.push(this.ContentTypeField,this.ContentTypeFieldValue);
    }

    public SetCookies(cookie:string){
        cookie = cookie;
    }

}