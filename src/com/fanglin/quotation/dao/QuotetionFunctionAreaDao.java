package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotetionFunctionAreaPO;

public interface QuotetionFunctionAreaDao extends Dao<QuotetionFunctionAreaPO> {
	
	public List<QuotetionFunctionAreaPO> queryQuotetionFunctionAreaByQuotetionId(long qid);
	
	public QuotetionFunctionAreaPO queryQuotetionFunctionAreaForTypeByQuotetionId(long qid,short type);
	
	public int deleteQuotetionFunctionAreaByIds(List<Long> qfaIds);
	
}
