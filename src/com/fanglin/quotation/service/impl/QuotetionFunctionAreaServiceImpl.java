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
import com.fanglin.quotation.dao.QuotetionDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaPO;
import com.fanglin.quotation.po.QuotetionPO;
import com.fanglin.quotation.service.QuotetionFunctionAreaService;
import com.fanglin.quotation.vo.QuotetionFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotetionFunctionAreaVO;
import com.fanglin.quotation.vo.QuotetionVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.BeanUtil;

@Service("quotetionFunctionAreaService")
@Transactional(readOnly=true)
public class QuotetionFunctionAreaServiceImpl implements QuotetionFunctionAreaService {

	@Autowired
	private FunctionAreaDao functionAreaDao;

	@Autowired
	private FunctionAreaItemDao functionAreaItemDao;
	
	@Autowired
	private QuotetionDao quotetionDao;
	
	@Autowired
	private QuotetionFunctionAreaDao quotetionFunctionAreaDao;
	
	@Autowired
	private QuotetionFunctionAreaItemDao quotetionFunctionAreaItemDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Override
	public List<QuotetionFunctionAreaVO> queryQuotetionFunctionAreaByQid(QuotetionVO quotetionVO) throws FLException {
		
		QuotetionFunctionAreaVO autogeneration = null;
		
		List<QuotetionFunctionAreaVO> quotetionFunctionAreaVOs = new ArrayList<QuotetionFunctionAreaVO>();
		
		List<QuotetionFunctionAreaPO> quotetionFunctionAreaPOs = quotetionFunctionAreaDao.queryQuotetionFunctionAreaByQuotetionId(quotetionVO.getQid());
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());

