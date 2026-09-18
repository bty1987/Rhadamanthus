package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.FunctionAreaCategoryPO;

public interface FunctionAreaCategoryDao extends Dao<FunctionAreaCategoryPO> {

	public List<FunctionAreaCategoryPO> queryFunctionAreaCategoryByFaid(long faid);

	public List<FunctionAreaCategoryPO> queryFunctionAreaCategoryByFaids(List<Long> faids);

	public FunctionAreaCategoryPO queryFunctionAreaCategory(long faid, long cid);

}
