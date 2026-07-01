package com.fanglin.sales.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.OalesPayDao;
import com.fanglin.sales.po.OalesPayOO;
import com.fanglin.sales.po.OalesPayPO;
import com.fanglin.sales.vo.OalesPayVO;
import com.fanglin.utils.Paging;

@Repository("oalesPayDao")
public class OalesPayDaoImpl extends DaoImpl<OalesPayPO> implements OalesPayDao {

	public OalesPayDaoImpl() {
		super(OalesPayPO.class);
	}

	@Override
	public List<OalesPayOO> pageOalesPay(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<OalesPayOO> query = pagingQuery(paging, OalesPayOO.class);

		query.add(query.getCriterion(OalesPayOO.COLUMN_COMPANY_STR, company, "eq"));

		queryFilterExecute(query, filters);

		query.desc("opid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OalesPayPO> queryOalesPay(OalesPayVO oalesPayVO) {

		return session().createCriteria(OalesPayPO.class).add(Restrictions.eq("oid", oalesPayVO.getOid())).list();

	}

	@Override
	public int countOalesPayByOid(Long oid) {

		String sql = "SELECT count(*) FROM sales.oalesPay where oid=:oid";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("oid", oid).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		OalesDaoImpl.queryFilterExecute(query, filters, "oales");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			// 外销单关联人员
			if ("oales.supplier.userId".equals(field)) {
				query.alias("oales.supplier", "supplier");
				query.add(query.getCriterion("supplier.userId", data, op));
			} else if ("oales.materialer.userId".equals(field)) {
				query.alias("oales.materialer", "materialer");
				query.add(query.getCriterion("materialer.userId", data, op));
			} else if ("oales.servicer.userId".equals(field)) {
				query.alias("oales.servicer", "servicer");
				query.add(query.getCriterion("servicer.userId", data, op));
			} else if ("oales.channer.userId".equals(field)) {
				query.alias("oales.channer", "channer");
				query.add(query.getCriterion("channer.userId", data, op));
			}
			// 付款单本身字段
			else if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("comment".equals(field)) {
				query.add(query.getCriterion("comment", data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("money".equals(field)) {
				query.add(query.getCriterion("money", Long.valueOf(data), op));
			} else if ("creater.userId".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion("creater.userId", data, op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("payTime".equals(field)) {
				query.timeranges("payTime", data);
			}
		}
	}

}
