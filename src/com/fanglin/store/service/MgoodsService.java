package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.utils.Paging;

public interface MgoodsService {

	public void pageMgoods(Paging paging, List<Filter> filters, boolean flag);
	
	public List<MgoodsVO> queryMgoodsByPinyin(MgoodsVO mgoods);
	
	public void addMgoods(MgoodsVO mgoods);

	public void updateMgoods(MgoodsVO mgoods) throws FLException;

	public void updateMgoodsForStatus(MgoodsVO mgoods) throws FLException;
	
}
