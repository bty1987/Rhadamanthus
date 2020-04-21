package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.data.quotation.vo.NormriceVO;

public interface NormriceService {
	
	public List<NormriceVO> queryNormriceByQiid(Long qiid);
	
	public int addNormrice(NormriceVO normriceVO);
	
	public int deleteNormrice(NormriceVO normriceVO);
}
