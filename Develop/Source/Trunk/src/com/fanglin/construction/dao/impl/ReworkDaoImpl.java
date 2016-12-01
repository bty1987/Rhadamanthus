/**
 * @File Name		: ReworkDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.utils.Paging;

import com.fanglin.construction.dao.ReworkDao;
import com.fanglin.construction.po.ReworkPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;

@Repository("reworkDao")
public class ReworkDaoImpl extends DaoImpl<ReworkPO> implements ReworkDao{
	
	public ReworkDaoImpl(){
		super(ReworkPO.class);
	}

	@Override
	public List<ReworkPO> pageRework(Paging paging, List<Filter> filters){
		
		PagingQuery<ReworkPO> query = pagingQuery(paging, ReworkPO.class);
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

	@Override
	public List<ReworkPO> pageReworkByOrderId(Paging paging, List<Filter> filters, String orderId){
		
		PagingQuery<ReworkPO> query = pagingQuery(paging, ReworkPO.class);
		
		query.add(query.getCriterion(ReworkPO.COLUMN_ORDERID_STR, orderId, "eq"));
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

}
