package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.ContractVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ContractService {
	
	public void pageContract(Paging paging, List<Filter> filters, int company);
	
	public List<ContractVO> queryContract(int company);

}
