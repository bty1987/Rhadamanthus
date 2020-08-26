package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.ConsultionPO;
import com.fanglin.customer.dao.ConsultionDao;
import com.fanglin.utils.Paging;

@Repository("consultionDao")
public class ConsultionDaoImpl extends DaoImpl<ConsultionPO> implements ConsultionDao{
	
	public ConsultionDaoImpl(){
		super(ConsultionPO.class);
	}

	@Override
	public List<ConsultionPO> pageConsultion(Paging paging, List<Filter> filters) {
		
		PagingQuery<ConsultionPO> query = pagingQuery(paging, ConsultionPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConsultionPO> queryConsultionByOrderId(String orderId) {
		return session().createCriteria(ConsultionPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null && filters.size() > 0){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(ConsultionPO.COLUMN_DECORATION_ORDERID_STR.equals(field)){
					query.add(query.getCriterion(field, data, op));
				}else if(ConsultionPO.COLUMN_CREATER_UID_STR.equals(field)){
					query.add(query.getCriterion(field, Integer.valueOf(data), op));
				}
			}
		}
	}
}
