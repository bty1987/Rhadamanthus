package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.utils.Paging;

public interface DecorationHolonomyDao extends Dao<DecorationHolonomyPO> {
	
	public List<DecorationHolonomyPO> pagedecorationHolonomy(Paging paging,List<Filter> filters, int company);

	public DecorationHolonomyPO queryDecorationHolonomyByOrderId(String orderId);
}
