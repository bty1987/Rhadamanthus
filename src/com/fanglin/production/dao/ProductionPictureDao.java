package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.production.po.ProductionPicturePO;

public interface ProductionPictureDao extends Dao<ProductionPicturePO>{
	
	public List<ProductionPicturePO> queryProductionPictureByPid(long pid);

}
