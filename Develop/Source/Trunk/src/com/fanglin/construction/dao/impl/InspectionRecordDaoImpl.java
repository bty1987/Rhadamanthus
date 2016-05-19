/**
 * @File Name		: InspectionRecordDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.InspectionRecordDao;
import com.fanglin.construction.po.InspectionRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

@Repository("inspectionRecordDao")
public class InspectionRecordDaoImpl extends DaoImpl<InspectionRecordPO> implements InspectionRecordDao {
	
	public InspectionRecordDaoImpl(){
		super(InspectionRecordPO.class);
	}

	@Override
	public List<InspectionRecordPO> pageInspectionRecord(Paging paging, List<FilterVO> filters){
		
		PagingQuery<InspectionRecordPO> query = pagingQuery(paging, InspectionRecordPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

	@Override
	public List<InspectionRecordPO> pageInspectionRecordByOrderId(Paging paging, List<FilterVO> filters, String orderId){
		
		PagingQuery<InspectionRecordPO> query = pagingQuery(paging, InspectionRecordPO.class);
		
		query.add(query.getCriterion(InspectionRecordPO.COLUMN_ORDERID_STR, orderId, "eq"));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

}
