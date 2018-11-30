package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.market.po.EpicturePO;

public interface EpictureDao extends Dao<EpicturePO>{
	
	public List<EpicturePO> queryEpictureByCid(long cid);

}
