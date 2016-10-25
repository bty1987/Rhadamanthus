/**
 * @File Name		: QuotationMaterialItemServiceImpl.java
 * @Package   	: com.fanglin.quotation.service.impl
 * @Version		: 1.0
 * @Date			: 2016-10-20
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
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationMaterialItemDao;
import com.fanglin.quotation.po.QuotationMaterialItemPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationMaterialItemService;
import com.fanglin.quotation.vo.QuotationMaterialItemVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("quotationMaterialItemService")
@Transactional(readOnly=true)
public class QuotationMaterialItemServiceImpl implements QuotationMaterialItemService {
	
	@Autowired
	private QuotationMaterialItemDao quotationMaterialItemDao;
	
	@Autowired
	private QuotationDao quotationDao;

	@Override
	public List<QuotationMaterialItemVO> queryQuotationMaterialItemByQId(QuotationVO quotationVO) {
		
		List<QuotationMaterialItemPO> quotationMaterialItemPOs = quotationMaterialItemDao.queryQuotationMaterialItemByQId(quotationVO.getQid());
		List<QuotationMaterialItemVO> quotationMaterialItemVOs = new ArrayList<QuotationMaterialItemVO>();
		
		QuotationMaterialItemVO quotationMaterialItemVO;
		
		for(QuotationMaterialItemPO quotationMaterialItemPO: quotationMaterialItemPOs){

			quotationMaterialItemVO = new QuotationMaterialItemVO();
			
			BeanUtil.copyProperties(quotationMaterialItemPO, quotationMaterialItemVO);
			
			quotationMaterialItemVOs.add(quotationMaterialItemVO);
		}
		
		return quotationMaterialItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addQuotationMaterialItem(QuotationMaterialItemVO quotationMaterialItemVO) throws FLException {
		
		QuotationMaterialItemPO quotationMaterialItemPO = new QuotationMaterialItemPO();
		
		BeanUtil.copyProperties(quotationMaterialItemVO, quotationMaterialItemPO);
		
		quotationMaterialItemPO.setDiff(0f);
		
		quotationMaterialItemDao.save(quotationMaterialItemPO);
		
		quotationMaterialItemVO.setQmiId(quotationMaterialItemPO.getQmiId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int upgradeQuotationMaterialItem(QuotationMaterialItemVO quotationMaterialItemVO) throws FLException {
		
		QuotationMaterialItemPO quotationMaterialItemPO = quotationMaterialItemDao.get(quotationMaterialItemVO.getQmiId());
		
		if(quotationMaterialItemPO == null){
			throw new FLException(200023, "报价主材项不存在");
		}
		
		if(quotationMaterialItemPO.getStatus() != QuotationMaterialItemPO.STATUS_INIT_INT ){
			throw new FLException(200024, "报价主材项当前状态不能升级");
		}
		
		QuotationPO quotationPO = quotationDao.get(quotationMaterialItemPO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		QuotationMaterialItemPO _quotationMaterialItemPO = new QuotationMaterialItemPO();
		
		BeanUtil.copyProperties(quotationMaterialItemPO, _quotationMaterialItemPO);
		
		_quotationMaterialItemPO.setDiff(quotationMaterialItemVO.getDiff());
		_quotationMaterialItemPO.setStatus(QuotationMaterialItemPO.STATUS_INIT_INT);
		
		quotationMaterialItemPO.setStatus(QuotationMaterialItemPO.STATUS_UPGRADE_INT);
		
		quotationPO.setMdiff(Arith.add(quotationPO.getMdiff(), quotationMaterialItemVO.getDiff()));
		
		quotationMaterialItemDao.save(_quotationMaterialItemPO);
		quotationMaterialItemDao.update(quotationMaterialItemPO);
		quotationDao.update(quotationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int discountQuotationMaterialItem(QuotationMaterialItemVO quotationMaterialItemVO) throws FLException {
		
		QuotationMaterialItemPO quotationMaterialItemPO = quotationMaterialItemDao.get(quotationMaterialItemVO.getQmiId());
		
		if(quotationMaterialItemPO == null){
			throw new FLException(200023, "报价主材项不存在");
		}
		
		if(quotationMaterialItemPO.getStatus() != QuotationMaterialItemPO.STATUS_INIT_INT ){
			throw new FLException(200025, "报价主材项当前状态不能折价");
		}
		
		QuotationPO quotationPO = quotationDao.get(quotationMaterialItemPO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		QuotationMaterialItemPO _quotationMaterialItemPO = new QuotationMaterialItemPO();
		
		BeanUtil.copyProperties(quotationMaterialItemPO, _quotationMaterialItemPO);
		
		_quotationMaterialItemPO.setDiff(quotationMaterialItemVO.getDiff());
		_quotationMaterialItemPO.setStatus(QuotationMaterialItemPO.STATUS_INIT_INT);
		
		quotationMaterialItemPO.setStatus(QuotationMaterialItemPO.STATUS_DISCOUNT_INT);
		
		quotationPO.setMdiff(Arith.add(quotationPO.getMdiff(), quotationMaterialItemVO.getDiff()));
		
		quotationMaterialItemDao.save(_quotationMaterialItemPO);
		quotationMaterialItemDao.update(quotationMaterialItemPO);
		quotationDao.update(quotationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotationMaterialItem(QuotationMaterialItemVO quotationMaterialItemVO) throws FLException {
		
		QuotationMaterialItemPO quotationMaterialItemPO = quotationMaterialItemDao.get(quotationMaterialItemVO.getQmiId());
		
		if(quotationMaterialItemPO == null){
			throw new FLException(200023, "报价主材项不存在");
		}
		
		QuotationPO quotationPO = quotationDao.get(quotationMaterialItemPO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		quotationPO.setMdiff(Arith.sub(quotationPO.getMdiff(), quotationMaterialItemVO.getDiff()));
		
		quotationMaterialItemDao.delete(quotationMaterialItemPO);
		quotationDao.update(quotationPO);
		
		return 0;
	}

}
