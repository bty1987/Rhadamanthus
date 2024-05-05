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
	public List<OalesPayOO> pageOalesPay(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<OalesPayOO> query = pagingQuery(paging, OalesPayOO.class);

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

			if ("payTime".equals(field)) {
				query.timeranges("payTime", data);
			}
		}
	}

}
