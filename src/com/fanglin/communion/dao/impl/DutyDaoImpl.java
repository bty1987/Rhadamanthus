package com.fanglin.communion.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.DutyDao;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("dutyDao")
public class DutyDaoImpl extends DaoImpl<DutyPO> implements DutyDao {

	public DutyDaoImpl() {
		super(DutyPO.class);
	}

	@Override
	public List<DutyPO> pageDuty(Paging paging, List<Filter> filters) {

		PagingQuery<DutyPO> query = pagingQuery(paging, DutyPO.class);

		queryFilterExcute(query, filters);

		query.asc("did");

		return query.list();
	}

	@Override
	public List<DutyPO> pageDutyByName(Paging paging, String name, Integer type, Short status) {

		PagingQuery<DutyPO> query = pagingQuery(paging, DutyPO.class);

		if (StringUtils.isNotEmpty(name)) {

			Disjunction pinyinDisjunction = Restrictions.disjunction();

			pinyinDisjunction.add(Restrictions.like("name", name, MatchMode.ANYWHERE));
			pinyinDisjunction.add(Restrictions.like("pinYin", name, MatchMode.ANYWHERE));

			query.add(pinyinDisjunction);
		}

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		if (type != null) {

			query.alias("departmentType", "departmentType");
			query.add(Restrictions.eq("departmentType.dtid", type));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DutyPO> queryDuty() {

		return session().createCriteria(DutyPO.class).add(Restrictions.eq(DutyPO.COLUMN_STATUS_STR, DutyPO.STATUS_INIT_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DutyPO> queryDutyByDtid(Integer dtid) {

		return session().createCriteria(DutyPO.class).add(Restrictions.eq("departmentType.dtid", dtid)).add(Restrictions.eq(DutyPO.COLUMN_STATUS_STR, DutyPO.STATUS_INIT_INT)).list();
	}

	@Override
	public DutyPO queryDutyByName(String name) {
		return (DutyPO) session().createCriteria(DutyPO.class).add(Restrictions.eq(DutyPO.COLUMN_NAME_STR, name)).uniqueResult();
	}

	@Override
	public DutyPO queryDutyByCode(String code) {
		if (code == null || code.trim().isEmpty()) {
			return null;
		}
		return (DutyPO) session().createCriteria(DutyPO.class)
				.add(Restrictions.eq(DutyPO.COLUMN_CODE_STR, code.trim()))
				.uniqueResult();
	}

	@Override
	public String queryMaxDutyCode() {
		String hql = "SELECT MAX(d.code) FROM DutyPO d WHERE d.code LIKE 'D%'";
		return (String) session().createQuery(hql).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion(DutyPO.COLUMN_NAME_STR, data, op));
			} else if ("type".equals(field)) {
				query.alias("departmentType", "departmentType");
				query.add(query.getCriterion(DutyPO.COLUMN_DID_STR, Long.valueOf(data), op));
			}
		}
	}

}
