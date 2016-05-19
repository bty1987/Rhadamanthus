package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.FunctionAreaItemDao;
import com.fanglin.quotation.po.FunctionAreaItemPO;

@Repository("functionAreaItemDao")
public class FunctionAreaItemDaoImpl extends DaoImpl<FunctionAreaItemPO> implements FunctionAreaItemDao{

	public FunctionAreaItemDaoImpl(){
		super(FunctionAreaItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaItemPO> queryFunctionAreaItemByFunctionAreaId(long functionAreaId){
		return (List<FunctionAreaItemPO>)session().createCriteria(FunctionAreaItemPO.class)
				.createAlias("quotationItem", "quotationItem")
				.add(Restrictions.eq("functionArea.autoId", functionAreaId))
				.addOrder(Order.asc("quotationItem.itemId"))
				.list();
	}

	@Override
	public FunctionAreaItemPO queryFunctionAreaItemByIdAFunctionAreaId(long functionAreaId, long itemId){
		return (FunctionAreaItemPO)session().createCriteria(FunctionAreaItemPO.class)
				.add(Restrictions.eq("quotationItem.autoId", itemId))
				.add(Restrictions.eq("functionArea.autoId", functionAreaId))
				.uniqueResult();
	}
	
	@Override
	public int deleteFunctionAreaItemByFunctionAreaId(long functionAreaId){
		
		StringBuffer sql = new StringBuffer();
		sql.append("delete from platform.functionAreaQuoteItem where functionAreaId=:functionAreaId");
		
		return session().createSQLQuery(sql.toString()).setLong("functionAreaId", functionAreaId).executeUpdate();
	}
}
