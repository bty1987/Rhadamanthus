package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.FunctionAreaItemPO;

public interface FunctionAreaItemDao extends Dao<FunctionAreaItemPO> {

	public List<FunctionAreaItemPO> queryFunctionAreaItem(long functionAreaId);

	public FunctionAreaItemPO queryFunctionAreaItem(long functionAreaId, long qiid);

	public int deleteFunctionAreaItem(long functionAreaId);

}
