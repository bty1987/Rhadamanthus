package com.fanglin.customer.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.MaterialPaymentDao;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.utils.Paging;

@Repository("materialPaymentOrderDao")
public class MaterialPaymentDaoImpl extends DaoImpl<MaterialPaymentPO> implements MaterialPaymentDao {
	
	public MaterialPaymentDaoImpl(){
		super(MaterialPaymentPO.class);
	}

	@Override
	public List<MaterialPaymentPO> queryCusMaterialByOrderId(Paging paging, List<Filter> filters, String orderId) {
		
		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging,MaterialPaymentPO.class);
		
		query.alias("material", "material");

		query.add(Restrictions.eq("material.orderId", orderId));
		
		query.desc("createTime");
		
		return query.list();
	}

	@Override
	public Float countCusMaterialPaymentForAmount(String orderId) {
		
		String sql="select sum(IF(payment.materialpayment.paymentType in (4,5,6,7),-payment.materialpayment.referMoney,payment.materialpayment.referMoney)) money from payment.materialpayment,material.material where material.material.mid = payment.materialpayment.mid and payment.materialpayment.paymentStatus in (1,2) and material.material.orderId = :orderId";
		BigDecimal total = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).setString("orderId", orderId).uniqueResult();
		
		if(total==null){
			total = BigDecimal.ZERO;
		}
		
		return total.floatValue();
	}

}
