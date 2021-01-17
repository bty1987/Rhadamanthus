/**
 * Title: PaymentDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.utils.Paging;

@Repository("paymentDao")
public class PaymentDaoImpl extends DaoImpl<PaymentPO> implements PaymentDao {

	public PaymentDaoImpl(){
		super(PaymentPO.class);
	}

	@Override
	public List<PaymentPO> pagePayment(Paging paging, List<Filter> filters, int company){

		PagingQuery<PaymentPO> query = pagingQuery(paging, PaymentPO.class);
		
		queryFilterExcute(query, filters);

		return query.list();
	}
	
	@Override
	public List<PaymentPO> queryPayment(List<Filter> filters) {
		
		PagingQuery<PaymentPO> query = pagingQuery(new Paging(), PaymentPO.class);
		
		queryFilterExcute(query, filters);
		query.notPaging();
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<PaymentPO> queryPaymentByOrderId(String orderId) {
		return session().createCriteria(PaymentPO.class).add(Restrictions.eq("orderId", String.valueOf(orderId))).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentPO> queryPaymentByReceiptId(long arId) {
		return session().createCriteria(PaymentPO.class).createAlias("advanceReceipt", "advanceReceipt").add(Restrictions.eq("advanceReceipt.arId", arId)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			
			query.alias("customer", "customer");
			query.alias("advanceReceipt", "advanceReceipt");
			
			for(Filter filter: filters){
				
				if("customerId".equals(filter.getField())){
					query.add(query.getCriterion("customer.no", filter));
				} else if("customerName".equals(filter.getField())){
					query.add(query.getCriterion("customer.customerName", filter));
				} else if("orderId".equals(filter.getField())){
					query.add(query.getCriterion("orderId", filter));
				} else if("collectTime".equals(filter.getField())){
					query.timeranges("advanceReceipt.collectTime", "advanceReceipt.collectTime", filter.getData());
				} else if("status".equals(filter.getField())){
					query.add(query.getCriterion("status", Short.valueOf(filter.getData()), filter.getOp()));
				}
			}
		}
	}

}
