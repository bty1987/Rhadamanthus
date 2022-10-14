/**
 * @File Name		: OperationDaoImpl.java
 * @Package   	: com.fanglin.system.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-4-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.OperationDao;
import com.fanglin.system.po.OperationPO;
import com.fanglin.utils.Paging;

@Repository("operationDao")
public class OperationDaoImpl extends DaoImpl<OperationPO> implements OperationDao {

	public OperationDaoImpl() {
		super(OperationPO.class);
	}

	@Override
	public List<OperationPO> pageOperation(Paging paging, List<Filter> filters) {

		PagingQuery<OperationPO> query = pagingQuery(paging, OperationPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OperationPO> queryOperation() {
		return session().createCriteria(OperationPO.class).add(Restrictions.eq(OperationPO.COLUMN_STATUS_STR, OperationPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public OperationPO queryOperationByOperation(String operation) {
		return (OperationPO) session().createCriteria(OperationPO.class).add(Restrictions.eq(OperationPO.COLUMN_OPERATION_STR, operation)).add(Restrictions.eq(OperationPO.COLUMN_STATUS_STR, OperationPO.STATUS_ENABLE_INT)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("operationName".equals(field)) {
					query.add(query.getCriterion("name", String.valueOf(data), op));
				} else if ("operation".equals(field)) {
					query.add(query.getCriterion("operation", String.valueOf(data), op));
				} else if ("operationType".equals(field)) {
					query.add(query.getCriterion("type", Short.valueOf(data), op));
				}
			}
		}
	}

}
