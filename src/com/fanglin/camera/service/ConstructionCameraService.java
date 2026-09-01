package com.fanglin.camera.service;

import java.util.List;

import com.fanglin.camera.vo.ConstructionCameraLiveVO;
import com.fanglin.camera.vo.ConstructionCameraVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionCameraService {

	public void pageConstructionCamera(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<ConstructionCameraVO> queryConstructionCameraByOrderId(ConstructionCameraVO constructionCameraVO, int company) throws FLException;

	public ConstructionCameraLiveVO queryConstructionCameraLiveUrl(ConstructionCameraVO constructionCameraVO, String protocol, String viewerId, int company) throws FLException;

	public int addConstructionCamera(ConstructionCameraVO constructionCameraVO, int company) throws FLException;

	public int updateConstructionCamera(ConstructionCameraVO constructionCameraVO, int company) throws FLException;

	public int updateConstructionCameraForStatus(ConstructionCameraVO constructionCameraVO, int company) throws FLException;

	public int updateConstructionCameraForVisible(ConstructionCameraVO constructionCameraVO, int company) throws FLException;

	public int deleteConstructionCamera(ConstructionCameraVO constructionCameraVO, int company) throws FLException;

}
