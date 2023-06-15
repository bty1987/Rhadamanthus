/**
 * @File Name	: ReworkDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ReworkDao;
import com.fanglin.construction.po.ReworkPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("reworkDao")
public class ReworkDaoImpl extends DaoImpl<ReworkPO> implements ReworkDao {

	public ReworkDaoImpl() {
		super(ReworkPO.class);
	}

	@Override
	public List<ReworkPO> pageRework(Paging paging, List<Filter> filters) {

		PagingQuery<ReworkPO> query = pagingQuery(paging, ReworkPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<ReworkPO> pageReworkByOrderId(Paging paging, List<Filter> filters, String orderId) {

		PagingQuery<ReworkPO> query = pagingQuery(paging, ReworkPO.class);

		query.add(query.getCriterion(ReworkPO.COLUMN_ORDERID_STR, orderId, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			query.add(query.getCriterion(field, data, op));
		}

	}

}
