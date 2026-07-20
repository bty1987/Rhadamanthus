/**
 * Title: DepartmentDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("departmentDaoImpl")
public class DepartmentDaoImpl extends DaoImpl<DepartmentPO> implements DepartmentDao {

	public DepartmentDaoImpl() {
		super(DepartmentPO.class);
	}

	@Override
	public List<DepartmentPO> pageDepartment(Paging paging, List<Filter> filters, Integer type, int company) {

		PagingQuery<DepartmentPO> query = pagingQuery(paging, DepartmentPO.class);

		query.add(Restrictions.eq("company", company));

		if (type != null) {
			query.alias("type", "type").add(Restrictions.eq(DepartmentPO.COLUMN_TYPE_STR, type));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<DepartmentPO> pageDepartmentByName(Paging paging, String name, Integer type, Integer company) {

		PagingQuery<DepartmentPO> query = pagingQuery(paging, DepartmentPO.class);

		query.add(Restrictions.or(Restrictions.ilike(DepartmentPO.COLUMN_DEPTNAME_STR, name, MatchMode.ANYWHERE), Restrictions.ilike(DepartmentPO.COLUMN_PINYIN_STR, name, MatchMode.ANYWHERE)));

		query.add(Restrictions.eq(DepartmentPO.COLUMN_STATUS_STR, DepartmentPO.STATUS_ENABLE_INT));

		if (company != null) {
			query.add(Restrictions.eq(DepartmentPO.COLUMN_COMPANY_STR, company));
		}

		if (type != null) {
			query.alias("type", "type").add(Restrictions.eq(DepartmentPO.COLUMN_TYPE_STR, type));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DepartmentPO> queryDepartment(Integer type, Integer fdid, Integer company) {

		Criteria criteria = session().createCriteria(DepartmentPO.class);

		criteria.add(Restrictions.eq(DepartmentPO.COLUMN_STATUS_STR, DepartmentPO.STATUS_ENABLE_INT));

		if (type != null) {
			criteria.createAlias("type", "type").add(Restrictions.eq("type.dtid", type));
		}

		if (fdid != null) {
			criteria.createAlias("fatherDept", "fatherDept").add(Restrictions.eq("fatherDept.did", fdid));
		}

		if (company != null) {
			criteria.add(Restrictions.eq("company", company));
		}

		criteria.addOrder(Order.asc("did"));

		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DepartmentPO> queryDepartment(Integer did) {
		return session().createCriteria(DepartmentPO.class).createAlias("fatherDept", "fatherDept").add(Restrictions.eq("fatherDept.did", did)).list();
	}

	@Override
	public DepartmentPO queryDepartmentByNo(String no) {

		return (DepartmentPO) session().createCriteria(DepartmentPO.class).add(Restrictions.eq("no", no)).setMaxResults(1).uniqueResult();
	}

	@Override
	public DepartmentPO queryDepartment(String name, Integer companyId) {
		return (DepartmentPO) session().createCriteria(DepartmentPO.class).add(Restrictions.eq("name", name)).add(Restrictions.eq("company", companyId)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("deptType".equals(field)) {
				query.alias("type", "type").add(query.getCriterion("type.dtid", Integer.valueOf(data), op));
			} else if ("deptName".equals(field)) {
				query.add(query.getCriterion("did", Integer.valueOf(data), op));
			} else if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("isdet".equals(field)) {
				query.add(query.getCriterion("isdet", Short.valueOf(data), op));
			} else if ("company".equals(field)) {
				query.add(query.getCriterion("company", Integer.valueOf(data), op));
			}
		}
	}

}
