package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.utils.Paging;

@Repository("SalesPaymentOrderDao")
public class SalesPaymentDaoImpl extends DaoImpl<SalesPaymentPO> implements SalesPaymentDao {
	
	public SalesPaymentDaoImpl(){
		super(SalesPaymentPO.class);
	}

	@Override
	public List<SalesPaymentPO> queryCusSalesPayment(Paging paging, List<Filter> filters,String orderId) {

		PagingQuery<SalesPaymentPO> query = pagingQuery(paging, SalesPaymentPO.class);
		
		query.alias("sales", "sales");
		
		query.add(Restrictions.eq("sales.orderId", orderId));
		
		query.desc("createTime");
		
		return query.list();
	}

}
