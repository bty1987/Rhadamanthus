/**
 * @File Name		: BackVisitServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 739061411@qqcom
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.MeasurementUnitPO;
import com.fanglin.common.po.WorkTypePO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.service.CustomQuotationItemService;
import com.fanglin.quotation.dao.CustomQuotationItemDao;
import com.fanglin.quotation.po.CustomQuotationItemPO;
import com.fanglin.quotation.po.QuotationBigCategoryPO;
import com.fanglin.quotation.po.QuotationClassificationPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.vo.CustomQuotationItemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customQuotationItemService")
@Transactional(readOnly=true)
public class CustomQuotationItemServiceImpl implements CustomQuotationItemService {

	@Autowired
	private CustomQuotationItemDao customQuotationItemDao;
	
	@Override
	public void pageCustomerItemByQuotationId(Paging paging, List<FilterVO> filters, CustomQuotationItemVO customQuotationItemVO){
		List<CustomQuotationItemVO> customQuotationItemVOs = new ArrayList<CustomQuotationItemVO>();
		List<CustomQuotationItemPO> customQuotationItemPOs = customQuotationItemDao.getPageCustomQuotationItemsByQuotationId(paging, filters, customQuotationItemVO.getQuotationId());
		
		for(CustomQuotationItemPO customQuotationItemPO: customQuotationItemPOs){
			CustomQuotationItemVO _customQuotationItemVO = new CustomQuotationItemVO();
			
			customQuotationItemPOToVO(_customQuotationItemVO, customQuotationItemPO);
			
			customQuotationItemVOs.add(_customQuotationItemVO);
		}
		
		paging.setData(customQuotationItemVOs);
	}
	
	private void customQuotationItemPOToVO(CustomQuotationItemVO customQuotationItemVO, CustomQuotationItemPO customQuotationItemPO){
		BeanUtil.copyProperties(customQuotationItemPO, customQuotationItemVO, Arrays.asList("quotationClassification", "quotationBigCategory", "measurementUnit", "workType"));
		
		QuotationFunctionAreaPO quotationFunctionAreaPO = customQuotationItemPO.getQuotationFunctionArea();
		QuotationPO quotationPO = quotationFunctionAreaPO.getQuotation();
		QuotationBigCategoryPO quotationBigCategoryPO = customQuotationItemPO.getQuotationBigCategory();
		QuotationClassificationPO quotationClassificationPO = customQuotationItemPO.getQuotationClassification();
		MeasurementUnitPO measurementUnitPO = customQuotationItemPO.getMeasurementUnit();
		WorkTypePO workTypePO = customQuotationItemPO.getWorkType();
		
		customQuotationItemVO.setFunctionAreaId(quotationFunctionAreaPO.getAutoId());
		customQuotationItemVO.setFunctionAreaName(quotationFunctionAreaPO.getFunctionAreaName());
		
		customQuotationItemVO.setQuotationId(quotationPO.getAutoId());
		customQuotationItemVO.setQuotationName(quotationPO.getQuotationName());
		
		customQuotationItemVO.setMeasurementUnit(measurementUnitPO.getName());
		customQuotationItemVO.setMeasurementUnitId(measurementUnitPO.getId());
		
		customQuotationItemVO.setWorkType(workTypePO.getName());
		customQuotationItemVO.setWorkTypeId(workTypePO.getId());
		
		customQuotationItemVO.setQuotationBigCategory(quotationBigCategoryPO.getName());
		customQuotationItemVO.setQuotationBigCategoryId(quotationBigCategoryPO.getId());
		
		customQuotationItemVO.setQuotationClassification(quotationClassificationPO.getName());
		customQuotationItemVO.setQuotationClassificationId(quotationClassificationPO.getId());
	}
}
