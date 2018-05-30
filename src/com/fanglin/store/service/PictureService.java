package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.PictureVO;

public interface PictureService {

	public List<PictureVO> queryPictureByGid(PictureVO picture);
	
	public List<PictureVO> queryPictureByType(PictureVO picture);
	
	public List<PictureVO> addPicture(PictureVO picture, List<String> picturnUrls);

	public void updatePicture(PictureVO picture) throws FLException;
	
	public void updatePictureForSort(List<PictureVO> pictures);

	public void deletePicture(PictureVO picture) throws FLException;

}
