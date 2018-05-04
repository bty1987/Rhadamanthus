package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.VustomerDao;
import com.fanglin.communion.po.VustomerPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("vustomerDao")
public class VustomerDaoImpl extends DaoImpl<VustomerPO> implements VustomerDao{
	
	public VustomerDaoImpl(){
		super(VustomerPO.class);
	}

	@Override
	public List<VustomerPO> pageVustomer(Paging paging, List<Filter> filters) {
		
		PagingQuery<VustomerPO> query = pagingQuery(paging, VustomerPO.class);

		queryFilterExcute(query, filters);
		
		query.desc("vid");

		return query.list();
		
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<VustomerPO> queryVustomer() {
		return session().createCriteria(VustomerPO.class).add(Restrictions.eq(VustomerPO.COLUMN_STATUS_STR, VustomerPO.STATUS_INIT_INT)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<VustomerPO> queryVustomerByIdent(String ident) {
		return session().createCriteria(VustomerPO.class).add(Restrictions.eq(VustomerPO.COLUMN_IDENT_STR, ident)).add(Restrictions.eq(VustomerPO.COLUMN_STATUS_STR, VustomerPO.STATUS_INIT_INT)).list();
	}
	
	public void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(VustomerPO.COLUMN_NAME_STR.equals(field)){
					query.add(query.getCriterion(VustomerPO.COLUMN_NAME_STR, data, op));
				}else if(VustomerPO.COLUMN_PHONE_STR.equals(field)){
					query.add(query.getCriterion(VustomerPO.COLUMN_PHONE_STR, data, op));
				}else if(VustomerPO.COLUMN_ORDERID_STR.equals(field)){
					query.add(query.getCriterion(VustomerPO.COLUMN_ORDERID_STR, data, op));
				}
				
			}
		}
		
	}

}
