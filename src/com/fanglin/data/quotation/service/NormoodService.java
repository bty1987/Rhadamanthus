package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.data.quotation.vo.NormoodVO;

public interface NormoodService {
	
	public List<NormoodVO> queryNormoodByQiid(Long qiid);

	public int addNormood(NormoodVO normoodVO);
	
	public int deleteNormood(NormoodVO normoodVO);
}
