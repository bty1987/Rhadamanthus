package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.PuoteItemDao;
import com.fanglin.production.dao.QuoteTypeDao;
import com.fanglin.production.po.PuoteItemPO;
import com.fanglin.production.po.QuoteTypePO;
import com.fanglin.production.service.PuoteItemService;
import com.fanglin.production.vo.PuoteItemVO;
import com.fanglin.production.vo.QuoteTypeVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("PuoteItemService")
@Transactional(readOnly = true)
public class PuoteItemServiceImpl implements PuoteItemService {

	@Autowired
	private PuoteItemDao quoteItemDao;

	@Autowired
	private QuoteTypeDao quoteTypeDao;

	@Override
	public void pageQuoteItem(Paging paging, List<Filter> filter) {
		
		List<PuoteItemPO> quoteItemPOs = quoteItemDao.pageQuoteItem(paging, filter);
		List<PuoteItemVO> quoteItemVOs = new ArrayList<PuoteItemVO>();

		PuoteItemVO quoteItemVO;
		
		for (PuoteItemPO quoteItemPO : quoteItemPOs) {
			
			quoteItemVO = new PuoteItemVO(new QuoteTypeVO());
			
			BeanUtil.copyProperties(quoteItemPO, quoteItemVO, Arrays.asList("quoteType"));
			BeanUtil.copyProperties(quoteItemPO.getQuoteType(), quoteItemVO.getQuoteType());

			quoteItemVOs.add(quoteItemVO);
		}

		paging.setData(quoteItemVOs);
	}

	@Override
	public List<PuoteItemVO> queryQuoteItemByPinyin(PuoteItemVO quoteItemVO, int company) {

		Paging paging = new Paging(0, 10);
		
		List<PuoteItemPO> quoteItemPOs = quoteItemDao.queryQuoteItemByPinyin(paging, quoteItemVO.getPinyin(), company);
		List<PuoteItemVO> quoteItemVOs = new ArrayList<PuoteItemVO>();

		for (PuoteItemPO quoteItemPO : quoteItemPOs) {
			
			quoteItemVO = new PuoteItemVO(new QuoteTypeVO());
			
			BeanUtil.copyProperties(quoteItemPO, quoteItemVO, Arrays.asList("quoteType"));
			BeanUtil.copyProperties(quoteItemPO.getQuoteType(), quoteItemVO.getQuoteType());
			
			quoteItemVOs.add(quoteItemVO);
		}
		
		return quoteItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuoteItem(PuoteItemVO quoteItemVO, int company) throws FLException {
		
		PuoteItemPO quoteItemPO = new PuoteItemPO(new QuoteTypePO());

		BeanUtil.copyProperties(quoteItemVO, quoteItemPO, Arrays.asList("quoteType"));
		BeanUtil.copyProperties(quoteTypeDao.get(quoteItemVO.getQuoteType().getQtid()), quoteItemPO.getQuoteType());
		List<String> pinyins = PinYin4Util.getPinyin(quoteItemVO.getName());
		quoteItemPO.setPinyin(pinyins.subList(0, pinyins.size() >= 2 ? 2 : pinyins.size()).toString());
		quoteItemPO.setCompany(company);
		
		quoteItemDao.save(quoteItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuoteItem(PuoteItemVO quoteItemVO) throws FLException {
		
		PuoteItemPO quoteItemPO = quoteItemDao.get(quoteItemVO.getQiid());

		if (quoteItemPO == null) {
			throw new FLException(220019, "报价项不存在");
		}

		quoteItemPO.setFormat(quoteItemVO.getFormat());
		quoteItemPO.setUnitprice(quoteItemVO.getUnitprice());

		quoteItemDao.update(quoteItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuoteItemForStatus(PuoteItemVO quoteItemVO) throws FLException {
		
		PuoteItemPO quoteItemPO = quoteItemDao.get(quoteItemVO.getQiid());

		if (quoteItemPO == null) {
			throw new FLException(220019, "报价项不存在");
		}

		quoteItemPO.setStatus(quoteItemVO.getStatus());

		quoteItemDao.update(quoteItemPO);
		
		return 0;
	}

}
