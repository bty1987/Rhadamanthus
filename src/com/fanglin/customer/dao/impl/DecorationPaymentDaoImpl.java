package com.fanglin.customer.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.utils.Paging;

@Repository("decorationPaymentOrderDao")
public class DecorationPaymentDaoImpl extends DaoImpl<DecorationPaymentPO> implements DecorationPaymentDao {

	public DecorationPaymentDaoImpl(){
		super(DecorationPaymentPO.class);
	}
	
	@Override
	public List<DecorationPaymentPO> queryCusDecorationPayment(Paging paging, List<Filter> filters,  String orderId) {
		
		PagingQuery<DecorationPaymentPO> query = pagingQuery(paging, DecorationPaymentPO.class);

		query.alias("decoration", "decoration");
		
		query.add(query.getCriterion("decoration.orderId", orderId, "eq"));
		
		query.desc("createTime");
		
		return query.list();
	}


}
