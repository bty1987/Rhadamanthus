package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Paging;

@Repository("systemConfigDao")
public class SystemConfigDaoImpl extends DaoImpl<SystemConfigPO> implements SystemConfigDao {

	public SystemConfigDaoImpl() {
		super(SystemConfigPO.class);
	}

	@Override
	public List<SystemConfigPO> pageSystemConfig(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<SystemConfigPO> query = pagingQuery(paging, SystemConfigPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public SystemConfigPO querySystemConfig(String key) {
		return (SystemConfigPO) createCriteria(SystemConfigPO.class).add(Restrictions.eq(SystemConfigPO.COLUMN_KEY_STR, key)).uniqueResult();
	}

	@Override
	public SystemConfigPO querySystemConfig(String key, int company) {
		return (SystemConfigPO) createCriteria(SystemConfigPO.class).add(Restrictions.eq(SystemConfigPO.COLUMN_KEY_STR, key)).add(Restrictions.eq(SystemConfigPO.COLUMN_COMPANY_STR, company)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SystemConfigPO> obtainSystemConfig(String key, int company) {
		return createCriteria(SystemConfigPO.class).add(Restrictions.eq(SystemConfigPO.COLUMN_KEY_STR, key)).add(Restrictions.eq(SystemConfigPO.COLUMN_COMPANY_STR, company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SystemConfigPO> querySystemConfigByCid(Integer company) {
		return session().createCriteria(SystemConfigPO.class).add(Restrictions.eq("company", company)).list();
	}

	@Override
	public SystemConfigPO querySystemConfigById(long scid) {
		return (SystemConfigPO) createCriteria(SystemConfigPO.class).add(Restrictions.eq(SystemConfigPO.COLUMN_SCID_STR, scid)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) {
			return;
		}

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("key".equals(field)) {
				query.add(Restrictions.like("key", data, MatchMode.ANYWHERE));
			} else if ("company".equals(field)) {
				query.getCriterion(field, CompanyServiceImpl.decode(filter.getData()), op);
			}
		}

	}
}
