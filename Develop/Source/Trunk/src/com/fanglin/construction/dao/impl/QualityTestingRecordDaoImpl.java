/**
 * @File Name		: QualityTestingRecordDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-12-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.QualityTestingRecordDao;
import com.fanglin.construction.po.QualityTestingRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

@Repository("qualityTestingRecordDao")
public class QualityTestingRecordDaoImpl extends DaoImpl<QualityTestingRecordPO> implements QualityTestingRecordDao {
	
	public QualityTestingRecordDaoImpl(){
		super(QualityTestingRecordPO.class);
	}
	
	@Override
	public List<QualityTestingRecordPO> pageQualityTestingRecord(Paging paging, List<FilterVO> filters){
		
		PagingQuery<QualityTestingRecordPO> query = pagingQuery(paging, QualityTestingRecordPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@Override
	public List<QualityTestingRecordPO> pageQualityTestingRecordByOrderId(Paging paging, List<FilterVO> filters, String orderId, String operaterId){
		
		PagingQuery<QualityTestingRecordPO> query = pagingQuery(paging, QualityTestingRecordPO.class);
		
		query.add(query.getCriterion(QualityTestingRecordPO.COLUMN_OPERATERID_STR, operaterId, "eq"));
		query.add(query.getCriterion(QualityTestingRecordPO.COLUMN_ORDERID_STR, orderId, "eq"));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

}
