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

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.AddReduceDao;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.utils.Paging;

@Repository("addReduceDao")
public class AddReduceDaoImpl extends DaoImpl<AddReducePO> implements AddReduceDao{
	
	public AddReduceDaoImpl(){
		super(AddReducePO.class);
	}

	@Override
	public List<AddReducePO> pageAddReduce(Paging paging, List<FilterVO> filters){
		
		PagingQuery<AddReducePO> query = pagingQuery(paging, AddReducePO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if("addReduceStatus".equals(filter.getField())){
						query.add(query.getCriterion(filter.getField(), Integer.parseInt(filter.getData()), filter.getOp()));
					}
					else if("addReduceType".equals(filter.getField())){
						query.add(query.getCriterion(filter.getField(), Integer.parseInt(filter.getData()), filter.getOp()));
					}else{
						query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
					}
				}
			}
		}
		
		return query.list();
	}

	@Override
	public List<AddReducePO> pageAddReduceByOrderId(Paging paging, List<FilterVO> filters, String orderId){
		
		PagingQuery<AddReducePO> query = pagingQuery(paging, AddReducePO.class);
		
		query.add(query.getCriterion(AddReducePO.COLUMN_ORDERID_STR, orderId, "eq"));
		
		if(filters != null){
			for(FilterVO filter: filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if("addReduceStatus".equals(filter.getField())){
						query.add(query.getCriterion(filter.getField(), Integer.parseInt(filter.getData()), filter.getOp()));
					}else if("addReduceType".equals(filter.getField())){
						query.add(query.getCriterion(filter.getField(), Integer.parseInt(filter.getData()), filter.getOp()));
					}else{
						query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
					}
				}
			}
			
		}
		query.desc("createTime");
		return query.list();
		
	}

	@Override
	public AddReducePO queryAddReduceByOrderPaymentId(Long orderPaymentId){
		return (AddReducePO) createCriteria(AddReducePO.class).add(Restrictions.eq("orderPaymentId", orderPaymentId)).uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<AddReducePO> queryAddReduceForNLeakageByOrderId(String orderId){
		return (List<AddReducePO>) createCriteria(AddReducePO.class)
				.add(Restrictions.eq("orderId", orderId))
				.add(Restrictions.ne("addReduceType", 2))
				.list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<AddReducePO> queryAddReduceByOrderId(String orderId){
		return session().createCriteria(AddReducePO.class).add(Restrictions.eq(AddReducePO.COLUMN_ORDERID_STR, orderId)).list();
	}

}
