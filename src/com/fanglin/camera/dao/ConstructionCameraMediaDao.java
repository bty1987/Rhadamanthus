package com.fanglin.camera.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.camera.po.ConstructionCameraMediaPO;
import com.fanglin.core.dao.Dao;

public interface ConstructionCameraMediaDao extends Dao<ConstructionCameraMediaPO> {

	public List<ConstructionCameraMediaPO> queryConstructionCameraMedia(String orderId, Long cameraId, Timestamp startTime, Timestamp endTime, Long csid, Short source, Short visible, int company);

}
