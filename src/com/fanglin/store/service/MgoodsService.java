package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.utils.Paging;

public interface MgoodsService {

	public void pageMgoods(Paging paging, List<Filter> filters);

	public List<MgoodsVO> queryMgoodsByPinyinName(String pinyinName);
	
	public List<MgoodsVO> queryMgoodsByBid(MgoodsVO mgood);
	
	public List<MgoodsVO> queryMgoodsByStatus(MgoodsVO mgood);

	public MgoodsVO queryMgoodsByGid(MgoodsVO mgood);

	public void addMgoods(MgoodsVO mgood) throws FLException;

	public void updateMgoods(MgoodsVO mgood) throws FLException;
	
	public void updateMgoodsForDefaultImg(MgoodsVO mgood) throws FLException;

	public void updateMgoodsForStatus(MgoodsVO mgood) throws FLException;
	
}
