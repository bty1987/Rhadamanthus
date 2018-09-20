package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.EmemberDao;
import com.fanglin.customer.po.EmemberPO;
import com.fanglin.utils.Paging;

@Repository("ememberDao")
public class EmemberDaoImpl extends DaoImpl<EmemberPO> implements EmemberDao{

	public EmemberDaoImpl(){
		super(EmemberPO.class);
	}
	
	@Override
	public List<EmemberPO> pageEmember(Paging paging, List<Filter> filters) {
		
		PagingQuery<EmemberPO> query = pagingQuery(paging, EmemberPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	
	@Override
	public EmemberPO queryEmenber(String unionId) {
		return (EmemberPO) createCriteria(EmemberPO.class).add(Restrictions.eq(EmemberPO.COLUMN_UNIONID_STR, unionId)).uniqueResult();
	}
	
	
	private void queryFilterExcute(PagingQuery<EmemberPO> query,List<Filter> filters) {
		if(filters != null && filters.size() > 0){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(EmemberPO.COLUMN_NO_STR.equals(field)){
					query.add(query.getCriterion(EmemberPO.COLUMN_NO_STR, data, op));
				}else if(EmemberPO.COLUMN_PHONE_STR.equals(field)){
					query.add(query.getCriterion(EmemberPO.COLUMN_PHONE_STR, data, op));
				}
			}
		}
	}
}
