package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.FunctionAreaTypePO;
import com.fanglin.utils.Paging;

public interface FunctionAreaTypeDao extends Dao<FunctionAreaTypePO> {

	public List<FunctionAreaTypePO> pageFunctionAreaType(Paging paging, List<Filter> filters);

	public List<FunctionAreaTypePO> queryFunctionAreaType();

	public FunctionAreaTypePO queryFunctionAreaTypeByName(String name);

}
