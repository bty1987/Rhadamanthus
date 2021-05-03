package com.fanglin.data.common.dao.impl;

import java.math.BigInteger;
import java.util.List;

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
	public List<SignetPO> querySignet(int company) {
		return session().createCriteria(SignetPO.class).add(Restrictions.eq(SignetPO.COLUMN_COMPANY_STR, company)).add(Restrictions.ne("status", SignetPO.STATUS_CANCEL_INT)).list();
	}

	@Override
	public int countSignet(String no) {

		String sql = "select count(*) from data.signet where no = :no";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("no", no).uniqueResult();

		return count != null ? count.intValue() : 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {

			for (Filter filter : filters) {
				if ("name".equals(filter.getField())) {
					query.add(query.getCriterion("name", filter));
				}
			}
		}
	}

}
