package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.NormriceVO;
import com.fanglin.utils.Paging;

public interface NormriceService {
	
	public void pageNormrice(Paging paging, List<Filter> filters);
	
	public List<NormriceVO> queryNormriceByQiid(Long qiid);
	
	public int addNormrice(NormriceVO normriceVO);
	
	public int deleteNormrice(NormriceVO normriceVO);
	
}
