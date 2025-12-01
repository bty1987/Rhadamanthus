package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.FunctionAreaOtemPO;

public interface FunctionAreaOtemDao extends Dao<FunctionAreaOtemPO> {

	public List<FunctionAreaOtemPO> queryFunctionAreaOtemByFaid(long faid);

	public int deleteFunctionAreaOtemByFaid(long faid);
}
