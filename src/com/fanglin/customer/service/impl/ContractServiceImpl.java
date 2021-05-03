package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.service.ContractService;
import com.fanglin.customer.vo.ContractVO;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.utils.BeanUtil;

@Service("cusContractService")
@Transactional(readOnly = true)
public class ContractServiceImpl implements ContractService {

	@Autowired
	private DecorationContractDao decorationContractDao;

	@Override
	public List<ContractVO> queryCusContract(ContractVO contractVO) {

		List<DecorationContractPO> decorationContractPOs = decorationContractDao.queryDecorationContractByOrderId(contractVO.getOrderId());
		List<ContractVO> contractVOs = new ArrayList<ContractVO>();

		for (DecorationContractPO decorationContractPO : decorationContractPOs) {
			contractVO = new ContractVO(new ContractVO());

			BeanUtil.copyProperties(decorationContractPO, contractVO, Arrays.asList("contract", "creater", "signner", "filinner"));

			BeanUtil.copyProperties(decorationContractPO.getContract(), contractVO.getContract());

			contractVOs.add(contractVO);
		}

		return contractVOs;
	}

}
