package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("roleDao")
public class RoleDaoImpl extends DaoImpl<RolePO> implements RoleDao {

	public RoleDaoImpl() {
		super(RolePO.class);
	}

	@Override
	public List<RolePO> pageRole(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<RolePO> query = pagingQuery(paging, RolePO.class);

		queryFilterExcute(query, filters);

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.add(Restrictions.eq("company", company));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RolePO> queryRole(Integer company) {

		Criteria query = session().createCriteria(RolePO.class);

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.add(Restrictions.eq("company", company));
		}

		return query.list();
	}

	@Override
	public List<RolePO> queryRoleByName(Paging paging, String name, Integer company) {

		PagingQuery<RolePO> query = pagingQuery(paging, RolePO.class);

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.add(Restrictions.eq("company", company));
		}

		query.add(Restrictions.or(Restrictions.like("name", name, MatchMode.ANYWHERE), Restrictions.like("pinyin", name, MatchMode.ANYWHERE)));

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			
			
			if ("roleName".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("roleId".equals(field)) {
				query.add(query.getCriterion("rid", Integer.parseInt(data), op));
			} else if ("roleNo".equals(field)) {
				query.add(query.getCriterion("no", data, op));				
			}
		}
	}
}
