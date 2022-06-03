/**
 * @File Name		: StorehouseDaoImpl.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.StorehouseDao;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.utils.Paging;

@Repository("storehouseDao")
public class StorehouseDaoImpl extends DaoImpl<StorehousePO> implements StorehouseDao {

	public StorehouseDaoImpl() {
		super(StorehousePO.class);
	}

	@Override
	public List<StorehousePO> pageStorehouse(Paging paging, List<Filter> filters) {

		PagingQuery<StorehousePO> query = pagingQuery(paging, StorehousePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<StorehousePO> queryStorehouse() {
		return session().createCriteria(StorehousePO.class).add(Restrictions.eq(StorehousePO.COLUMN_STATUS_STR, StorehousePO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public StorehousePO queryStroehouseByCode(String code) {
		return (StorehousePO) session().createCriteria(StorehousePO.class).add(Restrictions.eq(StorehousePO.COLUMN_STATUS_STR, StorehousePO.STATUS_ENABLE_INT)).add(Restrictions.eq(StorehousePO.COLUMN_CODE_STR, code)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if (StorehousePO.COLUMN_NAME_STR.equals(field)) {
					query.add(query.getCriterion(StorehousePO.COLUMN_NAME_STR, data, op));
				} else if (StorehousePO.COLUMN_CODE_STR.equals(field)) {
					query.add(query.getCriterion(StorehousePO.COLUMN_CODE_STR, data, op));
				} else if (field.equals("status")) {
					query.add(query.getCriterion("status", Short.parseShort(data), op));
				}

			}
		}
	}

}
