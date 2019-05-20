
import Vector3 = Laya.Vector3;
import Vector2 = Laya.Vector2;
import Label = Laya.Label;

export default class CameraMoveScript extends Laya.Script3D {
		
    /** @private */
    protected  _tempVector3:Laya.Vector3 = new Laya.Vector3();
    protected  lastMouseX:number;
    protected  lastMouseY:number;
    protected  yawPitchRoll:Laya.Vector3 = new Laya.Vector3();
    protected  resultRotation:Laya.Quaternion = new Laya.Quaternion();
    protected  tempRotationZ:Laya.Quaternion = new Laya.Quaternion();
    protected  tempRotationX:Laya.Quaternion = new Laya.Quaternion();
    protected  tempRotationY:Laya.Quaternion = new Laya.Quaternion();
    protected  isMouseDown:Boolean;
    protected  isMouseWheel:Boolean;
    protected  camera:Laya.BaseCamera;
    protected  scene:Laya.Scene;

    public Is2D:Boolean = false;
    private _3dWheelSpeed = 0.4;
    private _3dMinMoveDistance = 15;
    private _2dWheelSpeed = 4;
    private _minOrthographicSize = 12;

    private m_moveSpeed = 0.06;
    private m_rotaionSpeed:number = 0.004;


    private m_lastDistance: number = 0;
    private m_preRadian: number = 0;

    // public CameraInfo: ICameraInfo;
    public OnMouseWheel: Function;
    public OnSingleFingerDrag: Function;
    public OnDoubleFingersPinch: Function;
    public OnDoubleFingersTwist: Function;
    
    protected m_testLabel: Label;

    constructor() {
        super();
    }

    public resetPosition(): void {
        this.camera.transform.translate(new Laya.Vector3(0, 3, 3));
        this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
    }

     /**
     * 向前移动。
     * @param distance 移动距离。
     */
    public  moveForward(distance:number):void {
        this._tempVector3.x = this._tempVector3.y = 0;
        this._tempVector3.z = distance;

          //wudi
        if(this.camera.transform.position.z < this._3dMinMoveDistance){
            this.camera.transform.position.z = this._3dMinMoveDistance;
        }else{
            this.camera.transform.translate(this._tempVector3);
        }

      
    }
    
    /**
     * 向右移动。
     * @param distance 移动距离。
     */
    public moveRight(distance:number):void {
        this._tempVector3.y = this._tempVector3.z = 0;
        this._tempVector3.x = distance;
        this.camera.transform.translate(this._tempVector3);
    }
    
    /**
     * 向上移动。
     * @param distance 移动距离。
     */
    // public moveVertical(distance:number):void {
    //     this._tempVector3.x = this._tempVector3.z = 0;
    //     this._tempVector3.y = distance;
    //     this.camera.transform.translate(this._tempVector3, false);
    // }

    public moveUp(distance:number):void {
        this._tempVector3.x = this._tempVector3.z = 0;
        this._tempVector3.y = distance;
        this.camera.transform.translate(this._tempVector3, true);
    }

    /**
     * @private
     */
    protected  _updateRotation():void {
        if (Math.abs(this.yawPitchRoll.y) < 1.50) {
            Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
            this.camera.transform.localRotation = this.camera.transform.localRotation;
        }
    }
    
    /**
     * @inheritDoc
     */

    public onUpdate(): void {
       // var elapsedTime:number = Laya.timer.delta;
        // if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
        //     // var scene:Laya.Scene3D = this.owner.scene;
        //     // Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.01 * elapsedTime);//W
        //     // Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.01 * elapsedTime);//S
        //     // Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.01 * elapsedTime);//A
        //     // Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.01 * elapsedTime);//D
        //     // Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(0.01 * elapsedTime);//Q
        //     // Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-0.01 * elapsedTime);//E
            
        //     // var offsetX:number = Laya.stage.mouseX - this.lastMouseX;
        //     // var offsetY:number = Laya.stage.mouseY - this.lastMouseY;
        //     // var yprElem:Laya.Vector3 = this.yawPitchRoll;
        //     // yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
        //     // yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
        //     // this._updateRotation();
        // }
        // this.lastMouseX = Laya.stage.mouseX;
        // this.lastMouseY = Laya.stage.mouseY;

    }


