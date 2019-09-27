package com.fanglin.sales.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesItemPO;

@Repository("salesItemDao")
public class SalesItemDaoImpl extends DaoImpl<SalesItemPO> implements SalesItemDao {
	
	public SalesItemDaoImpl(){
		super(SalesItemPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesItemPO> querySalesItemBySid(long sid) {
		return (List<SalesItemPO>) createCriteria(SalesItemPO.class).add(Restrictions.eq(SalesItemPO.COLUMN_SID_STR, sid)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesItemPO> querySalesItemBySids(List<Long> sids) {
		
		return session().createCriteria(SalesItemPO.class).add(Restrictions.in(SalesItemPO.COLUMN_SID_STR, sids)).list();
		
	}

	@Override
	public Long countSalesItemForAmount(long sid) {
		
		String sql="SELECT SUM(sales.salesitem.total) FROM sales.salesitem where sid=:sid";
		
		BigDecimal sum=(BigDecimal) session().createSQLQuery(sql).setLong("sid", sid).uniqueResult();
		
		if (sum == null) {
			sum = BigDecimal.ZERO;
		}
		
		return sum.longValue();
	}

}
