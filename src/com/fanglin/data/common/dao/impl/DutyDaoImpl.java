package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DutyDao;
import com.fanglin.data.po.DutyPO;
import com.fanglin.utils.Paging;

@Repository("dutyDao")
public class DutyDaoImpl extends DaoImpl<DutyPO> implements DutyDao {

	public DutyDaoImpl() {
		super(DutyPO.class);
	}

	@Override
	public List<DutyPO> pageDuty(Paging paging, List<Filter> filters) {
		
		PagingQuery<DutyPO> query = pagingQuery(paging, DutyPO.class);

		if (filters != null) {
			for (Filter filter : filters) {
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
			
				if (DutyPO.COLUMN_NAME_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				}
			}
		}

		query.asc("did");

		return query.list();
	}

	@Override
	public DutyPO queryDutyByName(String name) {
	
		return  (DutyPO)session().createCriteria(DutyPO.class).add(Restrictions.eq(DutyPO.COLUMN_NAME_STR, name)).uniqueResult();

	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DutyPO> queryDuty() {

		return session().createCriteria(DutyPO.class).add(Restrictions.eq(DutyPO.COLUMN_STATUS_STR,DutyPO.COLUMN_STATUS_INT)).list();
	}
	
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DutyPO> queryDutyByDtid(Integer dtid) {
		
		return session().createCriteria(DutyPO.class).add(Restrictions.eq("departmentType.dtid", dtid)).add(Restrictions.eq(DutyPO.COLUMN_STATUS_STR,DutyPO.COLUMN_STATUS_INT)).list();
	}
	
}
