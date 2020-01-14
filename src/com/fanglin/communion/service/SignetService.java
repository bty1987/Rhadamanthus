package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.SignetVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface SignetService {
	
	public void pageSignet(Paging paging, List<Filter> filters, int company);
	
	public List<SignetVO> querySignet();

}
