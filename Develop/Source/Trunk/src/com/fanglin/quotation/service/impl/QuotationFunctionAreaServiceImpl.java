/**
 * @File Name		: QuotationFunctionAreaServiceImpl.java
 * @Package   	: com.fanglin.quotation.service.impl
 * @Version		: 1.0
 * @Date			: 2016-6-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.FunctionAreaItemPO;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.FunctionAreaItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationFunctionAreaService;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationFunctionAreaService")
@Transactional(readOnly=true)
public class QuotationFunctionAreaServiceImpl implements QuotationFunctionAreaService {
	
	@Autowired
	private FunctionAreaDao functionAreaDao;
	
	@Autowired
	private FunctionAreaItemDao functionAreaItemDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;
	
	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Override
	public List<QuotationFunctionAreaVO> queryQuotationFunctionAreaByQuotationId(QuotationVO quotationVO) throws FLException {
		
		QuotationFunctionAreaVO autogeneration = null;
		
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();
		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());
		
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreaPOs){
			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();
			
			BeanUtil.copyProperties(quotationFunctionAreaPO, quotationFunctionAreaVO);
			
			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(quotationFunctionAreaPO.getQfaId());
			
			for(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO: quotationFunctionAreaItemPOs){
				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();
				
				BeanUtil.copyProperties(quotationFunctionAreaItemPO, quotationFunctionAreaItemVO);
				
				quotationFunctionAreaItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());
				
				if(quotationFunctionAreaItemPO.getQuotationItem() != null){
					
					QuotationItemPO quotationItemPO = quotationFunctionAreaItemPO.getQuotationItem();
					
					quotationFunctionAreaItemVO.setQuotationItemId(quotationItemPO.getQiId());
					quotationFunctionAreaItemVO.setContent(quotationItemPO.getQuotationItemDes());
				}
				
				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}
			
			quotationFunctionAreaVO.setQuotationFunctionAreaItems(quotationFunctionAreaItemVOs);
			
			if("0".equals(quotationFunctionAreaVO.getFunctionAreaType())){
				autogeneration = quotationFunctionAreaVO;
			}else{
				quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
			}
		}
		
		if(autogeneration != null){
			quotationFunctionAreaVOs.add(autogeneration);
		}
		
		return quotationFunctionAreaVOs;
	}

	@Override
	public List<QuotationFunctionAreaVO> queryQuotationFunctionAreaForCommonByQuotationId(QuotationVO quotationVO) throws FLException {
		
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();
		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());
		
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreaPOs){
			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();
			
			BeanUtil.copyProperties(quotationFunctionAreaPO, quotationFunctionAreaVO);
			
			if(!"0".equals(quotationFunctionAreaVO.getFunctionAreaType())){
				quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
			}
		}
		
		return quotationFunctionAreaVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<QuotationFunctionAreaVO> addQuotationFuctionAreaByFunctionAreaIds(List<Long> functionAreaIds, QuotationVO quotationVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);
		
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();
		
		for(long functionAreaId: functionAreaIds){
			FunctionAreaPO functionAreaPO = functionAreaDao.get(functionAreaId);
			
			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();
			
			quotationFunctionAreaVO.setFunctionAreaName(functionAreaPO.getFunctionAreaName());
			quotationFunctionAreaVO.setFunctionAreaOrder(functionAreaPO.getFunctionAreaOrder());
			quotationFunctionAreaVO.setFunctionAreaType(functionAreaPO.getFunctionAreaType());
			
			QuotationFunctionAreaPO quotationFunctionAreaPO = new QuotationFunctionAreaPO();
			
			BeanUtil.copyProperties(quotationFunctionAreaVO, quotationFunctionAreaPO);
			quotationFunctionAreaPO.setQuotation(quotationPO);
			
			quotationFunctionAreaDao.saveOrUpdate(quotationFunctionAreaPO);
			
			List<FunctionAreaItemPO> functionAreaItemPOs = functionAreaItemDao.queryFunctionAreaItemByFunctionAreaId(functionAreaId);
			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
			
			for(FunctionAreaItemPO functionAreaItemPO: functionAreaItemPOs){
				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();
				
				QuotationItemPO quotationItemPO = functionAreaItemPO.getQuotationItem();
				
				quotationFunctionAreaItemVO.setQuotationItemId(quotationItemPO.getQiId());
				quotationFunctionAreaItemVO.setItemName(quotationItemPO.getItemName());
				quotationFunctionAreaItemVO.setMeasurementUnit(quotationItemPO.getMeasurementUnit().getName());
				quotationFunctionAreaItemVO.setWorkType(quotationItemPO.getWorkType().getName());
				quotationFunctionAreaItemVO.setDiscount(quotationItemPO.getDiscount());
				quotationFunctionAreaItemVO.setUnitPrice(quotationItemPO.getUnitPrice());
				quotationFunctionAreaItemVO.setType(QuotationFunctionAreaItemPO.TYPE_QUOTATION_COMMON_INT);
				quotationFunctionAreaItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());
				quotationFunctionAreaItemVO.setNum(0f);
				
				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}
			
			quotationFunctionAreaVO.setQfaId(quotationFunctionAreaPO.getQfaId());
			quotationFunctionAreaVO.setQuotationFunctionAreaItems(quotationFunctionAreaItemVOs);
			
			quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
		}
		
		quotationDao.update(quotationPO);
		
		return quotationFunctionAreaVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationVO quotationVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);
		
		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaVO.getQfaId());
		
		if(quotationFunctionAreaPO == null){
			throw new FLException(200012, "功能区不存在");
		}
		
		quotationFunctionAreaPO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
		quotationFunctionAreaPO.setFunctionAreaOrder(quotationFunctionAreaVO.getFunctionAreaOrder());
		
		quotationFunctionAreaDao.update(quotationFunctionAreaPO);
		
		quotationDao.update(quotationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationVO quotationVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);
		
		long qfaId = quotationFunctionAreaVO.getQfaId();
		
		List<Long> qfaIds = Arrays.asList(new Long[]{quotationFunctionAreaVO.getQfaId()});
		
		quotationFunctionAreaDao.deleteQuotationFunctionAreaByIds(qfaIds);
		quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(qfaId);
		
		quotationDao.update(quotationPO);
		
		return 0;
	}

}
