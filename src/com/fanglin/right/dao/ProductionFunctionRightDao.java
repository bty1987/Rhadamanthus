package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.ProductionFunctionRightPO;

public interface ProductionFunctionRightDao extends Dao<ProductionFunctionRightPO>{

	public List<ProductionFunctionRightPO> queryProductionFunctionRightByName(String name);

	public int deleteProductionFunctionRightByName(String name);

}
