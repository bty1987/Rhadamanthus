/**
 * @File Name		: QuotationItemServiceImpl.java
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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.MeasurementUnitPO;
import com.fanglin.data.po.QuotationBigCategoryPO;
import com.fanglin.data.po.QuotationClassificationPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationSmallCategoryPO;
import com.fanglin.data.po.QuotationTypePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.po.WorkTypePO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.service.QuotationItemService;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("quotationItemService")
@Transactional(readOnly=true)
public class QuotationItemServiceImpl implements QuotationItemService {
	
	@Autowired
	private QuotationItemDao quotationItemDao;
	
	@Override
	public void pageQuotationItem(Paging paging, List<Filter> filters,int company){
		
		filters.add(new Filter(QuotationItemPO.COLUMN_COMPANY_STR, String.valueOf(company), "eq"));
		
		List<QuotationItemPO> quotationItemPOs = quotationItemDao.pageQuotationItem(paging, filters);
		List<QuotationItemVO> quotationItemVOs = new ArrayList<QuotationItemVO>();
		
		for(QuotationItemPO quotationItemPO: quotationItemPOs){
			QuotationItemVO quotationItemVO = new QuotationItemVO();
			
			quotationItemPOToVO(quotationItemPO, quotationItemVO);
			
			quotationItemVOs.add(quotationItemVO);
		}
		
		paging.setData(quotationItemVOs);
	}
	
	@Override
	public void pageQuotationItemByVersionId(Paging paging, List<Filter> filters, QuotationItemVO quotationItemVO){
		
		List<QuotationItemVO> quotationItemVOs = new ArrayList<QuotationItemVO>();
		
		if(quotationItemVO != null){
			
			filters.add(new Filter(QuotationItemPO.COLUMN_STATUS_STR, String.valueOf(QuotationItemPO.STATUS_ENABLE_INT), "eq"));
			filters.add(new Filter("versionId", quotationItemVO.getVersionId(), "eq"));
			if(quotationItemVO.getQuotationTypeId()!=null && quotationItemVO.getQuotationTypeId()!=0){
				filters.add(new Filter("quotationTypeId", String.valueOf(quotationItemVO.getQuotationTypeId()), "eq"));
			}
			List<QuotationItemPO> quotationItemPOs = quotationItemDao.pageQuotationItem(paging, filters);
			
			for(QuotationItemPO quotationItemPO: quotationItemPOs){
				QuotationItemVO _quotationItemVO = new QuotationItemVO();
				
				quotationItemPOToVO(quotationItemPO, _quotationItemVO);
				
				quotationItemVOs.add(_quotationItemVO);
			}
		}
		
		paging.setData(quotationItemVOs);
	}
	
	@Override
	public QuotationItemVO queryQuotationItemByItemIdAVersionId(QuotationItemVO quotationItemVO) throws FLException{
		
		QuotationItemPO quotationItemPO = quotationItemDao.queryQuotationItemByIdAVersionId(quotationItemVO.getItemId(), quotationItemVO.getVersionId());
		
		if(quotationItemPO == null){
			return null;
		}
		
		quotationItemPOToVO(quotationItemPO, quotationItemVO);
		
		return quotationItemVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addQuotationItem(QuotationItemVO quotationItemVO) throws FLException {
		
		String versionId = quotationItemVO.getVersionId();
		String itemId = quotationItemVO.getItemId();
		
		QuotationItemPO quotationItemPO = quotationItemDao.queryQuotationItemByIdAVersionId(itemId, versionId);
		
		if((quotationItemPO != null && quotationItemVO.getQiId() == null) || (quotationItemPO != null && quotationItemVO.getQiId() != quotationItemPO.getQiId())){
			throw new FLException(200011, String.format("报价版本(%s)的报价编号(%s)已存在", versionId, itemId));
		}
		
		quotationItemPO = new QuotationItemPO();
		
		BeanUtil.copyProperties(quotationItemVO, quotationItemPO, Arrays.asList("quotationType", "quotationClassification", "quotationBigCategory", "quotationSmallCategory", "measurementUnit", "workType", "quotationVersion"));
		
		quotationItemPO.setQuotationVersion(new QuotationVersionPO(quotationItemVO.getVersionId()));
		quotationItemPO.setQuotationType(new QuotationTypePO(quotationItemVO.getQuotationTypeId()));
		quotationItemPO.setQuotationClassification(new QuotationClassificationPO(quotationItemVO.getQuotationClassificationId()));
		quotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(quotationItemVO.getQuotationBigCategoryId()));
		quotationItemPO.setQuotationSmallCategory(new QuotationSmallCategoryPO(quotationItemVO.getQuotationSmallCategoryId()));
		quotationItemPO.setMeasurementUnit(new MeasurementUnitPO(quotationItemVO.getMeasurementUnitId()));
		quotationItemPO.setWorkType(new WorkTypePO(quotationItemVO.getWorkTypeId()));
		
		quotationItemDao.save(quotationItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationItem(QuotationItemVO quotationItemVO) throws FLException {
		
		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiId());
		
		if(quotationItemPO == null){
			throw new FLException(200013, "报价项不存在");
		}
		
		BeanUtil.copyProperties(quotationItemVO, quotationItemPO, Arrays.asList("itemId", "quotationType", "quotationClassification", "quotationBigCategory", "quotationSmallCategory", "measurementUnit", "workType", "quotationVersion"));
		
		quotationItemPO.setQuotationType(new QuotationTypePO(quotationItemVO.getQuotationTypeId()));
		quotationItemPO.setQuotationClassification(new QuotationClassificationPO(quotationItemVO.getQuotationClassificationId()));
		quotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(quotationItemVO.getQuotationBigCategoryId()));
		quotationItemPO.setQuotationSmallCategory(new QuotationSmallCategoryPO(quotationItemVO.getQuotationSmallCategoryId()));
		quotationItemPO.setMeasurementUnit(new MeasurementUnitPO(quotationItemVO.getMeasurementUnitId()));
		quotationItemPO.setWorkType(new WorkTypePO(quotationItemVO.getWorkTypeId()));
		
		quotationItemDao.update(quotationItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationItemForStatus(QuotationItemVO quotationItemVO) throws FLException {
		
		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiId());
		
		if(quotationItemPO == null){
			throw new FLException(200013, "报价项不存在");
		}
		
		quotationItemPO.setStatus(quotationItemVO.getStatus());
		
		quotationItemDao.update(quotationItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationItemForDiscount(QuotationItemVO quotationItemVO) throws FLException {
		
		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiId());
		
		if(quotationItemPO == null){
			throw new FLException(200013, "报价项不存在");
		}
		
		quotationItemPO.setDiscount(quotationItemVO.getDiscount());
		
		quotationItemDao.update(quotationItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteQuotationItem(QuotationItemVO quotationItemVO){
		QuotationItemPO quotationItemPO = new QuotationItemPO();
		
		BeanUtil.copyProperties(quotationItemVO, quotationItemPO, Arrays.asList("quotationType", "quotationClassification", "quotationBigCategory", "quotationSmallCategory", "measurementUnit", "workType", "quotationVersion"));
		
		quotationItemDao.delete(quotationItemPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteQuotationItemByQiId(int qiId){
		
		quotationItemDao.deleteById(qiId);
	}
	
	private void quotationItemPOToVO(QuotationItemPO quotationItemPO, QuotationItemVO quotationItemVO){
	
		BeanUtil.copyProperties(quotationItemPO, quotationItemVO, Arrays.asList("quotationType", "quotationClassification", "quotationBigCategory", "quotationSmallCategory", "measurementUnit", "workType", "quotationVersion"));
		
		QuotationTypePO quotationTypePO = quotationItemPO.getQuotationType();
		QuotationClassificationPO quotationClassificationPO = quotationItemPO.getQuotationClassification();
		QuotationBigCategoryPO quotationBigCategoryPO = quotationItemPO.getQuotationBigCategory();
		QuotationSmallCategoryPO quotationSmallCategoryPO = quotationItemPO.getQuotationSmallCategory();
		QuotationVersionPO quotationVersionPO = quotationItemPO.getQuotationVersion();
		MeasurementUnitPO measurementUnitPO = quotationItemPO.getMeasurementUnit();
		WorkTypePO workTypePO = quotationItemPO.getWorkType();
		
		quotationItemVO.setQuotationTypeId(quotationTypePO.getId());
		quotationItemVO.setQuotationType(quotationTypePO.getName());
		
		quotationItemVO.setQuotationClassificationId(quotationClassificationPO.getId());
		quotationItemVO.setQuotationClassification(quotationClassificationPO.getName());
		
		quotationItemVO.setQuotationBigCategoryId(quotationBigCategoryPO.getId());
		quotationItemVO.setQuotationBigCategory(quotationBigCategoryPO.getName());
		
		quotationItemVO.setQuotationSmallCategoryId(quotationSmallCategoryPO.getId());
		quotationItemVO.setQuotationSmallCategory(quotationSmallCategoryPO.getName());
		
		quotationItemVO.setVersionId(quotationVersionPO.getVersionId());
		quotationItemVO.setVersion(quotationVersionPO.getVersionName());
		
		quotationItemVO.setMeasurementUnitId(measurementUnitPO.getId());
		quotationItemVO.setMeasurementUnit(measurementUnitPO.getName());
		
		quotationItemVO.setWorkTypeId(workTypePO.getId());
		quotationItemVO.setWorkType(workTypePO.getName());
	}
	
}
