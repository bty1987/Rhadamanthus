package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.RevisitPO;
import com.fanglin.utils.Paging;

public interface RevisitDao extends Dao<RevisitPO> {

	public List<RevisitPO> pageRevisit(Paging paging, List<Filter> filters);

	public List<RevisitPO> queryRevisitByOrderId(String orderId);

	public List<RevisitPO> queryRevisitForAepair(long ident);

	public List<RevisitPO> queryRevisitForComplain(long ident);

}
