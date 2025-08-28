package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Paging;

@Repository("companyDao")
public class CompanyDaoImpl extends DaoImpl<CompanyPO> implements CompanyDao {

	public CompanyDaoImpl() {
		super(CompanyPO.class);
	}

	@Override
	public List<CompanyPO> pageCompany(Paging paging, List<Filter> filters) {

		PagingQuery<CompanyPO> query = pagingQuery(paging, CompanyPO.class);

		queryFilterExcute(query, filters);

		query.asc("cid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CompanyPO> queryCompany(Short atttype, String code) {

		Criteria query = session().createCriteria(CompanyPO.class);

		if (atttype != null) {
			query.add(Restrictions.eq("atttype", atttype));
		}

		if (code != null) {
			query.add(Restrictions.eq("code", code));
		}

		query.add(Restrictions.eq(CompanyPO.COLUMN_STATUS_STR, CompanyPO.STATUS_ENABLE_INT));

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CompanyPO> queryCompanyByIds(List<Integer> ids) {
		return session().createCriteria(CompanyPO.class).add(Restrictions.in("cid", ids)).list();
	}

	@Override
	public CompanyPO queryCompanyByName(String name) {
		return (CompanyPO) session().createCriteria(CompanyPO.class).add(Restrictions.eq(CompanyPO.COLUMN_NAME_STR, name)).uniqueResult();
	}

	@Override
	public CompanyPO queryCompanyByNo(int no) {
		return (CompanyPO) session().createCriteria(CompanyPO.class).add(Restrictions.eq(CompanyPO.COLUMN_NO_STR, no)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("atttype".equals(filter.getField())) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}
