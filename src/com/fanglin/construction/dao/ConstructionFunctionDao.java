package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.construction.po.ConstructionFunctionPO;

public interface ConstructionFunctionDao extends Dao<ConstructionFunctionPO> {

	public List<ConstructionFunctionPO> queryConstructionFunction(Short type);

	public List<ConstructionFunctionPO> queryConstructionFunctionByName(String name);

}
