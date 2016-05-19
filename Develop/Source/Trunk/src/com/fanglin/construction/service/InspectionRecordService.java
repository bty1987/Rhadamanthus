/**
 * @File Name		: InspectionRecordService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.InspectionRecordVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface InspectionRecordService {
	
	public void pageInspectionRecord(Paging paging, List<FilterVO> filters);
	
	public void pageInspectionRecordByOrderId(Paging paging, List<FilterVO> filters, InspectionRecordVO inspectionRecordVO);
	
	public void saveOrUpdateInspectionRecord(InspectionRecordVO inspectionRecordVO);
	
	public void updateInspectionRecord(InspectionRecordVO inspectionRecordVO);
	
	public void deleteInspectionRecordById(int irId, String userId);
	
	public void deleteInspectionRecords(List<String> irIds, String userId);
	
}
