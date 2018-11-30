package com.fanglin.market.service;

import java.util.List;

import com.fanglin.market.vo.CardPhotoVO;

public interface CardPhotoService {

	public List<CardPhotoVO> queryCardPhotoByCaid(CardPhotoVO cardPhotoVO);
	
	public void addCardPhoto(List<CardPhotoVO> cardPhotoVOs);
	
	public void deleteCardPhoto(CardPhotoVO cardPhotoVO);
	
}
