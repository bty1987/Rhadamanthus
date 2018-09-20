package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.VscoreRecordPO;
import com.fanglin.utils.Paging;


public interface VscoreRecordDao extends Dao<VscoreRecordPO> {

	public List<VscoreRecordPO> pageVscoreRecordByUnionId(Paging paging, List<Filter> filters, String unionId);
	
}
