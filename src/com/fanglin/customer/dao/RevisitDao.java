package com.fanglin.customer.dao;

import java.util.List;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.RevisitPO;
import com.fanglin.utils.Paging;


public interface RevisitDao extends Dao<RevisitPO>{
	//分页
	public List<RevisitPO> pageRevisit(Paging paging, List<Filter> filters);
	//通过装修单号获取回访信息
	public List<RevisitPO> queryRevisitByOrderId(String orderId);
	//获取报修类型回访信息
	public List<RevisitPO> queryRevisitForAepair(long ident);
	//获取投诉类型回访信息
	public List<RevisitPO> queryRevisitForComplain(long ident);
	
}
