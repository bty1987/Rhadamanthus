package com.fanglin.sales.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesItemPO;

@Repository("salesItemDao")
public class SalesItemDaoImpl extends DaoImpl<SalesItemPO> implements SalesItemDao {

	public SalesItemDaoImpl() {
		super(SalesItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesItemPO> querySalesItemBySid(long sid) {
		return (List<SalesItemPO>) createCriteria(SalesItemPO.class).add(Restrictions.eq(SalesItemPO.COLUMN_SID_STR, sid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesItemPO> querySalesItemBySids(List<Long> sids) {
		return session().createCriteria(SalesItemPO.class).add(Restrictions.in(SalesItemPO.COLUMN_SID_STR, sids)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesItemPO> querySalesItemByPsiid(long psiid) {
		return session().createCriteria(SalesItemPO.class).add(Restrictions.eq("psiid", psiid)).list();
	}

	@Override
	public int countSalesItem(long sid) {

		String sql = "SELECT count(*) FROM sales.salesitem where sid=:sid";
		BigInteger num = (BigInteger) session().createSQLQuery(sql).setLong("sid", sid).uniqueResult();
		return num.intValue();
	}

	@Override
	public long amountSalesItem(long sid) {

		String sql = "SELECT SUM(sales.salesitem.total) FROM sales.salesitem where sid=:sid and psiid = 0";

		BigDecimal sum = (BigDecimal) session().createSQLQuery(sql).setLong("sid", sid).uniqueResult();

		if (sum == null) {
			sum = BigDecimal.ZERO;
		}

		return sum.longValue();
	}

	@Override
	public int deleteSalesItemByPsiid(long psiid) {

		String sql = "delete from sales.salesitem where psiid = :psiid";
		session().createSQLQuery(sql).setLong("psiid", psiid).executeUpdate();

		return 0;
	}

}
