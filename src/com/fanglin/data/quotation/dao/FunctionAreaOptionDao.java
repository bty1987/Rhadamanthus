package com.fanglin.data.quotation.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.FunctionAreaOptionPO;

public interface FunctionAreaOptionDao extends Dao<FunctionAreaOptionPO> {

	public int deleteFunctionAreaOptionByFaid(long faid);
}
