package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.FunctionAreaItemPO;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.po.MeasurementUnitPO;
import com.fanglin.data.po.QuotationBigCategoryPO;
import com.fanglin.data.po.QuotationClassificationPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationSmallCategoryPO;
import com.fanglin.data.po.QuotationTypePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.po.WorkTypePO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.FunctionAreaItemDao;
import com.fanglin.data.quotation.service.FunctionAreaItemService;
import com.fanglin.data.quotation.vo.FunctionAreaItemVO;
import com.fanglin.data.quotation.vo.FunctionAreaVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;

@Service("functionAreaItemService")
@Transactional(readOnly = true)
public class FunctionAreaItemServiceImpl implements FunctionAreaItemService {
	
	@Autowired
	private FunctionAreaItemDao functionAreaItemDao;
	
	@Autowired
	private FunctionAreaDao functionAreaDao;
	
	@Override
	public List<FunctionAreaItemVO> queryFunctionAreaItemByFunctionAreaId(FunctionAreaItemVO functionAreaItemVO){
		
		long functionAreaId = functionAreaItemVO.getFunctionArea().getFaId();
		
		List<FunctionAreaItemPO> functionAreaItemPOs = functionAreaItemDao.queryFunctionAreaItemByFunctionAreaId(functionAreaId);
		List<FunctionAreaItemVO> functionAreaItemVOs = new ArrayList<FunctionAreaItemVO>();
		
		for(FunctionAreaItemPO functionAreaItemPO: functionAreaItemPOs){
			
			FunctionAreaPO FunctionAreaPO = functionAreaItemPO.getFunctionArea();
			QuotationItemPO quotationItemPO = functionAreaItemPO.getQuotationItem();
			
			WorkTypePO workTypePO = quotationItemPO.getWorkType();
			MeasurementUnitPO measurementUnitPO = quotationItemPO.getMeasurementUnit();
			QuotationBigCategoryPO quotationBigCategoryPO = quotationItemPO.getQuotationBigCategory();
			QuotationClassificationPO quotationClassificationPO = quotationItemPO.getQuotationClassification();
			QuotationSmallCategoryPO quotationSmallCategoryPO = quotationItemPO.getQuotationSmallCategory();
			QuotationTypePO quotationTypePO = quotationItemPO.getQuotationType();
			QuotationVersionPO quotationVersionPO = quotationItemPO.getQuotationVersion();
			
			FunctionAreaVO functionAreaVO = new FunctionAreaVO();
			functionAreaVO.setFaId(FunctionAreaPO.getFaId());
			functionAreaVO.setFunctionAreaId(FunctionAreaPO.getFunctionAreaId());
			functionAreaVO.setFunctionAreaName(FunctionAreaPO.getFunctionAreaName());
			functionAreaVO.setVersion(FunctionAreaPO.getQuotationVersion().getVersionName());
			
			FunctionAreaItemVO _functionAreaItemVO = new FunctionAreaItemVO();
			_functionAreaItemVO.setFaiId(functionAreaItemPO.getFaiId());
			_functionAreaItemVO.setFunctionArea(functionAreaVO);
			
			QuotationItemVO quotationItemVO = new QuotationItemVO();
			quotationItemVO.setQiId(quotationItemPO.getQiId());
			quotationItemVO.setItemId(quotationItemPO.getItemId());
			quotationItemVO.setItemName(quotationItemPO.getItemName());
			quotationItemVO.setUnitPrice(quotationItemPO.getUnitPrice());
			
			quotationItemVO.setWorkType(workTypePO.getName());
			quotationItemVO.setWorkTypeId(workTypePO.getId());
			
			quotationItemVO.setMeasurementUnit(measurementUnitPO.getName());
			quotationItemVO.setMeasurementUnitId(measurementUnitPO.getId());
			
			quotationItemVO.setQuotationBigCategory(quotationBigCategoryPO.getName());
			quotationItemVO.setQuotationBigCategoryId(quotationBigCategoryPO.getId());
			
			quotationItemVO.setQuotationClassification(quotationClassificationPO.getName());
			quotationItemVO.setQuotationClassificationId(quotationClassificationPO.getId());
			
			quotationItemVO.setQuotationSmallCategory(quotationSmallCategoryPO.getName());
			quotationItemVO.setQuotationSmallCategoryId(quotationSmallCategoryPO.getId());
			
			quotationItemVO.setQuotationType(quotationTypePO.getName());
			quotationItemVO.setQuotationTypeId(quotationTypePO.getId());
			
			quotationItemVO.setVersion(quotationVersionPO.getVersionName());
			quotationItemVO.setVersionId(quotationVersionPO.getVersionId());
			
			_functionAreaItemVO.setQuotationItem(quotationItemVO);
			
			functionAreaItemVOs.add(_functionAreaItemVO);
		}
		
		return functionAreaItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addFunctionAreaItem(List<FunctionAreaItemVO> functionAreaItems) throws FLException{
		
		FunctionAreaPO functionAreaPO = null;
		
		if(functionAreaItems.size() > 0){
			functionAreaPO = functionAreaDao.get(functionAreaItems.get(0).getFunctionArea().getFaId());
		}
		
		if(functionAreaPO == null){
			StringBuffer errorInfo = new StringBuffer();
			errorInfo.append("功能区");
			errorInfo.append(functionAreaItems.get(0).getFunctionArea().getFaId());
			errorInfo.append("不存在");

			throw new FLException(200010, errorInfo.toString());
		}
		
		for(FunctionAreaItemVO functionAreaItemVO: functionAreaItems){
			
			long functionAreaId = functionAreaItemVO.getFunctionArea().getFaId();
			long itemId =  functionAreaItemVO.getQuotationItem().getQiId();
			
			FunctionAreaItemPO functionAreaItemPO = functionAreaItemDao.queryFunctionAreaItemByIdAFunctionAreaId(functionAreaId, itemId);
			
			if(functionAreaItemPO == null){
				functionAreaItemPO = new FunctionAreaItemPO();
				FunctionAreaPO _functionAreaPO = new FunctionAreaPO();
				_functionAreaPO.setFaId(functionAreaItemVO.getFunctionArea().getFaId());
				functionAreaItemPO.setFunctionArea(_functionAreaPO);
				
				QuotationItemPO quotationItemPO = new QuotationItemPO();
				quotationItemPO.setQiId(functionAreaItemVO.getQuotationItem().getQiId());
				functionAreaItemPO.setQuotationItem(quotationItemPO);
				
				functionAreaItemDao.save(functionAreaItemPO);
			}	
		}
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteFunctionAreaItemByIds(List<Long> autoIds){
		
		for(Long id: autoIds){
			functionAreaItemDao.deleteById(id);
		}
		
		return 0;
	}
	
}
