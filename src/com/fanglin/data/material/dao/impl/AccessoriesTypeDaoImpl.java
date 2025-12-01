package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.AccessoriesTypeDao;
import com.fanglin.data.po.AccessoriesTypePO;
import com.fanglin.utils.Paging;

@Repository("accessoriesTypeDao")
public class AccessoriesTypeDaoImpl extends DaoImpl<AccessoriesTypePO> implements AccessoriesTypeDao {

	public AccessoriesTypeDaoImpl() {
		super(AccessoriesTypePO.class);
	}

	@Override
	public List<AccessoriesTypePO> pageAccessoriesType(Paging paging, List<Filter> filters) {

		PagingQuery<AccessoriesTypePO> query = pagingQuery(paging, AccessoriesTypePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<AccessoriesTypePO> queryAccessoriesType() {
		return session().createCriteria(AccessoriesTypePO.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<AccessoriesTypePO> queryAccessoriesTypeByWtid(int wtid) {
		return session().createCriteria(AccessoriesTypePO.class).add(Restrictions.eq(AccessoriesTypePO.COLUMN_WORKTYPE_ID_STR, wtid)).list();
	}

	@Override
	public AccessoriesTypePO queryAccessoriesTypeByName(String name) {

		return (AccessoriesTypePO) session().createCriteria(AccessoriesTypePO.class).add(Restrictions.eq(AccessoriesTypePO.COLUMN_NAME_STR, name)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				query.alias("workType", "workType");

				if ("workTypeName".equals(field)) {
					query.add(query.getCriterion(AccessoriesTypePO.COLUMN_WORKTYPE_NAME_STR, data, op));
				} else if (AccessoriesTypePO.COLUMN_TYPE_STR.equals(field)) {
					query.add(query.getCriterion(AccessoriesTypePO.COLUMN_TYPE_STR, Short.parseShort(data), op));
				}
			}
		}
	}

}
