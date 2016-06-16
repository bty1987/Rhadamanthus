/**
 * @File Name		: InspectionDeductionService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.InspectionDeductionVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface InspectionDeductionService {
	
	public void pageInspectionDeduction(Paging paging, List<FilterVO> filters);
	
	public void pageInspectionDeductionByOrderId(Paging paging, List<FilterVO> filters, InspectionDeductionVO inspectionDeductionVO);
	
	public void saveOrUpdateInspectionDeduction(InspectionDeductionVO inspectionDeductionVO);
	
	public void updateInspectionDeduction(InspectionDeductionVO inspectionDeductionVO);
	
	public void deleteInspectionDeductionById(int idId);
	
	public void deleteInspectionDeduction(InspectionDeductionVO inspectionDeductionVO);
	
	public void deleteInspectionRecords(List<String> idIds);

}