		for(QuotetionFunctionAreaPO quotetionFunctionAreaPO: quotetionFunctionAreaPOs){
			
			QuotetionFunctionAreaVO quotetionFunctionAreaVO = new QuotetionFunctionAreaVO();
			
			BeanUtil.copyProperties(quotetionFunctionAreaPO, quotetionFunctionAreaVO);
			
			List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItemVOs = new ArrayList<QuotetionFunctionAreaItemVO>();
			
			List<QuotetionFunctionAreaItemPO> quotetionFunctionAreaItemPOs = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), divisor),quotetionFunctionAreaPO.getQfaId());
			
			for(QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO: quotetionFunctionAreaItemPOs){
				
				QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO = new QuotetionFunctionAreaItemVO();
				
				BeanUtil.copyProperties(quotetionFunctionAreaItemPO, quotetionFunctionAreaItemVO);
		
				if(quotetionFunctionAreaItemPO.getQiid() != 0){
					quotetionFunctionAreaItemVO.setQiid(quotetionFunctionAreaItemPO.getQiid());
				}
				
				quotetionFunctionAreaItemVOs.add(quotetionFunctionAreaItemVO);
			}
			
			quotetionFunctionAreaVO.setQuotetionFunctionAreaItems(quotetionFunctionAreaItemVOs);
			
			if("0".equals(quotetionFunctionAreaVO.getType())){
				autogeneration = quotetionFunctionAreaVO;
			}else{
				quotetionFunctionAreaVOs.add(quotetionFunctionAreaVO);
			}
		}
		
		if(autogeneration != null){
			quotetionFunctionAreaVOs.add(autogeneration);
		}
		
		return quotetionFunctionAreaVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<QuotetionFunctionAreaVO> addQuotetionFuctionArea(List<Long> functionAreaIds, QuotetionVO quotetionVO) throws FLException {
		
		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());
		
		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);
		
		List<QuotetionFunctionAreaVO> quotetionFunctionAreaVOs = new ArrayList<QuotetionFunctionAreaVO>();
		
		for(long functionAreaId: functionAreaIds){
			FunctionAreaPO functionAreaPO = functionAreaDao.get(functionAreaId);
			
			QuotetionFunctionAreaVO quotetionFunctionAreaVO = new QuotetionFunctionAreaVO();
			
			quotetionFunctionAreaVO.setQid(quotetionVO.getQid());
			quotetionFunctionAreaVO.setName(functionAreaPO.getFunctionAreaName());
			quotetionFunctionAreaVO.setIndex(functionAreaPO.getFunctionAreaOrder());
			quotetionFunctionAreaVO.setType(functionAreaPO.getType());
			
			QuotetionFunctionAreaPO quotetionFunctionAreaPO = new QuotetionFunctionAreaPO();
			
			BeanUtil.copyProperties(quotetionFunctionAreaVO, quotetionFunctionAreaPO);
			
			quotetionFunctionAreaDao.saveOrUpdate(quotetionFunctionAreaPO);
			
			List<FunctionAreaItemPO> functionAreaItemPOs = functionAreaItemDao.queryFunctionAreaItemByFunctionAreaId(functionAreaId);
			
			List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItemVOs = new ArrayList<QuotetionFunctionAreaItemVO>();
			
			for(FunctionAreaItemPO functionAreaItemPO: functionAreaItemPOs){
				
				short itemType = QuotationFunctionAreaItemPO.TYPE_QUOTATION_COMMON_SHORT;
				
				QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO = new QuotetionFunctionAreaItemVO();
				
				QuotationItemPO quotationItemPO = functionAreaItemPO.getQuotationItem();
			
				if(functionAreaItemPO.getFunctionArea().getType() == FunctionAreaPO.TYPE_AI_INT){
				
					itemType = QuotetionFunctionAreaItemPO.TYPE_QUOTATION_FIX_SHORT;
				}
			
				quotetionFunctionAreaItemVO.setQfaid(quotetionFunctionAreaPO.getQfaId());
				quotetionFunctionAreaItemVO.setQiid(quotationItemPO.getQiId());
				quotetionFunctionAreaItemVO.setName(quotationItemPO.getItemName());
				quotetionFunctionAreaItemVO.setUnitPrice(quotationItemPO.getUnitPrice());
				quotetionFunctionAreaItemVO.setNum(0f);
				quotetionFunctionAreaItemVO.setType(itemType);
				quotetionFunctionAreaItemVO.setSubtype((short)functionAreaItemPO.getQuotationItem().getQuotationType().getId());
				quotetionFunctionAreaItemVO.setMeasurementUnit(quotationItemPO.getMeasurementUnit().getName());
				quotetionFunctionAreaItemVO.setWorkType(quotationItemPO.getWorkType().getName());
				quotetionFunctionAreaItemVO.setDiscount(quotationItemPO.getDiscount());
				quotetionFunctionAreaItemVO.setContent(quotationItemPO.getQuotationItemDes());
				
				quotetionFunctionAreaItemVOs.add(quotetionFunctionAreaItemVO);
			}
			
			quotetionFunctionAreaVO.setQfaId(quotetionFunctionAreaPO.getQfaId());
			quotetionFunctionAreaVO.setQuotetionFunctionAreaItems(quotetionFunctionAreaItemVOs);
			
			quotetionFunctionAreaVOs.add(quotetionFunctionAreaVO);
		}
		
		quotetionDao.update(quotetionPO);
		
		return quotetionFunctionAreaVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotetionFunctionArea(QuotetionFunctionAreaVO quotetionFunctionAreaVO, QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());
		
		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);
		
		QuotetionFunctionAreaPO quotetionFunctionAreaPO = quotetionFunctionAreaDao.get(quotetionFunctionAreaVO.getQfaId());
		
		if(quotetionFunctionAreaPO == null){
			throw new FLException(200012, "功能区不存在");
		}
		
		quotetionFunctionAreaPO.setName(quotetionFunctionAreaVO.getName());
		quotetionFunctionAreaPO.setIndex(quotetionFunctionAreaVO.getIndex());
		
		quotetionFunctionAreaDao.update(quotetionFunctionAreaPO);
		
		quotetionDao.update(quotetionPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotetionFunctionArea(QuotetionFunctionAreaVO quotetionFunctionAreaVO, QuotetionVO quotetionVO) throws FLException {
		
		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());
		
		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);
		
		long qfaId = quotetionFunctionAreaVO.getQfaId();
		
		List<Long> qfaIds = Arrays.asList(new Long[]{quotetionFunctionAreaVO.getQfaId()});
		
		quotetionFunctionAreaDao.deleteQuotetionFunctionAreaByIds(qfaIds);
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		String tableName = QuotetionFunctionAreaItemPO.quotetionFunctionAreaItemTable(qfaId,divisor);
		
		quotetionFunctionAreaItemDao.deleteQuotetionFunctionAreaItemByFunctionAreaId(tableName,qfaId);
		
		quotetionDao.update(quotetionPO);
		
		return 0;
	}
	
	private QuotetionPO checkQuotetionForStatusByEnabled(long qid) throws FLException{
		QuotetionPO quotetionPO = quotetionDao.get(qid);
	
		if(quotetionPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		return quotetionPO;
	}	

}
