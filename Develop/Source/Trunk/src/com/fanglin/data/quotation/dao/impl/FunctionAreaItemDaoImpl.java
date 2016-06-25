package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.FunctionAreaItemPO;
import com.fanglin.data.quotation.dao.FunctionAreaItemDao;

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
				.add(Restrictions.eq("functionArea.faId", functionAreaId))
				.addOrder(Order.asc("quotationItem.itemId"))
				.list();
	}

	@Override
	public FunctionAreaItemPO queryFunctionAreaItemByIdAFunctionAreaId(long functionAreaId, long itemId){
		return (FunctionAreaItemPO)session().createCriteria(FunctionAreaItemPO.class)
				.add(Restrictions.eq("quotationItem.qiId", itemId))
				.add(Restrictions.eq("functionArea.faId", functionAreaId))
				.uniqueResult();
	}
	
	@Override
	public int deleteFunctionAreaItemByFunctionAreaId(long functionAreaId){
		
		StringBuffer sql = new StringBuffer();
		sql.append("delete from platform.functionAreaQuoteItem where functionAreaId=:functionAreaId");
		
		return session().createSQLQuery(sql.toString()).setLong("functionAreaId", functionAreaId).executeUpdate();
	}
}
