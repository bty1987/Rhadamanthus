package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CircleDao;
import com.fanglin.customer.po.CirclePO;
import com.fanglin.utils.Paging;

@Repository("circleDao")
public class CircleDaoImpl extends DaoImpl<CirclePO> implements CircleDao{
	
	public CircleDaoImpl(){
		super(CirclePO.class);
	}

	@Override
	public List<CirclePO> queryDecorationCircleByOrderIds(Paging paging, List<Filter> filters, List<String> orderIds) {
		
		PagingQuery<CirclePO> query = pagingQuery(paging, CirclePO.class);
		
		query.add(Restrictions.in(CirclePO.COLUMN_ORDERID_STR, orderIds));
		
		query.desc("createTime");
		
		return query.list();
	}

	@Override
	public List<CirclePO> queryDecorationCircleByOrderId(Paging paging, List<Filter> filters, String orderId) {
		
		PagingQuery<CirclePO> query = pagingQuery(paging, CirclePO.class);
		
		query.add(Restrictions.eq(CirclePO.COLUMN_ORDERID_STR, orderId));
		
		query.desc("createTime");
		
		return query.list();
		
	}

}
