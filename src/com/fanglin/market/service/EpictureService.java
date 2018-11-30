package com.fanglin.market.service;

import java.util.List;

import com.fanglin.market.vo.EpictureVO;

public interface EpictureService {
	
	public List<EpictureVO> queryEpictureByCid(EpictureVO epictureVO);
	
	public int addEpicture(EpictureVO epictureVO);
	
	public int deleteEpicture(EpictureVO epictureVO);

}
