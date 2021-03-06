
import Vector3 = Laya.Vector3;
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
    protected  rotaionSpeed:number = 0.00006;
    protected  camera:Laya.BaseCamera;
    protected  scene:Laya.Scene;

    public Is2D:Boolean = false;
    private minRot = new Vector3(-30,90,0);
    private maxRot = new Vector3(-90,90,0);

    private _2dWheelSpeed = 2;
    private _3dWheelSpeed = 0.2;

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
        this.camera.transform.translate(this._tempVector3);
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
    public moveVertical(distance:number):void {
        this._tempVector3.x = this._tempVector3.z = 0;
        this._tempVector3.y = distance;
        this.camera.transform.translate(this._tempVector3, false);
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
        this.camera = this.owner as Laya.Camera;
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, this.mouseWheel);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.rightMouseDown);
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.rightMouseUp);
        
        //Test
        this.m_testLabel = this.createLabel("#000000", null);
        this.m_testLabel.pos(50, 50)
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
            this.m_lastTouchFinger0Y = touches[0].stageY;
            this.m_lastDistance = this.getDistance(touches);
            this.m_preRadian = Math.atan2(touches[0].stageY - touches[1].stageY, touches[0].stageX - touches[1].stageX);
        }

        this.ShowInfo();
        
    }
    
    protected mouseUp(e:Laya.Event):void {
        this.isMouseDown = false;
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
        }else{
            this.moveForward(-speed * this._3dWheelSpeed);
        }

        if (this.OnMouseWheel) 
            this.OnMouseWheel(speed);

        this.ShowInfo();
    }

    private m_isLastTouchDoubleFingers: boolean = false;
    private m_angleY: number = 0;
    private m_angleX: number = 0;
    private m_isRightMouseButtonDown: boolean = false;
    protected m_lastTouchFinger0Y: number = 0;
    private m_rotateRadius: number = 1;

    
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
                    let speed: number = 0.06;
                    this.moveRight(-speed * deltaX);
                    this.moveVertical(speed * deltaY);
                       
                    this.lastMouseX = Laya.stage.mouseX;
                    this.lastMouseY = Laya.stage.mouseY;

                } else {
                    //if(this.Is2D) return ;

                    //鼠标右键操作旋转
                    let deltaX: number = Laya.stage.mouseX - this.lastMouseX;
                    let deltaY: number = Laya.stage.mouseY - this.lastMouseY;
                    
                    let point: Vector3 = new Vector3(0, 0, 0);
                    // let point:Vector3 = this.CalculateCenterPoint(new Laya.Vector2(Laya.Browser.width/2,Laya.Browser.height/2));

                    this.m_angleY += deltaX;
                    this.m_angleX += deltaY;
                    let radius: number = 0;
                    var cameraPosition: Vector3 = this.camera.transform.position;

                    // radius = this.getTwoPointsDistance(new Vector3(point.x, 0, point.z), new Vector3(cameraPosition.x, 0, cameraPosition.z));
                    radius = this.getTwoPointsDistance(point, cameraPosition);

                    this.rotateAroundY(point, radius, this.m_angleY * 0.01);
                    this.rotateAroundX(point, radius, -this.m_angleX * 0.002);

                    // this.rotateAroundY(this.m_angleY * 0.01);
                    // this.rotateAroundX(point, radius, -this.m_angleX * 0.002);


                    // this.m_testLabel.text = this.m_angleX.toFixed(2).toString();

                    this.lastMouseX = Laya.stage.mouseX;
                    this.lastMouseY = Laya.stage.mouseY;
                }
            }
        } else {
            //触控模式
            if (touches.length == 1) {
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
                let speed: number = 0.06;
                this.moveRight(-speed * deltaX);
                this.moveVertical(speed * deltaY);
                this.lastMouseX = Laya.stage.mouseX;
                this.lastMouseY = Laya.stage.mouseY;
            }
            else if (touches.length == 2) {
                //双指触控
                this.m_isLastTouchDoubleFingers = true;

                //Two fingers drag
                let deltaY: number = touches[0].stageY - this.m_lastTouchFinger0Y;
                let point: Vector3 = new Vector3(0, 0, 0);
                this.m_angleX += deltaY;
                let radius: number = 0;
                var cameraPosition: Vector3 = this.camera.transform.position;
                radius = this.getTwoPointsDistance(point, cameraPosition);
                // this.rotateAroundY(point, radius, touches[0].stageX * 0.01);
                let radians: number = this.m_angleX * 3.14 * 0.1 / 180;
                // this.rotateAroundX(point, radius, -radians);
                this.m_lastTouchFinger0Y = touches[0].stageY;

                // this.m_testLabel.text = radians.toFixed(2).toString();
                
                //Two fingers pinch
                var distance: number = this.getDistance(e.touches);
                const factor: number = 0.01;
                var pinchValue: number = 0;
                pinchValue += (distance - this.m_lastDistance) * factor;
                this.m_lastDistance = distance;
                const fingerPinchSpeed: number = 1;
                this.moveForward(-pinchValue * fingerPinchSpeed);
                if (this.OnDoubleFingersPinch)
                    this.OnDoubleFingersPinch(pinchValue);

                // //Two fingers twist
                // var nowRadian: number = Math.atan2(touches[0].stageY - touches[1].stageY, touches[0].stageX - touches[1].stageX);
                // let twistValue = 180 / Math.PI * (nowRadian - this.m_preRadian);
                // this.m_preRadian = nowRadian;
                // if (this.OnDoubleFingersTwist)
                //     this.OnDoubleFingersTwist(twistValue);
            }
        }
    }

    // private rotateAroundY(angle: number): void {
    //     this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);

    //     // console.log("Yaw:"+this.yawPitchRoll.x);
    //     // console.log("Pitch:"+this.yawPitchRoll.y * 180 / 3.14);
    //     // console.log("Roll:"+this.yawPitchRoll.z);
    //     // console.log("-----------------------------");
        
    //     // this.camera.transform.rotate(new Vector3(deltaY * -0.01, deltaX * -0.001, 0));
    //     console.log("angle:"+angle.toFixed(1));

    //     let radius = this.m_rotateRadius * Math.cos(this.yawPitchRoll.y);
    //     let posX: number = Math.cos(angle) * 3;
    //     let posZ: number = Math.sin(angle) * 3;
    //     // let posX: number = Math.cos(angle) * this.m_rotateRadius;
    //     // let posZ: number = Math.sin(angle) * this.m_rotateRadius;


    //     // let forward: Vector3 = this.camera.transform.forward;
    //     let position: Vector3 = this.camera.transform.position;
    //     // let point: Vector3 = new Vector3();   
    //     // let deltaPosition: Vector3 = new Vector3();   
    //     // Vector3.scale(forward, this.m_rotateRadius, deltaPosition); 
    //     // Vector3.add(position, deltaPosition, point); 

    //     let newPosition: Vector3 = new Vector3(posX, position.y, posZ);
    //     // let newForward: Vector3 = new Vector3();
    //     // Vector3.subtract(point, newPosition, newForward);
    //     // Vector3.normalize(newForward, newForward);

    //     // Vector3.scale(direction, this.m_rotateRadius, deltaPosition);
    //     // Vector3.add(point, deltaPosition, point); 

    //     this.camera.transform.position = newPosition;
    //     // this.camera.transform.forward = newForward;
        
    //     this.camera.transform.lookAt(new Vector3(0, 1, 0), new Vector3(0, 1, 0), false);


    //     // console.log("Yaw:"+this.yawPitchRoll.x);
    //     // console.log("Pitch:"+(this.yawPitchRoll.y * 180 / 3.14).toFixed(1));
    //     // console.log("Roll:"+this.yawPitchRoll.z);

    //     // console.log("point:"+point.x.toFixed(2));
    //     // console.log("point:"+point.y.toFixed(2));
    //     // console.log("point:"+point.z.toFixed(2));
        
    //     // console.log("Pitch:"+this.camera.transform.position.y);
    //     // console.log("Roll:"+this.camera.transform.position.z);
    //     console.log("-----------------------------");
    // }


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

        // let axis: Vector3 = new Vector3(); 
        // this.camera.transform.getRight(axis);
        // this.camera.transform.lookAt(ponit, axis, false);
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
}
