package com.fanglin.customer.dao.impl;

import java.math.BigDecimal;
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

	@Override
	public Float countCusSalesPaymentForAmount(String orderId) {
		
		String sql="select sum(IF(payment.salespayment.type in (4,5,6,7),-payment.salespayment.referMoney,payment.salespayment.referMoney)) money from payment.salespayment,sales.sales where sales.sales.sid = payment.salespayment.sid and payment.salespayment.`status` in (1,2) and sales.sales.orderId = :orderId";
		
		BigDecimal total = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).setString("orderId", orderId).uniqueResult();
		
		if(total==null){
			total = BigDecimal.ZERO;
		}
		
		return total.floatValue();
	}

}
