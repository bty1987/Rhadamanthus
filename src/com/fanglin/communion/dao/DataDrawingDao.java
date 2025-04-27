package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.DataDrawingPO;
import com.fanglin.core.dao.Dao;

public interface DataDrawingDao extends Dao<DataDrawingPO> {

	public List<DataDrawingPO> queryDataDrawing(Long sid, Short type);

	public int batchSaveDataDrawing(long gid, long gpid, int uid);

}
