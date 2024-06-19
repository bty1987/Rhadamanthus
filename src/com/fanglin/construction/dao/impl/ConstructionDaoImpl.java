/**
 * @File Name	: ConstructionDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.utils.Paging;

@Repository("constructionDao")
public class ConstructionDaoImpl extends DaoImpl<ConstructionPO> implements ConstructionDao {

	public ConstructionDaoImpl() {
		super(ConstructionPO.class);
	}

	@Override
	public List<ConstructionPO> pageConstruction(Paging paging, List<Filter> filters, Integer company) throws FLException {

		PagingQuery<ConstructionPO> query = pagingQuery(paging, ConstructionPO.class);

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("cid");

		return query.list();
	}

	@Override
	public List<ConstructionPO> pageConstructionForSupervision(Paging paging, List<Filter> filters, int suid) throws FLException {

		PagingQuery<ConstructionPO> query = pagingQuery(paging, ConstructionPO.class);

		query.alias("supervisor", "supervisor").add(query.getCriterion("supervisor.uid", suid, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public ConstructionPO queryConstructionByOrderId(String orderId) {
		return (ConstructionPO) session().createCriteria(ConstructionPO.class).add(Restrictions.eq(ConstructionPO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public ConstructionPO queryConstructionByCid(long cid) {
		return (ConstructionPO) session().createCriteria(ConstructionPO.class).add(Restrictions.eq(ConstructionPO.COLUMN_CID_STR, cid)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {
		queryFilterExcute(query, filters, "");
	}

	public static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;

		if (prefix == null) {
			prefix = "";
		}

		if (!"".equals(prefix)) {

			query.alias(prefix, prefix);
			prefix = String.format("%s.", prefix);
		}

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.contains("cnid")) {
				query.add(query.getCriterion("cnid", Long.valueOf(data), op));
			}

			if ("construction.schedule".equals(field)) {
				query.add(query.getCriterion("schedule", Short.parseShort(data), op));
			} else if ("construction.status".equals(field)) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			}
		}
	}
}
