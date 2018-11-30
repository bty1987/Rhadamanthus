package com.fanglin.market.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.market.dao.CardPhotoDao;
import com.fanglin.market.po.CardPhotoPO;
import com.fanglin.market.service.CardPhotoService;
import com.fanglin.market.vo.CardPhotoVO;
import com.fanglin.utils.BeanUtil;

@Service("cardPhotoService")
@Transactional(readOnly = true)
public class CardPhotoServiceImpl implements CardPhotoService {
	
	@Autowired
	private CardPhotoDao cardPhotoDao;

	@Override
	public List<CardPhotoVO> queryCardPhotoByCaid(CardPhotoVO cardPhoto) {
		
		List<CardPhotoPO> cardPhotoPOs = cardPhotoDao.queryCardPhotoByCaid(cardPhoto.getCaid());
		List<CardPhotoVO> cardPhotoVOs = new ArrayList<CardPhotoVO>();
		
		for (CardPhotoPO cardPhotoPO : cardPhotoPOs) {
			CardPhotoVO cardPhotoVO = new CardPhotoVO();
			BeanUtil.copyProperties(cardPhotoPO, cardPhotoVO);
			cardPhotoVOs.add(cardPhotoVO);		
		}
		
		return cardPhotoVOs;
	}


	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addCardPhoto(List<CardPhotoVO> cardPhotoVOs) {

		if ((cardPhotoVOs != null) && (cardPhotoVOs.size() != 0)) {

			for (CardPhotoVO cardPhotoVO : cardPhotoVOs) {

				CardPhotoPO cardPhotoPO = new CardPhotoPO();

				BeanUtil.copyProperties(cardPhotoVO, cardPhotoPO);

				cardPhotoDao.save(cardPhotoPO);
				
				cardPhotoVO.setCpid(cardPhotoPO.getCpid());
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCardPhoto(CardPhotoVO cardPhotoVO) {
		CardPhotoPO cardPhotoPO = cardPhotoDao.get(cardPhotoVO.getCpid());
		
		if (cardPhotoPO == null) return;
		
		cardPhotoDao.delete(cardPhotoPO);

	}

}
