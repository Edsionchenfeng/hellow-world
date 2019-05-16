# hellow-world
用于存储H5项目
 this.m_camera = new Laya.Camera();
      this.m_scene.addChild(this.m_camera);
      this.m_camera.transform.translate(new Laya.Vector3(0, 3, 3));
      this.m_camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
      this.m_camera.clearColor = new Laya.Vector4(1,1,1,1);
      this.m_camera.addComponent(CameraMoveScript);
