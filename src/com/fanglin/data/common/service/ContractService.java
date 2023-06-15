package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.utils.Paging;

public interface ContractService {

	public void pageContract(Paging paging, List<Filter> filters, int company);

	public List<ContractVO> queryContract(ContractVO contract, int company);

	public int countContract(int company) throws FLException;

	public int addContract(ContractVO contractVO, int company) throws FLException;

	public int updateContract(ContractVO contractVO) throws FLException;

	public int updateContractForStatus(ContractVO contractVO) throws FLException;

}