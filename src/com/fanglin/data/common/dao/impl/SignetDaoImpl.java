package com.fanglin.data.common.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.SignetDao;
import com.fanglin.data.po.SignetPO;
import com.fanglin.utils.Paging;

@Repository("signetDao")
public class SignetDaoImpl extends DaoImpl<SignetPO> implements SignetDao {

	public SignetDaoImpl() {
		super(SignetPO.class);
	}

	@Override
	public List<SignetPO> pageSignet(Paging paging, List<Filter> filters, int company) {

		PagingQuery<SignetPO> query = pagingQuery(paging, SignetPO.class);

		query.add(Restrictions.eq(SignetPO.COLUMN_COMPANY_STR, company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SignetPO> querySignet(Short type, int company) {

		Criteria query = session().createCriteria(SignetPO.class);

		query.add(Restrictions.eq(SignetPO.COLUMN_COMPANY_STR, company));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.add(Restrictions.ne("status", SignetPO.STATUS_CANCEL_INT)).list();
	}

	@Override
	public int countSignet(String no) {

		String sql = "select count(*) from data.signet where no = :no";
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
