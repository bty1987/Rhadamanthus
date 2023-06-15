package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.QuotationFunctionRightPO;

public interface QuotationFunctionRightDao extends Dao<QuotationFunctionRightPO> {

	public List<QuotationFunctionRightPO> queryQuotationFunctionRight(String name);

	public int deleteQuotationFunctionRightByName(String name, Short type);

}
