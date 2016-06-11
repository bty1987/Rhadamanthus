package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.FunctionAreaItemPO;

public interface FunctionAreaItemDao extends Dao<FunctionAreaItemPO> {

	public List<FunctionAreaItemPO> queryFunctionAreaItemByFunctionAreaId(long functionAreaId);
	
	public FunctionAreaItemPO queryFunctionAreaItemByIdAFunctionAreaId(long functionAreaId, long itemId);

	public int deleteFunctionAreaItemByFunctionAreaId(long functionAreaId);

}
