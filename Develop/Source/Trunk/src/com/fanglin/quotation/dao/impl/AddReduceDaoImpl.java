/**
 * @File Name		: AddReduceDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.utils.Paging;

@Repository("addReduceDao")
public class AddReduceDaoImpl extends DaoImpl<AddReducePO> implements AddReduceDao{
	
	public AddReduceDaoImpl(){
		super(AddReducePO.class);
	}

	@Override
	public List<AddReducePO> pageAddReduce(Paging paging, List<Filter> filters){
		
		PagingQuery<AddReducePO> query = pagingQuery(paging, AddReducePO.class);
		
		if(filters != null){
			for(Filter filter: filters){
				if(AddReducePO.COLUMN_ORDERID_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}else if(AddReducePO.COLUMN_STATUS_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.parseInt(filter.getData()), filter.getOp()));
				}else if(AddReducePO.COLUMN_TYPE_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.parseInt(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}
			}
		}
		
		return query.list();
	}

	@Override
	public List<AddReducePO> pageAddReduceByOrderId(Paging paging, List<Filter> filters, String orderId){
		
		PagingQuery<AddReducePO> query = pagingQuery(paging, AddReducePO.class);
		
		query.add(query.getCriterion(AddReducePO.COLUMN_ORDERID_STR, orderId, "eq"));
		
		if(filters != null){
			for(Filter filter: filters){
				if(AddReducePO.COLUMN_STATUS_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.parseInt(filter.getData()), filter.getOp()));
				}else if(AddReducePO.COLUMN_STATUS_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.parseInt(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}
			}
		}
		query.desc("createTime");
		return query.list();
		
	}

	@Override
	public AddReducePO queryAddReduceByDecorationPaymentId(Long decorationPaymentId){
		return (AddReducePO) createCriteria(AddReducePO.class).add(Restrictions.eq(AddReducePO.COLUMN_DPID_STR, decorationPaymentId)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<AddReducePO> queryAddReduceForNLeakageByOrderId(String orderId){
		return (List<AddReducePO>) createCriteria(AddReducePO.class)
				.add(Restrictions.eq(AddReducePO.COLUMN_ORDERID_STR, orderId))
				.add(Restrictions.ne(AddReducePO.COLUMN_TYPE_STR, 2))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<AddReducePO> queryAddReduceByOrderId(String orderId){
		return session().createCriteria(AddReducePO.class).add(Restrictions.eq(AddReducePO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AddReducePO> queryAddReduceForPayedByOrderId(String orderId) {
		
		List<Integer> statuses = Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT);
		
		return session().createCriteria(AddReducePO.class).add(Restrictions.eq(AddReducePO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.in(AddReducePO.COLUMN_STATUS_STR, statuses)).list();
	}
	
	@Override
	public int countAddReduceByOrderId(String orderId) {
		
		String sql = "select count(*) from quotation.addreduce where orderId = :orderId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();
		
		return count.intValue();
	}

}
