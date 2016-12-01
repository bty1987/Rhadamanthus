/**
 * @File Name		: QualityTestingRecordService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-12-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.QualityTestingRecordVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface QualityTestingRecordService {
	
	public void pageQualityTestingRecord(Paging paging, List<Filter> filters);
	
	public void pageQualityTestingRecordByOrderId(Paging paging, List<Filter> filters, QualityTestingRecordVO qualityTestingRecordVO, String operaterId);
	
	public void addQualityTestingRecord(QualityTestingRecordVO qualityTestingRecordVO);
	
	public void updateQualityTestingRecord(QualityTestingRecordVO qualityTestingRecordVO);
	
	public void deleteQualityTestingRecordById(int qtrId);
	
	public void deleteQualityTestingRecord(QualityTestingRecordVO qualityTestingRecordVO);
	
	public void deleteQualityTestingRecords(List<Integer> qtrIds);
	
}
