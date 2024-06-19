package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.FunctionAreaItemPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.FunctionAreaItemDao;

@Repository("functionAreaItemDao")
public class FunctionAreaItemDaoImpl extends DaoImpl<FunctionAreaItemPO> implements FunctionAreaItemDao {

	public FunctionAreaItemDaoImpl() {
		super(FunctionAreaItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaItemPO> queryFunctionAreaItem(long faid) {
		return (List<FunctionAreaItemPO>) session().createCriteria(FunctionAreaItemPO.class).createAlias("quotationItem", "quotationItem").add(Restrictions.eq("functionArea.faid", faid)).add(Restrictions.eq("quotationItem.status", QuotationItemPO.STATUS_ENABLE_INT)).addOrder(Order.asc("sort")).list();
	}

	@Override
	public FunctionAreaItemPO queryFunctionAreaItem(long faid, long qiid) {
		return (FunctionAreaItemPO) session().createCriteria(FunctionAreaItemPO.class).add(Restrictions.eq("quotationItem.qiid", qiid)).add(Restrictions.eq("functionArea.faid", faid)).uniqueResult();
	}

	@Override
	public int deleteFunctionAreaItem(long functionAreaId) {

		StringBuffer sql = new StringBuffer();
		sql.append("delete from quotation.functionAreaQuoteItem where functionAreaId=:functionAreaId");

		return session().createSQLQuery(sql.toString()).setLong("functionAreaId", functionAreaId).executeUpdate();
	}
}
