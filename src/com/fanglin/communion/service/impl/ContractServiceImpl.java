package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ContractDao;
import com.fanglin.communion.po.ContractPO;
import com.fanglin.communion.service.ContractService;
import com.fanglin.communion.vo.ContractVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("contractService")
@Transactional(readOnly = true)
public class ContractServiceImpl implements ContractService {
	
	@Autowired
	private ContractDao ccntractDao;

	@Override
	public void pageContract(Paging paging, List<Filter> filters, int company) {
		
		List<ContractPO> contractPOs = ccntractDao.pageContract(paging, filters, company);
		List<ContractVO> contractVOs = new ArrayList<ContractVO>();
		
		for (ContractPO contractPO : contractPOs) {
			ContractVO contractVO = new ContractVO();
			
			BeanUtil.copyProperties(contractPO, contractVO);
			
			contractVOs.add(contractVO);
		}
		
		paging.setData(contractVOs);
	}

	@Override
	public List<ContractVO> queryContract(int company) {
		
		List<ContractPO> contractPOs = ccntractDao.queryContract(company);
		List<ContractVO> contractVOs = new ArrayList<ContractVO>();
		
		for (ContractPO contractPO : contractPOs) {
			ContractVO contractVO = new ContractVO();
			
			BeanUtil.copyProperties(contractPO, contractVO);
			
			contractVOs.add(contractVO);
		}
		
		return contractVOs;
	}

}
