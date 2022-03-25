package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.data.quotation.vo.NormpackItemVO;

public interface NormpackItemService {	
	
	public List<NormpackItemVO> queryNormpackItem(NormpackItemVO normpackItemVO);
	
	public int addNormpackItem(NormpackItemVO normpackItemVO);
	
	public int deleteNormpackItem(NormpackItemVO normpackItemVO);
	
}
