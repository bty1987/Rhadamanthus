package com.fanglin.market.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.CardDao;
import com.fanglin.market.dao.CuserDao;
import com.fanglin.market.po.CardPO;
import com.fanglin.market.po.CuserPO;
import com.fanglin.market.service.CardService;
import com.fanglin.market.vo.CardVO;
import com.fanglin.market.vo.CuserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cardService")
@Transactional(readOnly = true)
public class CardServiceImpl implements CardService {
	
	@Autowired
	private CardDao cardDao;
	
	@Autowired
	private CuserDao cuserDao;

	@Override
	public CardVO queryCardByCuid(CardVO card) {
		
		CardPO cardPO = cardDao.queryCardByCuid(card.getCuser().getCuid());
		CardVO cardVO = new CardVO(new CuserVO());
		
		if (cardPO != null && cardPO.getCuser() != null) {
			BeanUtil.copyProperties(cardPO, cardVO, Arrays.asList("cuser"));
			BeanUtil.copyProperties(cardPO.getCuser(), cardVO.getCuser());
		}
		
		return cardVO;
	}

	@Override
	public void pageCard(Paging paging, List<Filter> filters) {
		
		List<CardPO> cardPOs = cardDao.pageCard(paging, filters);
		List<CardVO> cardVOs = new ArrayList<CardVO>();
		
		for (CardPO cardPO : cardPOs) {
			
			CardVO cardVO = new CardVO(new CuserVO());
			
			BeanUtil.copyProperties(cardPO, cardVO, Arrays.asList("cuser"));
			BeanUtil.copyProperties(cardPO.getCuser(), cardVO.getCuser());
			
			cardVOs.add(cardVO);
		}
		paging.setData(cardVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addCard(CardVO cardVO) throws FLException {

		CardPO cardPO = new CardPO();
		
		BeanUtil.copyProperties(cardVO, cardPO, Arrays.asList("cuser"));
		
		if (cardVO.getCuser().getCuid() != null) {
			
			CuserPO cuser = cuserDao.get(cardVO.getCuser().getCuid());
			
			cardPO.setCuser(cuser);
		}
		
		cardDao.save(cardPO);
		
		cardVO.setCaid(cardPO.getCaid());
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateCard(CardVO cardVO) throws FLException {
		
		CardPO cardPO = cardDao.get(cardVO.getCaid());
		
		if (cardPO == null) return;
		
		BeanUtil.copyProperties(cardVO, cardPO, Arrays.asList("caid", "cuser"));
		
		if (cardVO.getCuser() != null && cardVO.getCuser().getCuid() != null) {
			CuserPO cuser = cuserDao.get(cardVO.getCuser().getCuid());
			cardPO.setCuser(cuser);
		}
		
		cardDao.update(cardPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCard(CardVO cardVO) throws FLException {
		
		CardPO cardPO = cardDao.get(cardVO.getCaid());
		
		if (cardPO == null) return;
		
		cardDao.delete(cardPO);
	}

}
