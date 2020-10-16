package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.utils.Paging;

public interface ContractService {

	public void pageContract(Paging paging, List<Filter> filters, int company);

	public List<ContractVO> queryContract(int company);

	public int addContract(ContractVO contractVO, int company) throws FLException;

	public int updateContract(ContractVO contractVO) throws FLException;

}
