package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.quotation.dao.ProtationCostDao;
import com.fanglin.quotation.po.ProtationCostPO;
import com.fanglin.quotation.service.ProtationCostService;
import com.fanglin.quotation.vo.ProtationCostVO;
import com.fanglin.utils.BeanUtil;

@Service("protationCostService")
@Transactional(readOnly = true)
public class ProtationCostServiceImpl implements ProtationCostService {

	@Autowired
	private ProtationCostDao protationCostDao;
	
	@Override
	public List<ProtationCostVO> queryProtationCost(ProtationCostVO protationCost) {

		List<ProtationCostPO> protationCostPOs = protationCostDao.queryProtationCost(protationCost.getPid());
		List<ProtationCostVO> protationCostVOs = new ArrayList<ProtationCostVO>();
		
		for (ProtationCostPO protationCostPO : protationCostPOs) {
			ProtationCostVO protationCostVO = new ProtationCostVO();
			BeanUtil.copyProperties(protationCostPO, protationCostVO);
			protationCostVOs.add(protationCostVO);
		}
		return protationCostVOs;
	}
}
