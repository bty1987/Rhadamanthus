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
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationFunctionAreaItemService;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationFunctionAreaItemService")
@Transactional(readOnly=true)
public class QuotationFunctionAreaItemServiceImpl implements QuotationFunctionAreaItemService {
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Override
	public List<QuotationFunctionAreaItemVO> queryQuotationFunctionAreaItemByQuotationFunctionAreaId(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO) {
		
		List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(quotationFunctionAreaItemVO.getQuotationFunctionAreaId());
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
		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = null;
		
		if(qfaiId != null){
			quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.get(qfaiId);
			
			if(quotationFunctionAreaItemPO != null){
				quotationFunctionAreaItemPO.setNum(quotationFunctionAreaItemVO.getNum());
			}
		}else{
			quotationFunctionAreaItemPO = new QuotationFunctionAreaItemPO();
			
			BeanUtil.copyProperties(quotationFunctionAreaItemVO, quotationFunctionAreaItemPO);
			
			quotationFunctionAreaItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(quotationFunctionAreaItemVO.getQuotationFunctionAreaId()));
			
			if(quotationFunctionAreaItemVO.getType() == 0){
				quotationFunctionAreaItemPO.setQuotationItem(new QuotationItemPO(quotationFunctionAreaItemVO.getQuotationItemId()));
				quotationFunctionAreaItemPO.setContent(null);
			}else{
				quotationFunctionAreaItemPO.setContent(quotationFunctionAreaItemVO.getContent());
				quotationFunctionAreaItemPO.setQuotationItem(null);
			}
		}
		
		quotationFunctionAreaItemDao.saveOrUpdate(quotationFunctionAreaItemPO);
		
		quotationDao.update(quotationPO);
		
		quotationFunctionAreaItemVO.setQfaiId(quotationFunctionAreaItemPO.getQfaiId());
		
		return quotationFunctionAreaItemVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotationFunctionAreaItem(List<Long> qfaiIds, QuotationVO quotationVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);
		
		if(qfaiIds != null && qfaiIds.size() > 0){
			quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByQfaiIds(qfaiIds);
		}
		
		quotationDao.update(quotationPO);
		
		return 0;
	}

}
