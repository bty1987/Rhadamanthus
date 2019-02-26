package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CircleDrawingPO;

public interface CircleDrawingDao extends Dao<CircleDrawingPO>{
	
	public List<CircleDrawingPO> queryCircleDrawingByCid(long cid);

}
