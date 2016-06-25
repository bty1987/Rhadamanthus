/**
 * @File Name		: InspectionDeductionDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.InspectionDeductionPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface InspectionDeductionDao extends Dao<InspectionDeductionPO> {
	
	public List<InspectionDeductionPO> pageInspectionDeduction(Paging paging, List<FilterVO> filters);
	
	public List<InspectionDeductionPO> pageInspectionDeductionByOrderId(Paging paging, List<FilterVO> filters, String orderId);

}
