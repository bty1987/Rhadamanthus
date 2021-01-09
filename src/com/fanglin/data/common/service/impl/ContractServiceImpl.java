package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ContractDao;
import com.fanglin.data.common.service.ContractService;
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.data.po.ContractPO;
import com.fanglin.fadada.signature.Signature;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("contractService")
@Transactional(readOnly = true)
public class ContractServiceImpl implements ContractService {

	@Autowired
	private ContractDao contractDao;

	@Override
	public void pageContract(Paging paging, List<Filter> filters, int company) {

		List<ContractPO> contractPOs = contractDao.pageContract(paging, filters, company);
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

		List<ContractPO> contractPOs = contractDao.queryContract(company);
		List<ContractVO> contractVOs = new ArrayList<ContractVO>();

		for (ContractPO contractPO : contractPOs) {
			ContractVO contractVO = new ContractVO();

			BeanUtil.copyProperties(contractPO, contractVO);

			contractVOs.add(contractVO);
		}

		return contractVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addContract(ContractVO contractVO, int company) throws FLException {

		if (contractDao.countContract(contractVO.getNo()) > 0) {
			throw new FLException(130043, "合同模版已存在");
		}

		ContractPO contractPO = new ContractPO();

		BeanUtil.copyPropertie(contractVO, contractPO);

		contractPO.setCompany(company);

		Signature.template(contractVO.getNo(), null, contractVO.getUrl());

		contractDao.save(contractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateContract(ContractVO contractVO) throws FLException {

		ContractPO contractPO = contractDao.get(contractVO.getCid());

		if (contractPO == null) {
			throw new FLException(130044, "合同模版不存在");
		}

		contractPO.setStatus(contractVO.getStatus());

		contractDao.update(contractPO);

		return 0;
	}

}
