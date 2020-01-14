package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.production.po.ProductionFunctionPO;

public interface ProductionFunctionDao extends Dao<ProductionFunctionPO>{

	public List<ProductionFunctionPO> queryProductionFunction(Short type);

	public List<ProductionFunctionPO> queryProductionFunctionByName(String name);

}
