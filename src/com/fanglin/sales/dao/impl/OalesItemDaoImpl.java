package com.fanglin.sales.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.OalesItemDao;
import com.fanglin.sales.po.OalesItemPO;
import com.fanglin.utils.Paging;

/**
 * 其他销售单项目明细 DAO 实现
 */
@Repository("oalesItemDao")
public class OalesItemDaoImpl extends DaoImpl<OalesItemPO> implements OalesItemDao {

	public OalesItemDaoImpl() {
		super(OalesItemPO.class);
	}

	@Override
	public List<OalesItemPO> pageOalesItem(Paging paging, List<Filter> filters, long oid) throws FLException {

		PagingQuery<OalesItemPO> query = pagingQuery(paging, OalesItemPO.class);

		query.add(query.getCriterion(OalesItemPO.COLUMN_OID_STR, oid, "eq"));

		queryFilterExecute(query, filters);

		query.desc("oiid");

		return query.list();
	}

	@Override
	public List<OalesItemPO> queryOalesItem(long oid) {
		return session().createCriteria(OalesItemPO.class)
				.add(Restrictions.eq("oid", oid))
				.list();
	}

	@Override
	public Long amountOalesItem(long oid) {
		String hql = "SELECT COALESCE(SUM(i.total), 0) FROM OalesItemPO i WHERE i.oid = :oid";
		BigDecimal result = (BigDecimal) session().createQuery(hql)
				.setLong("oid", oid)
				.uniqueResult();
		return result != null ? result.longValue() : 0L;
	}
}