    public  onAwake():void {

        this.InitValue();

        this.camera = this.owner as Laya.Camera;
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, this.mouseWheel);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.rightMouseDown);
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.rightMouseUp);
        
        //Test
        this.m_testLabel = this.createLabel("#ffffff", null);
        this.m_testLabel.pos(200, 0);

        this.RefreshPitchRadian();
        this.RefreshLookAtPoint();
    }

    InitValue(){
        if(Laya.Browser.onMobile||Laya.Browser.onMQQBrowser){
            this.m_moveSpeed = 0.01;
        }
        if(Laya.Browser.onPC||Laya.Browser.onMac){
            this.m_moveSpeed = 0.01;
        }
    }
    /**
     * @inheritDoc
     */
    public onDestroy():void {
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.off(Laya.Event.MOUSE_WHEEL, this, this.mouseWheel);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.rightMouseDown);
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.rightMouseUp);
    }
    
    protected  mouseDown(e: Laya.Event): void {
        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        this.isMouseDown = true;

        // //Two fingers operation
        var touches: Array<any> = e.touches;
        if (touches && touches.length == 2) {
            this.m_lastTouchFinger0.x = touches[0].stageX;
            this.m_lastTouchFinger0.y = touches[0].stageY;
            this.m_lastTouchFinger1.x = touches[1].stageX;
            this.m_lastTouchFinger1.y = touches[1].stageY;
            this.m_lastDistance = this.getDistance(touches);
            // this.m_preRadian = Math.atan2(touches[0].stageY - touches[1].stageY, touches[0].stageX - touches[1].stageX);
            this.m_preRadian = this.atan2Ext(touches[0].stageY - touches[1].stageY, touches[0].stageX - touches[1].stageX);
            this.m_isTwoFingersTouch = true;
        }

        this.ShowInfo();
        
    }
    
    protected mouseUp(e:Laya.Event):void {
        this.isMouseDown = false;
        var touches: Array<any> = e.touches;
        if (touches && touches.length == 0) {
            this.m_isTwoFingersTouch = false;
        }
    }

    protected rightMouseDown(e: Laya.Event): void {
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        this.isMouseDown = true;
        this.m_isRightMouseButtonDown = true;

        //
        // var touches: Array<any> = e.touches;
        // if (touches && touches.length == 2) {
        //     this.m_lastDoubleFingersX = touches[0].stageX;
        //     this.m_lastDoubleFingersY = touches[0].stageY;
        // }

    }

    protected rightMouseUp(e: Laya.Event): void {
        this.isMouseDown = false;
        this.m_isRightMouseButtonDown = false;
    }
    
    protected  mouseOut(e:Laya.Event):void {
        this.isMouseDown = false;
    }

    private m_rotateAngle: number = 0;
    protected  mouseWheel(e:Laya.Event):void {

        let speed: number = e.delta;

        if(this.Is2D){        
            this.camera.orthographicVerticalSize += -speed * this._2dWheelSpeed;   
            
            if(this.camera.orthographicVerticalSize < this._minOrthographicSize){
                this.camera.orthographicVerticalSize = this._minOrthographicSize;
            }
            
        }else{
            this.cameraZoom(speed);
        }

        if (this.OnMouseWheel) 
            this.OnMouseWheel(speed);

        this.ShowInfo();
    }

    private cameraZoom(touchOffset: number): void{
        let currentForwardLength: number = this.m_forwardLength;
        let distance: number = -touchOffset * this._3dWheelSpeed;
        currentForwardLength += distance;
        if (touchOffset > 0) {
            //拉近
            if (currentForwardLength < this.m_minCameraZoomLength)  
                distance += (this.m_minCameraZoomLength - currentForwardLength);
            
        } else {
            //拉远
            if (currentForwardLength > this.m_maxCameraZoomLength)  
                distance -= (currentForwardLength - this.m_maxCameraZoomLength);
        }
        this.moveForward(distance);
        this.m_forwardLength += distance;
    }

    private m_isLastTouchDoubleFingers: boolean = false;
    // private m_angleY: number = 0;
    // private m_angleX: number = 0;
    private m_isRightMouseButtonDown: boolean = false;
    // private m_lastTouchFinger0Y: number = 0;
    // private m_rotateRadius: number = 1;
    private m_lastTouchFinger0: Vector2 = new Vector2();
    private m_lastTouchFinger1: Vector2 = new Vector2();

    private m_minCameraZoomLength: number = -50;
    private m_maxCameraZoomLength: number = 120;
    private m_minCameraPitchRadian: number = 0.6;  //(30°)
    private m_maxCameraPitchRadian: number = 1.5; //(90°)


    
    private m_currentPitchRadian: number;
    private m_forwardLength: number = 3;
    private m_lookAtPoint: Vector3 = new Vector3();
    private m_isTwoFingersTouch: boolean = false;
    private m_twoFingersDistance: number = 0;

    
    private mouseMove(e: Laya.Event): void {
         this.ShowInfo();
        var touches: Array<any> = e.touches;
        if (!touches) {
            if (this.isMouseDown) {
                //鼠标模式  
                if (!this.m_isRightMouseButtonDown) {
                    //鼠标左键操作拖动
                    let deltaX: number = Laya.stage.mouseX - this.lastMouseX;
                    let deltaY: number = Laya.stage.mouseY - this.lastMouseY;

                    if (this.m_isLastTouchDoubleFingers) {
                        deltaX = 0;
                        deltaY = 0;
                        this.m_isLastTouchDoubleFingers = false;
                    }
                    //let speed: number = 0.06;
                    this.moveRight(-this.m_moveSpeed * deltaX);
                    this.moveUp(this.m_moveSpeed * deltaY);
                    this.lastMouseX = Laya.stage.mouseX;
                    this.lastMouseY = Laya.stage.mouseY;
                    this.RefreshLookAtPoint();

                } else {
                    //鼠标右键操作旋转

                    if(this.Is2D) return ;

                    let deltaX: number = Laya.stage.mouseX - this.lastMouseX;
                    let deltaY: number = Laya.stage.mouseY - this.lastMouseY;
                    this.rotateAround(-deltaY * this.m_rotaionSpeed, -deltaX * this.m_rotaionSpeed);
                    this.lastMouseX = Laya.stage.mouseX;
                    this.lastMouseY = Laya.stage.mouseY;
                }
            }
        } else {
            //触控模式
            if (touches.length == 1 && !this.m_isTwoFingersTouch) {
                //单指触控
                // this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
                let deltaX: number = Laya.stage.mouseX - this.lastMouseX;
                let deltaY: number = Laya.stage.mouseY - this.lastMouseY;

                if (this.m_isLastTouchDoubleFingers) {
                    //如果上一次操作是双指,如双指操作时,抬起一指变单指操作,要做个清零,防止摄像机跳跃
                    deltaX = 0;
                    deltaY = 0;
                    this.m_isLastTouchDoubleFingers = false;
                }
                //let speed: number = 0.06;
                this.moveRight(-this.m_moveSpeed * deltaX);
                this.moveUp(this.m_moveSpeed * deltaY);
                this.lastMouseX = Laya.stage.mouseX;
                this.lastMouseY = Laya.stage.mouseY;

                this.RefreshLookAtPoint();

            }
            else if (touches.length == 2) {
                if(this.Is2D){
                    var distance: number = this.getDistance(e.touches);
                    const factor: number = 0.01;
                    var pinchValue: number = 0;
                    pinchValue += (distance - this.m_lastDistance) * factor;
                    this.m_lastDistance = distance;
                    const fingerPinchSpeed: number = 10;
                    this.cameraZoom(pinchValue * fingerPinchSpeed);
                    if (this.OnDoubleFingersPinch)
                        this.OnDoubleFingersPinch(pinchValue);

                }else{
                     //双指触控
                    this.m_isTwoFingersTouch = true;
                    this.m_isLastTouchDoubleFingers = true;

                    let twoFingersDistance: number = this.getTwoFingersDistance(touches);
                    let deltaDistance: number = Math.abs(twoFingersDistance - this.m_twoFingersDistance);
                    // this.m_testLabel.text = "deltaDistance:" + deltaDistance.toFixed(2);
                    this.m_twoFingersDistance = twoFingersDistance;
                    
                    //Two fingers drag
                    let deltaX0: number = touches[0].stageX - this.m_lastTouchFinger0.x;
                    let deltaY0: number = touches[0].stageY - this.m_lastTouchFinger0.y;
                    let deltaX1: number = touches[1].stageX - this.m_lastTouchFinger1.x;
                    let deltaY1: number = touches[1].stageY - this.m_lastTouchFinger1.y;
                    let deltaY = (deltaY0 + deltaY1) * 0.5;
                    let deltaX = (deltaX0 + deltaX1) * 0.5;
                    this.rotateAround(-deltaY * this.m_rotaionSpeed, 0);
                    // this.rotateAround(-deltaY * this.m_rotaionSpeed, -deltaX * this.m_rotaionSpeed);
                    this.m_lastTouchFinger0.x = touches[0].stageX;
                    this.m_lastTouchFinger0.y = touches[0].stageY;
                    this.m_lastTouchFinger1.x = touches[1].stageX;
                    this.m_lastTouchFinger1.y = touches[1].stageY;

                    //Two fingers pinch
                    var distance: number = this.getDistance(e.touches);
                    const factor: number = 0.01;
                    var pinchValue: number = 0;
                    pinchValue += (distance - this.m_lastDistance) * factor;
                    this.m_lastDistance = distance;
                    const fingerPinchSpeed: number = 10;
                    this.cameraZoom(pinchValue * fingerPinchSpeed);
                    if (this.OnDoubleFingersPinch)
                        this.OnDoubleFingersPinch(pinchValue);
                    
                    // this.m_testLabel.text = radians.toFixed(2).toString();

                    //Two fingers twist
                    let nowRadian: number = this.atan2Ext(touches[0].stageY - touches[1].stageY, touches[0].stageX - touches[1].stageX);
                    let deltaRadian: number = nowRadian - this.m_preRadian;
                    if (deltaRadian != 0) {
                        let twistValue: number = 180 / Math.PI * deltaRadian;
                        this.rotateAround(0, twistValue * 0.1);
                        this.m_preRadian = nowRadian;
                        if (this.OnDoubleFingersTwist)
                            this.OnDoubleFingersTwist(twistValue);
                    }
                }
            }
        }
    }

    //把Math.atan2值域映射到[0, 2pi]
    private atan2Ext(y: number, x: number): number {
        let radian: number = Math.atan2(y, x);
        if (radian >= 0)
            return radian;
        else
            return radian + 2 * Math.PI;
    }

    private getTwoFingersDistance(touches: Array<any>): number {
        let fingersDistance: number = 0;
        var dx: number = touches[0].stageX - touches[1].stageX;
        var dy: number = touches[0].stageY - touches[1].stageY;
        fingersDistance = Math.sqrt(dx * dx + dy * dy);
        return fingersDistance;
    }

    private rotateAroundY(ponit: Vector3, radius: number, angle: number): void {
        let posX: number = Math.cos(angle) * radius;
        let posY: number = Math.sin(angle) * radius;
        this.camera.transform.position = new Vector3(posX, this.camera.transform.position.y, posY);
        this.camera.transform.lookAt(ponit, new Vector3(0, 1, 0), false);
    }

    private rotateAroundX(ponit: Vector3, radius: number, angle: number): void {
        this.camera.transform.rotate(new Vector3(angle, 0, 0));
        let forward: Vector3 = new Vector3();
        this.camera.transform.getForward(forward);
        let position: Vector3 = new Vector3();   
        let deltaPosition: Vector3 = new Vector3();   
        Vector3.scale(forward, -radius, deltaPosition); 
        Vector3.add(ponit, deltaPosition, position); 
        this.camera.transform.position = position;
    }

    //计算两个触摸点之间的距离
    private getDistance(points: Array<any>): number {
        var distance: number = 0;
        if (points && points.length == 2) {
            var dx: number = points[0].stageX - points[1].stageX;
            var dy: number = points[0].stageY - points[1].stageY;
            distance = Math.sqrt(dx * dx + dy * dy);
        }
        return distance;
    }
    
    private getTwoPointsDistance(pointA: Vector3, pointB: Vector3): number {
        var distance: number = 0;
        var dx: number = pointA.x - pointB.x;
        var dy: number = pointA.y - pointB.y;
        var dz: number = pointA.z - pointB.z;
        distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        return distance;
    }

    //Test
    private createLabel(color: string, strokeColor: string): Label {
        const STROKE_WIDTH: number = 50;
        var label: Label = new Label();
        label.font = "Microsoft YaHei";
        label.text = "SAMPLE DEMO";
        label.fontSize = 20;
        label.color = color;

        if (strokeColor) {
            label.stroke = STROKE_WIDTH;
            label.strokeColor = strokeColor;
        }
        Laya.stage.addChild(label);
        return label;
    }

    private ShowInfo(){
        var pos:Laya.Vector3 = this.camera.transform.position;
        var rot:Laya.Vector3 = this.camera.transform.rotationEuler;
        this.m_testLabel.text = "Camera Pos : (" + pos.x.toFixed(2) + "," + pos.y.toFixed(2) + "," + pos.z.toFixed(2) + ")" + "\n";
        this.m_testLabel.text += "Camera Rot : (" + rot.x.toFixed(2) + "," + rot.y.toFixed(2) + "," + rot.z.toFixed(2) + ")"+ "\n";
        this.m_testLabel.text += "Camera orthographicVerticalSize : " + this.camera.orthographicVerticalSize+ "\n";
        this.m_testLabel.text += "Mouse PosX : " + Laya.stage.mouseX+ "\n";
        this.m_testLabel.text += "Mouse PosY : " + Laya.stage.mouseY+ "\n";
    }

    private rotateAround(angleX: number, angleY: number): void {
        let currentRadian: number = this.m_currentPitchRadian;
        currentRadian -= angleX;
        if (angleX < 0) {
            //下拖动,往上转
            if (currentRadian > this.m_maxCameraPitchRadian)  
                angleX += (currentRadian - this.m_maxCameraPitchRadian);
        } else {
            //上拖动,往下转
            if (currentRadian < this.m_minCameraPitchRadian)  
                angleX += (currentRadian - this.m_minCameraPitchRadian);
        }

        this.camera.transform.rotate(new Vector3(angleX, 0, 0));
        this.camera.transform.rotate(new Vector3(0, angleY, 0), false);

        let forward: Vector3 = new Vector3();
        this.camera.transform.getForward(forward);
        let newPosition: Vector3 = new Vector3();
        Vector3.scale(forward, -1, forward);
        newPosition = this.Forward(this.m_lookAtPoint, forward, this.m_forwardLength);
        this.camera.transform.position = newPosition;

        this.RefreshPitchRadian();
    }

    private Forward(position: Vector3, direction: Vector3, distance: number): Vector3 {
        let deltaPosition: Vector3 = new Vector3();   
        let newPosition: Vector3 = new Vector3();   
        Vector3.scale(direction, distance, deltaPosition); 
        Vector3.add(position, deltaPosition, newPosition); 
        return newPosition;
    }

    private RefreshLookAtPoint(): void {
        let forward: Vector3 = new Vector3();
        this.camera.transform.getForward(forward);
        this.m_lookAtPoint = this.Forward(this.camera.transform.position, forward, this.m_forwardLength);
    }

    private RefreshPitchRadian(): void {
        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
        this.m_currentPitchRadian = Math.abs(this.yawPitchRoll.y);
    }
   
}
