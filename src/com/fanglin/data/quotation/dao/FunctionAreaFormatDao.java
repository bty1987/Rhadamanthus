package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.FunctionAreaFormatPO;

public interface FunctionAreaFormatDao extends Dao<FunctionAreaFormatPO> {

	public List<FunctionAreaFormatPO> queryFunctionAreaFormatByFacid(long facid);

	public int deleteFunctionAreaFormatByFacid(long facid);

}
