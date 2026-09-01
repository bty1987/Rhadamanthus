package com.fanglin.camera.service.provider;

import com.fanglin.camera.po.ConstructionCameraPO;
import com.fanglin.camera.vo.ConstructionCameraLiveVO;
import com.fanglin.core.interceptor.FLException;

public interface CameraProviderService {

	public ConstructionCameraLiveVO queryLiveUrl(ConstructionCameraPO cameraPO, String protocol, int company) throws FLException;

	public String capture(ConstructionCameraPO cameraPO, int company) throws FLException;

	public short queryOnlineStatus(ConstructionCameraPO cameraPO, int company) throws FLException;

}
