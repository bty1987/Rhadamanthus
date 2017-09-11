package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.QuoteTypeDao;
import com.fanglin.production.po.QuoteTypePO;
import com.fanglin.production.service.QuoteTypeService;
import com.fanglin.production.vo.QuoteTypeVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("quotetypeService")
@Transactional(readOnly=true)
public class QuoteTypeServiceImpl implements QuoteTypeService {
	
	@Autowired
	private QuoteTypeDao quotetypeDao;

	@Override
	public void pageQuoteType(Paging paging, List<Filter> filters) {
		List<QuoteTypePO> qutoTypePOs = quotetypeDao.pageQuoteType(paging, filters);
		List<QuoteTypeVO> qutoTypeVOs = new ArrayList<QuoteTypeVO>();
		
		QuoteTypeVO quoteTypeVO;
		
		for(QuoteTypePO quoteTypePO:qutoTypePOs){
			
			quoteTypeVO = new QuoteTypeVO();
			
			BeanUtil.copyPropertie(quoteTypePO, quoteTypeVO);
			
			qutoTypeVOs.add(quoteTypeVO);
		}
		
		paging.setData(qutoTypeVOs);

	}

	@Override
	public List<QuoteTypeVO> queryQuoteType() {
		List<QuoteTypePO> qutoTypePOs = quotetypeDao.queryQuoteType();
		List<QuoteTypeVO> qutoTypeVOs = new ArrayList<QuoteTypeVO>();
		
		QuoteTypeVO quoteTypeVO;
		
		for(QuoteTypePO quoteTypePO:qutoTypePOs){
			
			quoteTypeVO = new QuoteTypeVO();
			
			BeanUtil.copyPropertie(quoteTypePO, quoteTypeVO);
			
			qutoTypeVOs.add(quoteTypeVO);
		}
		
		return qutoTypeVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addQuoteType(QuoteTypeVO quoteTypeVO) throws FLException {
		
		QuoteTypePO quoteTypePO = new QuoteTypePO();
		
		BeanUtil.copyPropertie(quoteTypeVO, quoteTypePO);
		
		quoteTypePO.setStatus(QuoteTypePO.STATUS_ENABLE_SHORT);
		
		quotetypeDao.save(quoteTypePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuoteType(QuoteTypeVO quoteTypeVO) throws FLException {
		
		QuoteTypePO quoteTypePO = quotetypeDao.get(quoteTypeVO.getQtid());
		
		if(quoteTypePO == null){
			throw new FLException(220020,"报价类型不存在");
		}
		
		BeanUtil.copyPropertie(quoteTypeVO, quoteTypePO);
		
		quotetypeDao.update(quoteTypePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuoteTypeForStatus(QuoteTypeVO quoteTypeVO) throws FLException {
		
		QuoteTypePO quoteTypePO = quotetypeDao.get(quoteTypeVO.getQtid());
		
		if(quoteTypePO == null){
			throw new FLException(220020,"报价类型不存在");
		}
		
		quoteTypePO.setStatus(quoteTypeVO.getStatus());
		
		quotetypeDao.update(quoteTypePO);
		
		return 0;
	}

}
