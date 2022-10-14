/**
 * @FileName	: OrganizationDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */

package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.OrganizationDao;
import com.fanglin.system.po.OrganizationPO;
import com.fanglin.utils.Paging;

@Repository("organizationDao")
public class OrganizationDaoImpl extends DaoImpl<OrganizationPO> implements OrganizationDao {

	public OrganizationDaoImpl() {
		super(OrganizationPO.class);
	}

	@Override
	public List<OrganizationPO> pageOrganization(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<OrganizationPO> query = pagingQuery(paging, OrganizationPO.class);

		if (company != null) {
			query.add(Restrictions.eq("company", company));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OrganizationPO> queryOrganization(String name, Integer company) {

		Criteria query = session().createCriteria(OrganizationPO.class);

		if (company != null) {
			query.add(Restrictions.eq("company", company));
		}

		query.add(Restrictions.like("name", name, MatchMode.ANYWHERE)).add(Restrictions.eq(OrganizationPO.COLUMN_STATUS_STR, OrganizationPO.STATUS_ENABLE_INT));

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (OrganizationPO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (OrganizationPO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}
