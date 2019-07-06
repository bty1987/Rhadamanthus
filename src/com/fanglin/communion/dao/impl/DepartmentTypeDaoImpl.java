package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.DepartmentTypeDao;
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("departmentTypeDao")
public class DepartmentTypeDaoImpl extends DaoImpl<DepartmentTypePO> implements DepartmentTypeDao {

	public DepartmentTypeDaoImpl() {
		super(DepartmentTypePO.class);
	}

	@Override
	public List<DepartmentTypePO> pageDepartmentType(Paging paging, List<Filter> filters) {

		PagingQuery<DepartmentTypePO> query = pagingQuery(paging, DepartmentTypePO.class);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DepartmentTypePO> queryDepartmentType() {
		return session().createCriteria(DepartmentTypePO.class).list();
	}

	@Override
	public DepartmentTypePO queryDepartmentTypeByName(String name) {
		return (DepartmentTypePO) session().createCriteria(DepartmentTypePO.class).add(Restrictions.eq("name", name)).uniqueResult();
	}

}
