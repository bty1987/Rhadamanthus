package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.GoodsKindVO;
import com.fanglin.utils.Paging;

public interface GoodsKindService {

	public void pageGoodsKind(Paging paging, List<Filter> filters);

	public List<GoodsKindVO> queryGoodsKind();

	public void addGoodsKind(GoodsKindVO goodsKind, int company);

	public void updateGoodsKind(GoodsKindVO goodsKind) throws FLException;

	public void updateGoodsKindForStatus(GoodsKindVO goodsKind) throws FLException;

}
