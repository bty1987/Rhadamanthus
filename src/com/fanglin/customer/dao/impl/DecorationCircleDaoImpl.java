package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationCircleDao;
import com.fanglin.customer.po.DecorationCirclePO;
import com.fanglin.utils.Paging;

@Repository("decorationCircleDao")
public class DecorationCircleDaoImpl extends DaoImpl<DecorationCirclePO> implements DecorationCircleDao{
	
	public DecorationCircleDaoImpl(){
		super(DecorationCirclePO.class);
	}

	@Override
	public List<DecorationCirclePO> queryDecorationCircleByOrderIds(Paging paging, List<Filter> filters, List<String> orderIds) {
		
		PagingQuery<DecorationCirclePO> query = pagingQuery(paging, DecorationCirclePO.class);
		
		query.add(Restrictions.in(DecorationCirclePO.COLUMN_ORDERID_STR, orderIds));
		
		query.desc("createTime");
		
		return query.list();
	}

	@Override
	public List<DecorationCirclePO> queryDecorationCircleByOrderId(Paging paging, List<Filter> filters, String orderId) {
		
		PagingQuery<DecorationCirclePO> query = pagingQuery(paging, DecorationCirclePO.class);
		
		query.add(Restrictions.eq(DecorationCirclePO.COLUMN_ORDERID_STR, orderId));
		
		query.desc("createTime");
		
		return query.list();
		
	}

}
