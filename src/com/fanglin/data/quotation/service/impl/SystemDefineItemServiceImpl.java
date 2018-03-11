/**
 * @File Name		: SystemDefineItemServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.MeasurementUnitPO;
import com.fanglin.communion.po.QuotationBigCategoryPO;
import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.SystemDefineItemPO;
import com.fanglin.data.quotation.dao.SystemDefineItemDao;
import com.fanglin.data.quotation.service.SystemDefineItemService;
import com.fanglin.data.quotation.vo.SystemDefineItemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("systemDefineItemService")
@Transactional(readOnly=true)
public class SystemDefineItemServiceImpl implements SystemDefineItemService {
	
	@Autowired
	private SystemDefineItemDao systemDefineItemDao;
	
	@Override
	public void pageSystemDefineItem(Paging paging, List<Filter> filters,int company){
		
		List<SystemDefineItemPO> systemDefineItemPOs = systemDefineItemDao.pageSystemDefineItem(paging, filters,company);
		List<SystemDefineItemVO> systemDefineItemVOs = new ArrayList<SystemDefineItemVO>();
		
		for(SystemDefineItemPO systemDefineItemPO: systemDefineItemPOs){
			SystemDefineItemVO systemDefineItemVO = new SystemDefineItemVO();
			
			QuotationBigCategoryPO quotationBigCategoryPO = systemDefineItemPO.getQuotationBigCategory();
			MeasurementUnitPO measurementUnitPO = systemDefineItemPO.getMeasurementUnit();
			WorkTypePO workTypePO = systemDefineItemPO.getWorkType();
			
			BeanUtil.copyProperties(systemDefineItemPO, systemDefineItemVO, Arrays.asList("quotationBigCategory", "measurementUnit", "workType"));
			
			systemDefineItemVO.setQuotationBigCategoryId(quotationBigCategoryPO.getId());
			systemDefineItemVO.setQuotationBigCategory(quotationBigCategoryPO.getName());
			
			systemDefineItemVO.setQuotationTypeId(quotationBigCategoryPO.getQtid());
			
			systemDefineItemVO.setMeasurementUnitId(measurementUnitPO.getId());
			systemDefineItemVO.setMeasurementUnit(measurementUnitPO.getName());
			
			systemDefineItemVO.setItemWorkTypeId(workTypePO.getId());
			systemDefineItemVO.setItemWorkType(workTypePO.getName());
			
			systemDefineItemVOs.add(systemDefineItemVO);
		}
		
		paging.setData(systemDefineItemVOs);
	}
	
	@Override
	public SystemDefineItemVO querySystemDefineItemByItemId(SystemDefineItemVO systemDefineItemVO,int company) throws FLException{
		
		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.querySystemDefineItemById(systemDefineItemVO.getItemId(),company);
		
		if(systemDefineItemPO == null){
			throw new FLException(200015, "系统自定义报价项不存在");
		}
		
		QuotationBigCategoryPO quotationBigCategoryPO = systemDefineItemPO.getQuotationBigCategory();
		MeasurementUnitPO measurementUnitPO = systemDefineItemPO.getMeasurementUnit();
		WorkTypePO workTypePO = systemDefineItemPO.getWorkType();
		
		BeanUtil.copyProperties(systemDefineItemPO, systemDefineItemVO, Arrays.asList("quotationBigCategory", "measurementUnit", "workType"));
		
		systemDefineItemVO.setQuotationBigCategoryId(quotationBigCategoryPO.getId());
		systemDefineItemVO.setQuotationBigCategory(quotationBigCategoryPO.getName());
		
		systemDefineItemVO.setMeasurementUnitId(measurementUnitPO.getId());
		systemDefineItemVO.setMeasurementUnit(measurementUnitPO.getName());
		
		systemDefineItemVO.setQuotationTypeId(quotationBigCategoryPO.getQtid());
		systemDefineItemVO.setItemWorkTypeId(workTypePO.getId());
		systemDefineItemVO.setItemWorkType(workTypePO.getName());
		
		return systemDefineItemVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSystemDefineItem(SystemDefineItemVO systemDefineItemVO,int company) throws FLException {
		
		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.querySystemDefineItemById(systemDefineItemVO.getItemId(),company);
		
		if(systemDefineItemPO != null){
			throw new FLException(200009, "系统自定义报价项编号存在");
		}
		
		systemDefineItemPO = new SystemDefineItemPO();
		BeanUtil.copyProperties(systemDefineItemVO, systemDefineItemPO, Arrays.asList("quotationBigCategory", "measurementUnit", "workType"));
		
		systemDefineItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(systemDefineItemVO.getQuotationBigCategoryId()));
		systemDefineItemPO.setMeasurementUnit(new MeasurementUnitPO(systemDefineItemVO.getMeasurementUnitId()));
		systemDefineItemPO.setWorkType(new WorkTypePO(systemDefineItemVO.getItemWorkTypeId()));
		systemDefineItemPO.setCompany(company);
		systemDefineItemDao.save(systemDefineItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSystemDefineItem(SystemDefineItemVO systemDefineItemVO) throws FLException {
		
		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(systemDefineItemVO.getSdiId());
		
		if(systemDefineItemPO == null){
			throw new FLException(200021, "系统自定义报价项不存在");
		}
		
		systemDefineItemPO.setItemName(systemDefineItemVO.getItemName());
		systemDefineItemPO.setUnitPrice(systemDefineItemVO.getUnitPrice());
		systemDefineItemPO.setQuotationItemDes(systemDefineItemVO.getQuotationItemDes());
		
		systemDefineItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(systemDefineItemVO.getQuotationBigCategoryId()));
		systemDefineItemPO.setMeasurementUnit(new MeasurementUnitPO(systemDefineItemVO.getMeasurementUnitId()));
		systemDefineItemPO.setWorkType(new WorkTypePO(systemDefineItemVO.getItemWorkTypeId()));
		
		systemDefineItemDao.update(systemDefineItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSystemDefineItemForStatus(SystemDefineItemVO systemDefineItemVO) throws FLException {
		
		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(systemDefineItemVO.getSdiId());
		
		if(systemDefineItemPO == null){
			throw new FLException(200021, "系统自定义报价项不存在");
		}
		
		systemDefineItemPO.setStatus(systemDefineItemVO.getStatus());
		
		systemDefineItemDao.update(systemDefineItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSystemDefineItemForDiscount(SystemDefineItemVO systemDefineItemVO) throws FLException {
		
		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(systemDefineItemVO.getSdiId());
		
		if(systemDefineItemPO == null){
			throw new FLException(200021, "系统自定义报价项不存在");
		}
		
		systemDefineItemPO.setDiscount(systemDefineItemVO.getDiscount());
		
		systemDefineItemDao.update(systemDefineItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteSystemDefineItem(SystemDefineItemVO systemDefineItemVO){
		
		SystemDefineItemPO systemDefineItemPO = new SystemDefineItemPO();
		
		BeanUtil.copyProperties(systemDefineItemVO, systemDefineItemPO, Arrays.asList("quotationBigCategory", "measurementUnit", "workType"));
		
		systemDefineItemDao.delete(systemDefineItemPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteSystemDefineItemByIds(List<Long> ids){
		for(Long id: ids){
			systemDefineItemDao.deleteById(id);
		}		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteSystemDefineItemById(int id){
		systemDefineItemDao.deleteById(id);
	}

}
