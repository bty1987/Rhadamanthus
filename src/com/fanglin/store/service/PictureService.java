package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.PictureVO;

public interface PictureService {

	public List<PictureVO> queryPictureByGid(PictureVO picture);

	public List<PictureVO> queryPicture(PictureVO picture);

	public List<PictureVO> addPicture(PictureVO picture, List<String> imgs);

	public int updatePictureForSort(List<PictureVO> pictures) throws FLException;

	public int deletePicture(PictureVO picture);

}
