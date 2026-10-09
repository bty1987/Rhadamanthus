package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.construction.po.ConstructionFunctionPO;
import com.fanglin.utils.Paging;

public interface ConstructionFunctionDao extends Dao<ConstructionFunctionPO> {

	public List<ConstructionFunctionPO> pageConstructionFunction(Paging paging, List<Filter> filters);

	public List<ConstructionFunctionPO> queryConstructionFunction(Short type);

	public List<ConstructionFunctionPO> queryConstructionFunctionByName(String name);

	public long countConstructionFunctionRightByCfid(long cfid);

}
