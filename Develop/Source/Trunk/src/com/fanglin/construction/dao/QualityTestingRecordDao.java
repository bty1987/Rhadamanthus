/**
 * @File Name		: QualityTestingRecordDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-12-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.QualityTestingRecordPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface QualityTestingRecordDao extends Dao<QualityTestingRecordPO> {
	
	public List<QualityTestingRecordPO> pageQualityTestingRecord(Paging paging, List<FilterVO> filters);
	
	public List<QualityTestingRecordPO> pageQualityTestingRecordByOrderId(Paging paging, List<FilterVO> filters, String orderId, String operaterId);

}
