/**
 * @File Name		: QuotationDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;

@Repository("quotationDao")
public class QuotationDaoImpl extends DaoImpl<QuotationPO> implements QuotationDao {

	public QuotationDaoImpl(){
		super(QuotationPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationPO> queryQuotationByOrderId(String orderId){
		return createCriteria(QuotationPO.class)
				.add(Restrictions.eq("decorationOrder.orderId", orderId))
				.addOrder(Order.desc("createTime"))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationPO> queryQuotationForDefaultByOrderIds(List<String> orderIds) {
		return session().createCriteria(QuotationPO.class).add(Restrictions.eq("status", QuotationPO.STATUS_DEFAULT_INT)).add(Restrictions.in("decorationOrder.orderId", orderIds)).list();
	}

	@Override
	public QuotationPO queryQuotationForDefaultByOrderId(String orderId, short type){
		
		if(type == DecorationOrderPO.TYPE_HOLONOMY_INT){
			type = DecorationOrderPO.TYPE_PART_INT;
		};
		
		return (QuotationPO) createCriteria(QuotationPO.class)
				.add(Restrictions.eq("decorationOrder.orderId", orderId))
				.add(Restrictions.eq("type", type))
				.add(Restrictions.eq("status", QuotationPO.STATUS_DEFAULT_INT))
				.uniqueResult();
	}

	@Override
	public int countQuotationByOrderId(String orderId, short type) {
		
		String sql = "select count(*) from platform.quotation where orderId = :orderId and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setShort("type", type).uniqueResult();
		
		return count.intValue();
	}

	@Override
	public int clearQuotationForDefaultByOrderId(String orderId, short type){
		String sql = "update platform.quotation q set q.status = 0 where q.orderId = :orderId and q.type = :type";
		return session().createSQLQuery(sql).setString("orderId", orderId).setShort("type", type).executeUpdate();
	}

}
