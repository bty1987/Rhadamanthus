package com.fanglin.camera.dao;

import java.util.List;

import com.fanglin.camera.po.ConstructionCameraPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionCameraDao extends Dao<ConstructionCameraPO> {

	public List<ConstructionCameraPO> pageConstructionCamera(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<ConstructionCameraPO> queryConstructionCameraByOrderId(String orderId, int company);

	public ConstructionCameraPO queryConstructionCameraByCcid(long ccid, int company);

	public ConstructionCameraPO queryConstructionCameraByDevice(String provider, String deviceSerial, int channelNo, int company);

}
