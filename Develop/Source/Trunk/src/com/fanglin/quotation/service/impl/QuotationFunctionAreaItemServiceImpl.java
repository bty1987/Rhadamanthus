/**
 * @File Name		: QuotationFunctionAreaItemServiceImpl.java
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
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationFunctionAreaItemService;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.BeanUtil;

@Service("quotationFunctionAreaItemService")
@Transactional(readOnly=true)
public class QuotationFunctionAreaItemServiceImpl implements QuotationFunctionAreaItemService {
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public List<QuotationFunctionAreaItemVO> queryQuotationFunctionAreaItemByQuotationFunctionAreaId(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO) throws FLException{
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId( QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaItemVO.getQuotationFunctionAreaId(), divisor),quotationFunctionAreaItemVO.getQuotationFunctionAreaId());
		
		List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
		
		for(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO: quotationFunctionAreaItemPOs){
			
			QuotationFunctionAreaItemVO _quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();
			
			BeanUtil.copyProperties(quotationFunctionAreaItemPO, _quotationFunctionAreaItemVO);
			
			if(quotationFunctionAreaItemPO.getQuotationItem() != null){
				quotationFunctionAreaItemVO.setContent(quotationFunctionAreaItemPO.getQuotationItem().getQuotationItemDes());
			}
			
			quotationFunctionAreaItemVOs.add(_quotationFunctionAreaItemVO);
		}
		
		return quotationFunctionAreaItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public QuotationFunctionAreaItemVO updateQuotationFunctionAreaItem(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO, QuotationVO quotationVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}

		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);
		
		Long qfaiId = quotationFunctionAreaItemVO.getQfaiId();
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());

		if(qfaiId != null){
		
			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId( QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaItemVO.getQuotationFunctionAreaId(), divisor), qfaiId);
			
			if(quotationFunctionAreaItemPO == null){
				throw new FLException(200013, "报价项不存在");
			}
			
			quotationFunctionAreaItemPO.setNum(quotationFunctionAreaItemVO.getNum());
			
			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		}else{

			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = QuotationFunctionAreaItemPO.factoryToInstance(quotationFunctionAreaItemVO.getQuotationFunctionAreaId(), divisor);
			
			BeanUtil.copyProperties(quotationFunctionAreaItemVO, quotationFunctionAreaItemPO);
			
			quotationFunctionAreaItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(quotationFunctionAreaItemVO.getQuotationFunctionAreaId()));
			
			if(quotationFunctionAreaItemVO.getType() == 0 || quotationFunctionAreaItemVO.getType() == 5 || quotationFunctionAreaItemVO.getType() == 4){
				quotationFunctionAreaItemPO.setQuotationItem(new QuotationItemPO(quotationFunctionAreaItemVO.getQuotationItemId()));
				quotationFunctionAreaItemPO.setContent(null);
			}else{
				quotationFunctionAreaItemPO.setContent(quotationFunctionAreaItemVO.getContent());
				quotationFunctionAreaItemPO.setQuotationItem(null);
			}
			quotationFunctionAreaItemDao.save(quotationFunctionAreaItemPO);
			
			quotationFunctionAreaItemVO.setQfaiId(quotationFunctionAreaItemPO.getQfaiId());
		}
		
		quotationDao.update(quotationPO);
		
		return quotationFunctionAreaItemVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationFunctionAreaItemForSpec(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO) throws FLException {
		
		List<Short> types = Arrays.asList(QuotationFunctionAreaItemPO.TYPE_QUOTATION_COMMON_INT, QuotationFunctionAreaItemPO.TYPE_QUOTATION_CUSTOMER_INT);
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaItemVO.getQuotationFunctionAreaId(), divisor),quotationFunctionAreaItemVO.getQfaiId());
		
		if(quotationFunctionAreaItemPO == null){
			throw new FLException(200013, "报价项不存在");
		}
		
		short type = quotationFunctionAreaItemPO.getType();
		
		if(!types.contains(type)){
			
			quotationFunctionAreaItemPO.setUnitPrice(quotationFunctionAreaItemVO.getUnitPrice());
			
			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationFunctionAreaItemByQuotationIdAType(QuotationVO quotationVO, QuotationFunctionAreaItemVO quotationFunctionAreaItemVO) throws FLException {
		
		List<Short> types = Arrays.asList(QuotationFunctionAreaItemPO.TYPE_QUOTATION_COMMON_INT, QuotationFunctionAreaItemPO.TYPE_QUOTATION_CUSTOMER_INT);
		
		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.queryQuotationFunctionAreaForTypeByQuotationId(quotationVO.getQid(),QuotationFunctionAreaPO.TYPE_MANAGEMENT_INT);
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemForTypeByQuotationFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), divisor),quotationFunctionAreaPO.getQfaId(),quotationFunctionAreaItemVO.getType());
		
		if(quotationFunctionAreaItemPO == null){
			throw new FLException(200013, "报价项不存在");
		}
		
		short type = quotationFunctionAreaItemPO.getType();
		
		if(!types.contains(type)){
			quotationFunctionAreaItemPO.setUnitPrice(quotationFunctionAreaItemVO.getUnitPrice());
			
			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotationFunctionAreaItem(List<Long> qfaiIds, QuotationVO quotationVO,QuotationFunctionAreaVO quotationFunctionAreaVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaVO.getQfaId());
		
		if(quotationFunctionAreaPO == null){
			throw new FLException(200012, "功能区不存在");
		}
		
		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);
		
		if(qfaiIds != null && qfaiIds.size() > 0){
			Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
			
			String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(quotationFunctionAreaPO.getQfaId(),divisor);

			quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByQfaiIds(tableName,qfaiIds);
		}
		
		quotationDao.update(quotationPO);
		
		return 0;
	}


}
