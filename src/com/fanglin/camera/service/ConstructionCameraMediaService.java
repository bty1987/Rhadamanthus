package com.fanglin.camera.service;

import java.util.List;

import com.fanglin.camera.vo.ConstructionCameraMediaVO;
import com.fanglin.camera.vo.ConstructionCameraPlayVO;
import com.fanglin.camera.vo.ConstructionCameraVO;
import com.fanglin.core.interceptor.FLException;

public interface ConstructionCameraMediaService {

	public List<ConstructionCameraMediaVO> queryConstructionCameraMedia(ConstructionCameraMediaVO constructionCameraMediaVO, String startTime, String endTime, int company) throws FLException;

	public List<ConstructionCameraMediaVO> queryConstructionCameraPlayList(ConstructionCameraPlayVO constructionCameraPlayVO, String orderId, String startTime, String endTime, String viewerId, int company) throws FLException;

	public ConstructionCameraMediaVO captureConstructionCamera(ConstructionCameraVO constructionCameraVO, ConstructionCameraMediaVO constructionCameraMediaVO, String viewerId, int company) throws FLException;

}
