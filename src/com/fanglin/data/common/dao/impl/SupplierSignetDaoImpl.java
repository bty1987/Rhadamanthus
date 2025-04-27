package com.fanglin.data.common.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.SupplierSignetDao;
import com.fanglin.data.po.SupplierSignetPO;
import com.fanglin.utils.Paging;

@Repository("supplierSignetDao")
public class SupplierSignetDaoImpl extends DaoImpl<SupplierSignetPO> implements SupplierSignetDao {

	public SupplierSignetDaoImpl() {
		super(SupplierSignetPO.class);
	}

	@Override
	public List<SupplierSignetPO> pageSupplierSignet(Paging paging, List<Filter> filters, int company, long suid) {

		PagingQuery<SupplierSignetPO> query = pagingQuery(paging, SupplierSignetPO.class);

		query.add(Restrictions.eq(SupplierSignetPO.COLUMN_COMPANY_STR, company));
		query.add(Restrictions.eq(SupplierSignetPO.COLUMN_SUID_STR, suid));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SupplierSignetPO> querySupplierSignet(Short type, long suid, int company) {

		Criteria query = session().createCriteria(SupplierSignetPO.class);

		query.add(Restrictions.eq(SupplierSignetPO.COLUMN_COMPANY_STR, company));
		query.add(Restrictions.eq(SupplierSignetPO.COLUMN_SUID_STR, suid));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.add(Restrictions.ne("status", SupplierSignetPO.STATUS_CANCEL_INT)).list();
	}

	@Override
	public int countSupplierSignet(String no) {

		String sql = "select count(*) from data.supplierSignet where no = :no";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("no", no).uniqueResult();

		return count != null ? count.intValue() : 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", filter));
			} else if ("type".equals((field))) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("status".equals((field))) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			}
		}
	}

}
