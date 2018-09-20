package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.ServicePaymentDao;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.utils.Paging;

@Repository("servicePaymentOrderDao")
public class ServicePaymentDaoImpl extends DaoImpl<ServicePaymentPO> implements ServicePaymentDao {

	@Override
	public List<ServicePaymentPO> queryCusServicePayment(Paging paging, List<Filter> filters, String orderId) {
		
		PagingQuery<ServicePaymentPO> query = pagingQuery(paging, ServicePaymentPO.class);
		
		query.alias("decoration", "decoration");
		
		query.add(Restrictions.eq("decoration.orderId", orderId));
		
		query.desc("createTime");

		return query.list();
	}

	
}
