package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationInclusivePO;
import com.fanglin.utils.Paging;

public interface DecorationInclusiveDao extends Dao<DecorationInclusivePO> {
	
	public List<DecorationInclusivePO> pageDecorationInclusive(Paging paging,List<Filter> filters, int company);

	public DecorationInclusivePO queryDecorationInclusiveByOrderId(String orderId);
}
