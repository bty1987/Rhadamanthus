package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.SoodsItemVO;
import com.fanglin.utils.Paging;

public interface SoodsItemService {

	public void pageSoodsItemByQiid(Paging paging, List<Filter> filters, SoodsItemVO soodsItemVO);

	public void pageSoodsItemBySid(Paging paging, List<Filter> filters, SoodsItemVO soodsItemVO);

	public List<SoodsItemVO> querySoodsItemByQiid(SoodsItemVO soodsItemVO) throws FLException;

	public List<SoodsItemVO> querySoodsItemBySid(SoodsItemVO soodsItemVO) throws FLException;

	public int addSoodsItem(SoodsItemVO soodsItemVO, long company) throws FLException;

	public int deleteSoodsItem(SoodsItemVO soodsItemVO) throws FLException;

}
