/**
 * Title: PaymentDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.payment.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("paymentDao")
public class PaymentDaoImpl extends DaoImpl<PaymentPO> implements PaymentDao {

	public PaymentDaoImpl(){
		super(PaymentPO.class);
	}

	@Override
	public List<PaymentPO> pagePaymentForHistory(Paging paging, List<FilterVO> filters){

		PagingQuery<PaymentPO> query = pagingQuery(paging, PaymentPO.class);
		
		queryFilterExcute(query, filters);

		return query.list();
	}
	
	@Override
	public List<PaymentPO> queryPayment(List<FilterVO> filters) {
		
		PagingQuery<PaymentPO> query = pagingQuery(new Paging(), PaymentPO.class);
		
		queryFilterExcute(query, filters);
		query.notPaging();
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentPO> queryPaymentByOrderId(String orderId) {
		return session().createCriteria(PaymentPO.class).add(Restrictions.eq("orderId", orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentPO> queryPaymentByReceiptId(long arId) {
		return session().createCriteria(PaymentPO.class).createAlias("advanceReceipt", "advanceReceipt").add(Restrictions.eq("advanceReceipt.arId", arId)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		if(filters != null){
			
			query.alias("customer", "customer");
			query.alias("advanceReceipt", "advanceReceipt");
			
			for(FilterVO filter: filters){
				if("customerId".equals(filter.getField())){
					query.add(query.getCriterion("customer.customerId", filter));
				} else if("customerName".equals(filter.getField())){
					query.add(query.getCriterion("customer.customerName", filter));
				} else if("customerPhone".equals(filter.getField())){
					query.add(query.getCriterion("customer.phone", filter));
				} else if("collectTimeDateRange".equals(filter.getField())){
					
					String sTime = filter.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = filter.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion("advanceReceipt.collectTime", eTimestamp, "le"));
					query.add(query.getCriterion("advanceReceipt.collectTime", sTimestamp, "ge"));
				} else if("status".equals(filter.getField())){
					query.add(query.getCriterion("status", filter));
				}
			}
		}
	}

}
