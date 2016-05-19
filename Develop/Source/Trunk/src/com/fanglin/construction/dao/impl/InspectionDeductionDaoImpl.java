/**
 * @File Name		: InspectionDeductionDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.InspectionDeductionDao;
import com.fanglin.construction.po.InspectionDeductionPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

@Repository("inspectionDeductionDao")
public class InspectionDeductionDaoImpl extends DaoImpl<InspectionDeductionPO> implements InspectionDeductionDao {
	
	public InspectionDeductionDaoImpl(){
		super(InspectionDeductionPO.class);
	}

	@Override
	public List<InspectionDeductionPO> pageInspectionDeduction(Paging paging, List<FilterVO> filters){
		
		PagingQuery<InspectionDeductionPO> query = pagingQuery(paging, InspectionDeductionPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

	@Override
	public List<InspectionDeductionPO> pageInspectionDeductionByOrderId(Paging paging, List<FilterVO> filters, String orderId){
		
		PagingQuery<InspectionDeductionPO> query = pagingQuery(paging, InspectionDeductionPO.class);
		
		query.add(query.getCriterion(InspectionDeductionPO.COLUMN_ORDERID_STR, orderId, "eq"));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

}
