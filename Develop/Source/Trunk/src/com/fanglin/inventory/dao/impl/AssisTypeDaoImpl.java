package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.AssisTypeDao;
import com.fanglin.inventory.po.AssisTypePO;
import com.fanglin.utils.Paging;

@Repository("assistypeDao")
public class AssisTypeDaoImpl extends DaoImpl<AssisTypePO> implements AssisTypeDao{
	
	public AssisTypeDaoImpl(){
		super(AssisTypePO.class);
	}
	
	@Override
	public List<AssisTypePO> pageAssisType(Paging paging, List<Filter> filters) {
		
		PagingQuery<AssisTypePO> query = pagingQuery(paging, AssisTypePO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<AssisTypePO> queryAssisType() {
		return session().createCriteria(AssisTypePO.class).list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<AssisTypePO> queryAssisTypeByWtid(int wtid) {
		return session().createCriteria(AssisTypePO.class).add(Restrictions.eq(AssisTypePO.COLUMN_WORKTYPE_ID_STR, wtid)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("workType", "workType");
				
				if("workTypeName".equals(field)){
					query.add(query.getCriterion(AssisTypePO.COLUMN_WORKTYPE_NAME_STR, data, op));
				}
			}
		}
	}
	
}
